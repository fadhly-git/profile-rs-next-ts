"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const CreateBeritaSchema = z.object({
    judul_berita: z.string().min(1, "Judul berita wajib diisi").max(255, "Judul terlalu panjang"),
    slug_berita: z.string().min(1, "Slug berita wajib diisi").max(255, "Slug terlalu panjang"),
    isi: z.string().min(10, "Isi berita minimal 10 karakter"),
    id_kategori: z.string().min(1, "Kategori wajib dipilih"),
    status_berita: z.enum(["draft", "publish"]),
    jenis_berita: z.string().optional(),
    bahasa: z.enum(["ID", "EN"]),
    keywords: z.string().optional(),
    thumbnail: z.string().optional(),
    gambar: z.string().optional(),
    icon: z.string().optional(),
    tanggal_post: z.date().optional(),
});

export async function createBeritaAction(formData: FormData) {
    try {
        const validatedFields = CreateBeritaSchema.safeParse({
            judul_berita: formData.get('judul_berita'),
            slug_berita: formData.get('slug_berita'),
            isi: formData.get('isi'),
            id_kategori: formData.get('id_kategori'),
            status_berita: formData.get('status_berita'),
            jenis_berita: formData.get('jenis_berita'),
            bahasa: formData.get('bahasa'),
            keywords: formData.get('keywords'),
            thumbnail: formData.get('thumbnail'),
            gambar: formData.get('gambar'),
            icon: formData.get('icon'),
            tanggal_post: formData.get('tanggal_post') ? new Date(formData.get('tanggal_post') as string) : undefined,
        });

        if (!validatedFields.success) {
            throw new Error(validatedFields.error.issues[0].message);
        }

        const {
            judul_berita,
            slug_berita,
            isi,
            id_kategori,
            status_berita,
            jenis_berita,
            bahasa,
            keywords,
            thumbnail,
            gambar,
            icon,
            tanggal_post
        } = validatedFields.data;

        // Check if slug already exists - optimized with select
        const existingBerita = await prisma.beritas.findFirst({
            where: { slug_berita },
            select: { id_berita: true }
        });

        if (existingBerita) {
            throw new Error("Slug berita sudah digunakan");
        }

        // Get next urutan value efficiently
        const lastBerita = await prisma.beritas.findFirst({
            select: { urutan: true },
            orderBy: { urutan: 'desc' }
        });

        const nextUrutan = (lastBerita?.urutan || 0) + 1;

        // Create with minimal fields and proper defaults
        await prisma.beritas.create({
            data: {
                judul_berita,
                slug_berita,
                isi,
                id_kategori: BigInt(id_kategori),
                id_user: BigInt(1), // TODO: Get from session when auth is implemented
                status_berita,
                jenis_berita: jenis_berita || "artikel",
                bahasa,
                keywords: keywords || null,
                thumbnail: thumbnail || null,
                gambar: gambar || null,
                icon: icon || null,
                tanggal_post: tanggal_post || new Date(),
                updater: "system", // TODO: Get from session when auth is implemented
                hits: 0,
                urutan: nextUrutan,
            },
        });

        // Revalidate only necessary paths
        revalidatePath("/admin/berita");
        if (status_berita === "publish") {
            revalidatePath("/berita");
            revalidatePath(`/berita/${slug_berita}`);
        }

    } catch (error) {
        // More specific error handling - Don't catch redirect errors
        if (error && typeof error === 'object' && 'digest' in error &&
            typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
            throw error; // Re-throw redirect errors
        }

        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Terjadi kesalahan saat menyimpan berita");
    }

    // Redirect outside try-catch to avoid catching redirect errors
    redirect("/admin/berita");
}
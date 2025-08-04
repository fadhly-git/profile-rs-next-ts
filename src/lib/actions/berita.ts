/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Beritas } from "@/types";
import { getServerSession } from 'next-auth';
import { authOptions } from "../authOptions";
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
    user_id: z.string().min(1, "User ID wajib ada"), // Tambahkan ini
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
            user_id: formData.get('user_id'), // Tambahkan ini
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
            tanggal_post,
            user_id // Destructure user_id
        } = validatedFields.data;

        // Check if slug already exists
        const existingBerita = await prisma.beritas.findFirst({
            where: { slug_berita },
            select: { id_berita: true }
        });

        if (existingBerita) {
            throw new Error("Slug berita sudah digunakan");
        }

        // Get session untuk mendapatkan nama user sebagai updater
        const session = await getServerSession(authOptions);
        const updaterName = session?.user?.name || session?.user?.email || "system";

        // Get next urutan value efficiently
        const lastBerita = await prisma.beritas.findFirst({
            select: { urutan: true },
            orderBy: { urutan: 'desc' }
        });

        const nextUrutan = (lastBerita?.urutan || 0) + 1;

        // Create dengan user_id yang dikirim dari frontend
        await prisma.beritas.create({
            data: {
                judul_berita,
                slug_berita,
                isi,
                id_kategori: BigInt(id_kategori),
                id_user: BigInt(user_id), // Gunakan user_id dari formData
                status_berita,
                jenis_berita: jenis_berita || "artikel",
                bahasa,
                keywords: keywords || null,
                thumbnail: thumbnail || null,
                gambar: gambar || null,
                icon: icon || null,
                tanggal_post: tanggal_post || new Date(),
                updater: updaterName, // Gunakan nama dari session
                hits: 0,
                urutan: nextUrutan,
            },
        });

        // Revalidate paths
        revalidatePath("/admin/berita");
        if (status_berita === "publish") {
            revalidatePath("/berita");
            revalidatePath(`/berita/${slug_berita}`);
        }

    } catch (error) {
        if (error && typeof error === 'object' && 'digest' in error &&
            typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
            throw error;
        }

        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Terjadi kesalahan saat menyimpan berita");
    }

    return { success: true, message: "Berita berhasil dibuat" };
}

export async function getKategoriOptions() {
    try {

        const kategoris = await prisma.kategori.findMany({
            where: {
                is_active: true
            },
            select: {
                id_kategori: true,
                nama_kategori: true,
                slug_kategori: true,
            },
            orderBy: {
                nama_kategori: 'asc'
            }
        });

        // Convert BigInt to string for client-side compatibility
        const serializedKategoris = kategoris.map(kategori => ({
            ...kategori,
            id_kategori: kategori.id_kategori.toString()
        }));

        return serializedKategoris;
    } catch (error) {
        console.error('Error fetching categories:', error);

        // Fallback return empty array dengan informasi error
        throw new Error(`Gagal memuat kategori: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Helper function to convert bigint fields to number
function convertBigIntFields(berita: any): Beritas {
    return {
        ...berita,
        id_berita: typeof berita.id_berita === "bigint" ? Number(berita.id_berita) : berita.id_berita,
        id_user: typeof berita.id_user === "bigint" ? Number(berita.id_user) : berita.id_user,
        id_kategori: typeof berita.id_kategori === "bigint" ? Number(berita.id_kategori) : berita.id_kategori,
        // Convert nested kategori if present
        kategori: berita.kategori
            ? {
                ...berita.kategori,
                id_kategori: typeof berita.kategori.id_kategori === "bigint"
                    ? Number(berita.kategori.id_kategori)
                    : berita.kategori.id_kategori,
                parent_id: typeof berita.kategori.parent_id === "bigint"
                    ? Number(berita.kategori.parent_id)
                    : berita.kategori.parent_id,
            }
            : berita.kategori,
        // Convert nested user if present (if user has bigint fields, add conversion here)
        user: berita.user,
    };
}

export const getBeritas = async (): Promise<Beritas[]> => {
    const beritas = await prisma.beritas.findMany({
        include: {
            user: true,
            kategori: true,
        },
        orderBy: {
            id_berita: 'desc',
        },
    });
    // Convert bigint fields to number for each berita
    return beritas.map(convertBigIntFields);
};

export type BeritasWithRelations = Awaited<ReturnType<typeof getBeritas>>;

export async function getBeritaByIdAction(id: string) {
    try {
        const berita = await prisma.beritas.findUnique({
            where: {
                id_berita: BigInt(id)
            },
            include: {
                kategori: {
                    select: {
                        id_kategori: true,
                        nama_kategori: true,
                        slug_kategori: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        if (!berita) {
            return { success: false, error: 'Berita tidak ditemukan' };
        }

        // Convert BigInt to string for JSON serialization
        const serializedBerita: Beritas = {
            ...berita,
            id_berita: berita.id_berita.toString() as unknown as bigint,
            id_user: berita.id_user.toString() as unknown as bigint,
            id_kategori: berita.id_kategori.toString() as unknown as bigint,
            tanggal_post: berita.tanggal_post ? berita.tanggal_post.toISOString() : null,
            createdAt: berita.createdAt,
            updatedAt: berita.updatedAt,
            kategori: berita.kategori ? {
                id_kategori: berita.kategori.id_kategori.toString() as unknown as bigint,
                nama_kategori: berita.kategori.nama_kategori,
                slug_kategori: berita.kategori.slug_kategori,
                is_main_menu: false, // atau isi sesuai data
                is_active: true,     // atau isi sesuai data
                createdAt: new Date(), // atau isi sesuai data
                updatedAt: new Date(), // atau isi sesuai data
            } : undefined,
            user: berita.user ? {
                id: Number(berita.user.id), // pastikan number
                name: berita.user.name,
                email: berita.user.email,
            } : undefined
        };

        return { success: true, data: serializedBerita };
    } catch (error) {
        console.error('Error fetching berita:', error);
        return { success: false, error: 'Gagal memuat data berita' };
    }
}

// Update schema untuk include user_id
const UpdateBeritaSchema = z.object({
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
    user_id: z.string().optional(), // Untuk update, user_id bisa optional karena diambil dari session
});

export async function updateBeritaAction(id: string, formData: FormData) {
    try {
        // Validasi session
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            throw new Error('Unauthorized');
        }

        // Validasi data dengan schema
        const validatedFields = UpdateBeritaSchema.safeParse({
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
            user_id: formData.get('user_id'), // Ambil user_id dari form
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
            tanggal_post,
            user_id
        } = validatedFields.data;

        // Cek apakah berita exists
        const existingBerita = await prisma.beritas.findUnique({
            where: { id_berita: BigInt(id) }
        });

        if (!existingBerita) {
            throw new Error('Berita tidak ditemukan');
        }

        // Check if slug already exists untuk berita lain (exclude current berita)
        const existingSlug = await prisma.beritas.findFirst({
            where: { 
                slug_berita,
                NOT: {
                    id_berita: BigInt(id)
                }
            },
            select: { id_berita: true }
        });

        if (existingSlug) {
            throw new Error("Slug berita sudah digunakan");
        }

        // Tentukan siapa yang melakukan update
        const updaterName = session.user.name || session.user.email || 'Unknown';
        
        // Untuk update, gunakan user_id dari session sebagai updater
        // dan user_id dari form sebagai penulis (jika ada)
        const updateData = {
            judul_berita,
            slug_berita,
            isi,
            id_kategori: BigInt(id_kategori),
            status_berita,
            jenis_berita: jenis_berita || "artikel",
            bahasa,
            keywords: keywords || null,
            thumbnail: thumbnail || null,
            gambar: gambar || null,
            icon: icon || null,
            tanggal_post: tanggal_post || existingBerita.tanggal_post,
            updater: updaterName,
            updatedAt: new Date(),
            // Jika user_id dikirim dari form, update id_user
            // Jika tidak, tetap gunakan id_user yang ada
            ...(user_id && { id_user: BigInt(user_id) })
        };

        // Update berita
        await prisma.beritas.update({
            where: { id_berita: BigInt(id) },
            data: updateData
        });

        // Revalidate cache
        revalidatePath('/admin/berita');
        revalidatePath(`/admin/berita/${id}`);
        revalidatePath(`/berita/${slug_berita}`);

    } catch (error) {
        console.error('Error updating berita:', error);
        throw new Error(error instanceof Error ? error.message : 'Gagal mengupdate berita');
    }

    return { success: true, message: 'Berita berhasil diperbarui' };
}

export const deleteBeritaAction = async (id: string) => {
    await prisma.beritas.delete({
        where: {
            id_berita: BigInt(id),
        },
    });
    revalidatePath("/admin/berita");
};
// app/admin/kategori/edit/[id]/editKategoriAction.ts
"use server"

import { prisma } from '@/lib/prisma'
import { revalidatePath } from "next/cache"

export async function getKategoriById(id: string) {
    try {
        const kategori = await prisma.kategori.findUnique({
            where: {
                id_kategori: BigInt(id)
            }
        });

        if (!kategori) return null;

        // Convert BigInt to string for serialization
        return {
            ...kategori,
            id_kategori: kategori.id_kategori.toString(),
            parent_id: kategori.parent_id?.toString() || null
        };
    } catch (error) {
        console.error("Error fetching kategori:", error);
        return null;
    }
}

export async function updateKategoriAction(id: string, formData: FormData) {
    try {
        const nama_kategori = formData.get("nama_kategori") as string
        const slug_kategori = formData.get("slug_kategori") as string
        const keterangan = formData.get("keterangan") as string
        const parent_id = formData.get("parent_id") ? BigInt(formData.get("parent_id") as string) : null
        const urutan = formData.get("urutan") ? parseInt(formData.get("urutan") as string) : null
        const gambar = formData.get("gambar") as string || null
        const is_main_menu = formData.get("is_main_menu") === "on"
        const is_active = formData.get("is_active") === "on"

        await prisma.kategori.update({
            where: {
                id_kategori: BigInt(id)
            },
            data: {
                nama_kategori,
                slug_kategori,
                keterangan,
                parent_id,
                urutan,
                gambar,
                is_main_menu,
                is_active,
            }
        })

        revalidatePath("/admin/kategori")
        return { success: true }
    } catch (error) {
        console.error("Error updating kategori:", error)
        throw new Error("Gagal mengupdate kategori")
    }
}

export async function getKategoriListExcept(excludeId: string) {
    try {
        const kategoriList = await prisma.kategori.findMany({
            where: {
                is_active: true,
                NOT: {
                    id_kategori: BigInt(excludeId)
                }
            },
            select: {
                id_kategori: true,
                nama_kategori: true,
                parent_id: true,
            },
            orderBy: { nama_kategori: 'asc' }
        })

        return kategoriList.map(k => ({
            ...k,
            id_kategori: k.id_kategori.toString(),
            parent_id: k.parent_id?.toString() || null
        }));
    } catch (error) {
        console.error("Error fetching kategori:", error)
        return []
    }
}

export async function deleteKategoriAction(id: string) {
    try {
        // Check if kategori has children or related data
        const kategori = await prisma.kategori.findUnique({
            where: {
                id_kategori: BigInt(id)
            },
            include: {
                children: true,
                beritas: true,
                menu: true,
                Halaman: true
            }
        });

        if (!kategori) {
            throw new Error("Kategori tidak ditemukan");
        }

        // Check for dependencies
        if (kategori.children && kategori.children.length > 0) {
            throw new Error("Kategori memiliki sub-kategori. Hapus sub-kategori terlebih dahulu.");
        }

        if (kategori.beritas && kategori.beritas.length > 0) {
            throw new Error("Kategori memiliki berita terkait. Pindahkan atau hapus berita terlebih dahulu.");
        }

        if (kategori.Halaman && kategori.Halaman.length > 0) {
            throw new Error("Kategori memiliki halaman terkait. Pindahkan atau hapus halaman terlebih dahulu.");
        }

        // Delete kategori
        await prisma.kategori.delete({
            where: {
                id_kategori: BigInt(id)
            }
        });

        revalidatePath("/admin/kategori");
        return { success: true };
    } catch (error: unknown) {
        console.error("Error deleting kategori:", error);
        if (error instanceof Error) {
            throw new Error(error.message || "Gagal menghapus kategori");
        }
        throw new Error("Gagal menghapus kategori");
    }
}
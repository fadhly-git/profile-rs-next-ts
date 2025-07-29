// app/admin/kategori/deleteKategoriAction.ts
"use server"

import { prisma } from '@/lib/prisma'
import { revalidatePath } from "next/cache"

export async function deleteKategoriAction(id: string) {
    try {
        const kategori = await prisma.kategori.findUnique({
            where: {
                id_kategori: BigInt(id)
            },
            include: {
                children: true,
                beritas: true,
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
// app/admin/kategori/create/createKategoriAction.ts
"use server"

import { prisma } from '@/lib/prisma'
import { revalidatePath } from "next/cache"

export async function createKategoriAction(formData: FormData) {
    try {
        const nama_kategori = formData.get("nama_kategori") as string
        const slug_kategori = formData.get("slug_kategori") as string
        const keterangan = formData.get("keterangan") as string
        const parent_id = formData.get("parent_id") ? BigInt(formData.get("parent_id") as string) : null
        const urutan = formData.get("urutan") ? parseInt(formData.get("urutan") as string) : null
        const gambar = formData.get("gambar") as string || null
        const is_main_menu = formData.get("is_main_menu") === "on"
        const is_active = formData.get("is_active") === "on"

        await prisma.kategori.create({
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
        console.error("Error creating kategori:", error)
        throw new Error("Gagal membuat kategori")
    }
}

export async function getKategoriList() {
    try {
        const kategoriList = await prisma.kategori.findMany({
            where: { is_active: true },
            select: {
                id_kategori: true,
                nama_kategori: true,
                parent_id: true,
            },
            orderBy: { nama_kategori: 'asc' }
        })

        return kategoriList
    } catch (error) {
        console.error("Error fetching kategori:", error)
        return []
    }
}
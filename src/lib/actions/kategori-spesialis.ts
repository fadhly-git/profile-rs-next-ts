// src/lib/actions/kategori-spesialis.ts
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Actions untuk Spesialis
export async function getAllSpesialis() {
    try {
        const spesialis = await prisma.kategoriSpesialis.findMany({
            orderBy: {
                nama_spesialis: 'asc',
            },
        })

        return spesialis.map(s => ({
            ...s,
            id_spesialis: s.id.toString(),
        }))
    } catch (error) {
        console.error("Error getting spesialis:", error)
        return []
    }
}

export async function createSpesialis(data: { nama_spesialis: string; deskripsi?: string }) {

    if (!data.nama_spesialis?.trim()) {
        throw new Error("Nama spesialis tidak boleh kosong")
    }

    try {
        const spesialis = await prisma.kategoriSpesialis.create({
            data: {
                nama_spesialis: data.nama_spesialis.trim(),
                deskripsi: data.deskripsi?.trim() || null,
            },
        })

        revalidatePath("/admin/jadwal-dokter")
        revalidatePath("/admin/dokter")
        revalidatePath("/admin/data-dokter")
        revalidatePath("/admin/kategori-spesialis")
        revalidatePath("/layanan/jadwal-dokter")
        revalidatePath("/")

        return {
            ...spesialis,
            id_spesialis: spesialis.id.toString(),
        }
    } catch (error) {
        console.error("Error creating spesialis:", error)

        // Handle unique constraint error jika nama sudah ada
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            throw new Error("Nama spesialis sudah ada, gunakan nama lain")
        }

        throw new Error("Gagal membuat data spesialis")
    }
}

export async function updateSpesialis(id: string, data: { nama_spesialis: string; deskripsi?: string }) {
    if (!data.nama_spesialis?.trim()) {
        throw new Error("Nama spesialis tidak boleh kosong")
    }

    try {
        const spesialis = await prisma.kategoriSpesialis.update({
            where: { id: BigInt(id) },
            data: {
                nama_spesialis: data.nama_spesialis.trim(),
                deskripsi: data.deskripsi?.trim() || null,
            },
        })

        revalidatePath("/admin/jadwal-dokter")
        revalidatePath("/admin/dokter")
        revalidatePath("/admin/data-dokter")
        revalidatePath("/admin/kategori-spesialis")
        revalidatePath("/layanan/jadwal-dokter")
        revalidatePath("/")

        return {
            ...spesialis,
            id_spesialis: spesialis.id.toString(),
        }
    } catch (error) {
        console.error("Error updating spesialis:", error)
        throw new Error("Gagal mengupdate data spesialis")
    }
}

export async function deleteSpesialis(id: string) {
    try {
        // Cek apakah spesialis masih digunakan
        const usage = await prisma.dokter_spesialis.findFirst({
            where: { id_spesialis: BigInt(id) }
        })

        if (usage) {
            throw new Error("Spesialis tidak dapat dihapus karena masih digunakan oleh dokter")
        }

        await prisma.kategoriSpesialis.delete({
            where: { id: BigInt(id) },
        })

        revalidatePath("/admin/jadwal-dokter")
        revalidatePath("/admin/dokter")
        revalidatePath("/admin/data-dokter")
        revalidatePath("/admin/kategori-spesialis")
        revalidatePath("/layanan/jadwal-dokter")
        revalidatePath("/")

        return { success: true }
    } catch (error) {
        console.error("Error deleting spesialis:", error)
        throw new Error(error instanceof Error ? error.message : "Gagal menghapus data spesialis")
    }
}

export async function getSpesialisById(id: string) {
    try {
        const spesialis = await prisma.kategoriSpesialis.findUnique({
            where: { id: BigInt(id) },
            include: {
                dokter_spesialis: {
                    include: {
                        dokter: true
                    }
                }
            }
        })

        if (!spesialis) return null

        return {
            ...spesialis,
            id_spesialis: spesialis.id.toString(),
            dokter_spesialis: spesialis.dokter_spesialis.map(ds => ({
                ...ds,
                id_dokter: ds.id_dokter.toString(),
                id_spesialis: ds.id_spesialis.toString(),
                dokter: {
                    ...ds.dokter,
                    id_dokter: ds.dokter.id_dokter.toString(),
                    userId: ds.dokter.userId?.toString() || null
                }
            }))
        }
    } catch (error) {
        console.error("Error getting spesialis by id:", error)
        return null
    }
}
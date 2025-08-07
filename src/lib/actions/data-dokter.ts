// @/lib/actions/data-dokter.ts
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export interface DokterFormData {
    nama_dokter: string
    photo: string
    userId?: string
    spesialis_ids: string[]
}

export interface SpesialisData {
    id_spesialis: string
    nama_spesialis: string
    deskripsi?: string
}

// Actions untuk Dokter
export async function createDokter(data: DokterFormData) {
    try {
        const dokter = await prisma.dokters.create({
            data: {
                nama_dokter: data.nama_dokter,
                photo: data.photo,
                userId: data.userId ? BigInt(data.userId) : null,
            },
        })

        // Tambahkan relasi spesialis
        if (data.spesialis_ids.length > 0) {
            await prisma.dokter_spesialis.createMany({
                data: data.spesialis_ids.map(id => ({
                    id_dokter: dokter.id_dokter,
                    id_spesialis: BigInt(id)
                }))
            })
        }

        revalidatePath("/admin/data-dokter")
        return { success: true, id_dokter: dokter.id_dokter.toString() }
    } catch (error) {
        console.error("Error creating dokter:", error)
        throw new Error("Gagal membuat data dokter")
    }
}

export async function updateDokter(id: string, data: DokterFormData) {
    try {
        await prisma.dokters.update({
            where: { id_dokter: BigInt(id) },
            data: {
                nama_dokter: data.nama_dokter,
                photo: data.photo,
                userId: data.userId ? BigInt(data.userId) : null,
            },
        })

        // Hapus relasi spesialis lama
        await prisma.dokter_spesialis.deleteMany({
            where: { id_dokter: BigInt(id) }
        })

        // Tambahkan relasi spesialis baru
        if (data.spesialis_ids.length > 0) {
            await prisma.dokter_spesialis.createMany({
                data: data.spesialis_ids.map(spesialis_id => ({
                    id_dokter: BigInt(id),
                    id_spesialis: BigInt(spesialis_id)
                }))
            })
        }

        revalidatePath("/admin/data-dokter")
        revalidatePath(`/admin/data-dokter/${id}`)
        revalidatePath('/layanan/jadwal-dokter')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error("Error updating dokter:", error)
        throw new Error("Gagal mengupdate data dokter")
    }
}

export async function getDokterById(id: string) {
    try {
        const dokter = await prisma.dokters.findUnique({
            where: { id_dokter: BigInt(id) },
            include: {
                dokter_spesialis: {
                    include: {
                        spesialis: true
                    }
                },
            },
        })

        if (!dokter) return null

        return {
            ...dokter,
            id_dokter: dokter.id_dokter.toString(),
            userId: dokter.userId?.toString() || null,
            dokter_spesialis: dokter.dokter_spesialis.map(ds => ({
                ...ds,
                id_dokter: ds.id_dokter.toString(),
                id_spesialis: ds.id_spesialis.toString(),
            }))
        }
    } catch (error) {
        console.error("Error getting dokter:", error)
        return null
    }
}

export async function deleteDokter(id: string) {
    try {
        // Hapus relasi di dokter_spesialis terlebih dahulu
        await prisma.dokter_spesialis.deleteMany({
            where: { id_dokter: BigInt(id) },
        })

        await prisma.dokters.delete({
            where: { id_dokter: BigInt(id) },
        })

        revalidatePath("/admin/data-dokter")
        revalidatePath(`/admin/data-dokter/${id}`)
        revalidatePath('/layanan/jadwal-dokter')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error("Error deleting dokter:", error)
        throw new Error("Gagal menghapus data dokter")
    }
}

export async function getAllDokter() {
    try {
        const dokter = await prisma.dokters.findMany({
            include: {
                dokter_spesialis: true,
            },
            orderBy: {
                nama_dokter: 'asc',
            },
        })

        return dokter.map(d => ({
            ...d,
            id_dokter: d.id_dokter.toString(),
            userId: d.userId?.toString() || null,
        }))
    } catch (error) {
        console.error("Error getting all dokter:", error)
        return []
    }
}
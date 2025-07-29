// lib/actions/halaman.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface HalamanFormData {
    judul: string
    slug: string
    konten: string
    gambar?: string
    kategoriId?: string
    is_published: boolean
}

export async function createHalaman(data: HalamanFormData) {
    try {
        await prisma.halaman.create({
            data: {
                judul: data.judul,
                slug: data.slug,
                konten: data.konten,
                gambar: data.gambar || null,
                kategoriId: data.kategoriId ? BigInt(data.kategoriId) : null,
                is_published: data.is_published,
            },
        })

        revalidatePath('/admin/halaman')
        return { success: true }
    } catch (error) {
        console.error('Error creating halaman:', error)
        throw new Error('Gagal membuat halaman')
    }
}

export async function updateHalaman(id: string, data: HalamanFormData) {
    try {
        await prisma.halaman.update({
            where: { id_halaman: BigInt(id) },
            data: {
                judul: data.judul,
                slug: data.slug,
                konten: data.konten,
                gambar: data.gambar || null,
                kategoriId: data.kategoriId ? BigInt(data.kategoriId) : null,
                is_published: data.is_published,
            },
        })

        revalidatePath('/admin/halaman')
        return { success: true }
    } catch (error) {
        console.error('Error updating halaman:', error)
        throw new Error('Gagal mengupdate halaman')
    }
}

export async function deleteHalaman(id: string) {
    try {
        await prisma.halaman.delete({
            where: { id_halaman: BigInt(id) },
        })

        revalidatePath('/admin/halaman')
        return { success: true }
    } catch (error) {
        console.error('Error deleting halaman:', error)
        throw new Error('Gagal menghapus halaman')
    }
}

export async function getHalaman(id: string) {
    try {
        const halaman = await prisma.halaman.findUnique({
            where: { id_halaman: BigInt(id) },
            include: {
                kategori: true,
            },
        })

        if (!halaman) {
            throw new Error('Halaman tidak ditemukan')
        }

        return {
            ...halaman,
            id_halaman: halaman.id_halaman.toString(),
            kategoriId: halaman.kategoriId?.toString() || null,
            kategori: halaman.kategori ? {
                ...halaman.kategori,
                id_kategori: halaman.kategori.id_kategori.toString(),
                parent_id: halaman.kategori.parent_id?.toString() || null,
            } : null,
        }
    } catch (error) {
        console.error('Error getting halaman:', error)
        throw new Error('Gagal mengambil data halaman')
    }
}

export async function getAllHalaman() {
    try {
        const halaman = await prisma.halaman.findMany({
            include: {
                kategori: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        })

        return halaman.map(item => ({
            ...item,
            id_halaman: item.id_halaman.toString(),
            kategoriId: item.kategoriId?.toString() || null,
            kategori: item.kategori ? {
                ...item.kategori,
                id_kategori: item.kategori.id_kategori.toString(),
                parent_id: item.kategori.parent_id?.toString() || null,
            } : null,
        }))
    } catch (error) {
        console.error('Error getting all halaman:', error)
        throw new Error('Gagal mengambil daftar halaman')
    }
}

export async function getAllKategori() {
    try {
        const kategori = await prisma.kategori.findMany({
            where: { is_active: true },
            orderBy: { nama_kategori: 'asc' },
        })

        return kategori.map(item => ({
            ...item,
            id_kategori: item.id_kategori.toString(),
            parent_id: item.parent_id?.toString() || null,
        }))
    } catch (error) {
        console.error('Error getting kategori:', error)
        return []
    }
}
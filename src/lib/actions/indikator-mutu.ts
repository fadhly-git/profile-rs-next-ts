// lib/actions/indikator-mutu.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { IndikatorMutu } from '@/types'

export type CreateIndikatorMutuInput = {
    period: string
    judul: string
    capaian: string
    target: string
}

export type UpdateIndikatorMutuInput = CreateIndikatorMutuInput & {
    id: number
}

export async function getIndikatorMutu(): Promise<IndikatorMutu[]> {
    try {
        const data = await prisma.indikatormutu.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return data
    } catch (error) {
        console.error('Error fetching indikator mutu:', error)
        return []
    }
}

export async function getIndikatorMutuById(id: number): Promise<IndikatorMutu | null> {
    try {
        const data = await prisma.indikatormutu.findUnique({
            where: { id }
        })
        return data
    } catch (error) {
        console.error('Error fetching indikator mutu by id:', error)
        return null
    }
}

export async function createIndikatorMutu(input: CreateIndikatorMutuInput) {
    try {
        await prisma.indikatormutu.create({
            data: {
                ...input,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })
        revalidatePath('/admin/indikator-mutu')
        return { success: true, message: 'Indikator mutu berhasil ditambahkan' }
    } catch (error) {
        console.error('Error creating indikator mutu:', error)
        return { success: false, message: 'Gagal menambahkan indikator mutu' }
    }
}

export async function updateIndikatorMutu(input: UpdateIndikatorMutuInput) {
    try {
        await prisma.indikatormutu.update({
            where: { id: input.id },
            data: {
                period: input.period,
                judul: input.judul,
                capaian: input.capaian,
                target: input.target,
                updatedAt: new Date()
            }
        })
        revalidatePath('/admin/indikator-mutu')
        return { success: true, message: 'Indikator mutu berhasil diperbarui' }
    } catch (error) {
        console.error('Error updating indikator mutu:', error)
        return { success: false, message: 'Gagal memperbarui indikator mutu' }
    }
}

export async function deleteIndikatorMutu(id: number) {
    try {
        await prisma.indikatormutu.delete({
            where: { id }
        })
        revalidatePath('/admin/indikator-mutu')
        return { success: true, message: 'Indikator mutu berhasil dihapus' }
    } catch (error) {
        console.error('Error deleting indikator mutu:', error)
        return { success: false, message: 'Gagal menghapus indikator mutu' }
    }
}
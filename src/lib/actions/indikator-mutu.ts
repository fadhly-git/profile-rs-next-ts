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

// NEW: Server Action untuk mendapatkan judul unik
export async function getUniqueJuduls(): Promise<string[]> {
    try {
        const juduls = await prisma.indikatormutu.findMany({
            distinct: ['judul'],
            select: {
                judul: true
            },
            where: {
                judul: {
                    not: null // Filter out null judul entries
                }
            }
        })
        return juduls.map(item => item.judul as string).filter(Boolean)
    } catch (error) {
        console.error('Error fetching unique juduls:', error)
        return []
    }
}

// Tambahan functions untuk handle judul
export async function getExistingTitles(): Promise<string[]> {
    try {
        const titles = await prisma.indikatormutu.findMany({
            select: { judul: true },
            distinct: ['judul'],
            where: { judul: { not: null } }
        })
        return titles.map(t => t.judul!).filter(Boolean)
    } catch (error) {
        console.error('Error fetching titles:', error)
        return []
    }
}

export async function getPeriodsForTitle(judul: string): Promise<string[]> {
    try {
        const periods = await prisma.indikatormutu.findMany({
            select: { period: true },
            where: { judul },
            orderBy: { period: 'desc' }
        })
        return periods.map(p => p.period!).filter(Boolean)
    } catch (error) {
        console.error('Error fetching periods for title:', error)
        return []
    }
}

export async function checkDuplicateEntry(judul: string, period: string): Promise<boolean> {
    try {
        const existing = await prisma.indikatormutu.findFirst({
            where: { judul, period }
        })
        return !!existing
    } catch (error) {
        console.error('Error checking duplicate:', error)
        return false
    }
}

// Update existing functions...
export async function getIndikatorMutu(): Promise<IndikatorMutu[]> {
    try {
        const data = await prisma.indikatormutu.findMany({
            orderBy: [
                { judul: 'asc' },
                { period: 'desc' }
            ]
        })
        return data
    } catch (error) {
        console.error('Error fetching indikator mutu:', error)
        return []
    }
}

export async function createIndikatorMutu(input: CreateIndikatorMutuInput) {
    try {
        // Check for duplicate
        const isDuplicate = await checkDuplicateEntry(input.judul, input.period)
        if (isDuplicate) {
            return {
                success: false,
                message: `Data untuk "${input.judul}" pada periode "${input.period}" sudah ada`
            }
        }

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
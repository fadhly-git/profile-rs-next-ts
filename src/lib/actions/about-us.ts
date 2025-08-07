// app/lib/actions/about-us.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface AboutUsData {
    title?: string
    short_description: string
    image_url?: string
    read_more_link?: string
}

export async function getAboutUsSections() {
    try {
        return await prisma.aboutUsSection.findMany({
            orderBy: { createdAt: 'desc' }
        })
    } catch (error) {
        console.error('Error fetching about us sections:', error)
        return []
    }
}

export async function getAboutUsById(id: number) {
    try {
        return await prisma.aboutUsSection.findUnique({
            where: { id }
        })
    } catch (error) {
        console.error('Error fetching about us section:', error)
        return null
    }
}

export async function createAboutUs(data: AboutUsData) {
    try {
        await prisma.aboutUsSection.create({
            data
        })
        revalidatePath('/app/admin/tentang-kami')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error creating about us section:', error)
        throw new Error('Gagal membuat section About Us')
    }
}

export async function updateAboutUs(id: number, data: AboutUsData) {
    try {
        await prisma.aboutUsSection.update({
            where: { id },
            data
        })
        revalidatePath('/app/admin/tentang-kami')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error updating about us section:', error)
        throw new Error('Gagal mengupdate section About Us')
    }
}

export async function deleteAboutUs(id: number) {
    try {
        await prisma.aboutUsSection.delete({
            where: { id }
        })
        revalidatePath('/app/admin/tentang-kami')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error deleting about us section:', error)
        throw new Error('Gagal menghapus section About Us')
    }
}
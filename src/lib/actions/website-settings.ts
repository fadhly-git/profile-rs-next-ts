// lib/actions/website-settings.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { WebsiteSettings } from '@prisma/client'

export type WebsiteSettingsInput = Omit<WebsiteSettings, 'id' | 'createdAt' | 'updatedAt'>

export async function getWebsiteSettings() {
    try {
        const settings = await prisma.websiteSettings.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return settings
    } catch (error) {
        console.error('Error fetching website settings:', error)
        throw new Error('Gagal mengambil pengaturan website')
    }
}

export async function getWebsiteSettingsById(id: number) {
    try {
        const settings = await prisma.websiteSettings.findUnique({
            where: { id }
        })
        return settings
    } catch (error) {
        console.error('Error fetching website settings:', error)
        throw new Error('gagal mengambil pengaturan website')
    }
}

export async function createWebsiteSettings(data: WebsiteSettingsInput) {
    try {
        const result = await prisma.websiteSettings.create({
            data: {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        })

        revalidatePath('/admin/website-settings')
        return { success: true, data: result }
    } catch (error) {
        console.error('Error creating website settings:', error)
        throw new Error('Gagal membuat pengaturan website')
    }
}

export async function updateWebsiteSettings(id: number, data: WebsiteSettingsInput) {
    try {
        const result = await prisma.websiteSettings.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            }
        })

        revalidatePath('/admin/website-settings')
        return { success: true, data: result }
    } catch (error) {
        console.error('Error updating website settings:', error)
        throw new Error('Gagal memperbarui pengaturan website')
    }
}

export async function deleteWebsiteSettings(id: number) {
    try {
        await prisma.websiteSettings.delete({
            where: { id }
        })

        revalidatePath('/admin/website-settings')
        return { success: true }
    } catch (error) {
        console.error('Error deleting website settings:', error)
        throw new Error('Gagal menghapus pengaturan website')
    }
}
"use server"

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { isValidUrl } from '@/lib/validators'

export async function getHeroSections() {
    try {
        const heroSections = await prisma.heroSection.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return heroSections.map(item => ({
            ...item,
            createdAt: item.createdAt ?? undefined,
            updatedAt: item.updatedAt ?? undefined,
        }))
    } catch (error) {
        console.error('Error fetching hero sections:', error)
        return []
    }
}

export async function deleteHeroSectionAction(id: string) {
    try {
        await prisma.heroSection.delete({
            where: { id: parseInt(id) }
        })
        revalidatePath('/admin/hero-section-or-banner')
    } catch (error) {
        console.error('Error deleting hero section:', error)
        throw new Error('Gagal menghapus hero section')
    }
}

export async function createHeroSectionAction(formData: FormData) {
    try {
        const data = {
            headline: formData.get('headline') as string,
            subheading: formData.get('subheading') as string || null,
            background_image: formData.get('background_image') as string || null,
            cta_button_text_1: formData.get('cta_button_text_1') as string || null,
            cta_button_link_1: formData.get('cta_button_link_1') as string || null,
            cta_button_text_2: formData.get('cta_button_text_2') as string || null,
            cta_button_link_2: formData.get('cta_button_link_2') as string || null,
        }

        // Validasi required fields
        if (!data.headline) {
            throw new Error('Headline wajib diisi')
        }

        // Validasi URL jika ada
        if (data.cta_button_link_1 && !isValidUrl(data.cta_button_link_1)) {
            throw new Error('URL CTA Button 1 tidak valid')
        }
        if (data.cta_button_link_2 && !isValidUrl(data.cta_button_link_2)) {
            throw new Error('URL CTA Button 2 tidak valid')
        }

        await prisma.heroSection.create({
            data
        })

        revalidatePath('/admin/hero-section-or-banner-or-banner')
    } catch (error) {
        console.error('Error creating hero section:', error)
        throw new Error(error instanceof Error ? error.message : 'Gagal membuat hero section')
    }

    return { success: true }
}

export async function editHeroSectionAction(id: string, formData: FormData) {
    try {
        // Extract data from FormData
        const data = {
            headline: formData.get('headline') as string,
            subheading: formData.get('subheading') as string || null,
            background_image: formData.get('background_image') as string || null,
            cta_button_text_1: formData.get('cta_button_text_1') as string || null,
            cta_button_link_1: formData.get('cta_button_link_1') as string || null,
            cta_button_text_2: formData.get('cta_button_text_2') as string || null,
            cta_button_link_2: formData.get('cta_button_link_2') as string || null,
        }

        // Validate required fields
        if (!data.headline || data.headline.trim().length === 0) {
            throw new Error('Headline wajib diisi')
        }

        // Validate headline length
        if (data.headline.length > 100) {
            throw new Error('Headline maksimal 100 karakter')
        }

        // Validate subheading length
        if (data.subheading && data.subheading.length > 200) {
            throw new Error('Subheading maksimal 200 karakter')
        }

        // Validate URLs if provided
        if (data.cta_button_link_1 && !isValidUrl(data.cta_button_link_1)) {
            throw new Error('URL CTA Button 1 tidak valid')
        }
        if (data.cta_button_link_2 && !isValidUrl(data.cta_button_link_2)) {
            throw new Error('URL CTA Button 2 tidak valid')
        }

        // Check if hero section exists
        const existingHeroSection = await prisma.heroSection.findUnique({
            where: { id: Number(id) }
        })

        if (!existingHeroSection) {
            throw new Error('Hero section tidak ditemukan')
        }

        // Update hero section
        await prisma.heroSection.update({
            where: { id: Number(id) },
            data: {
                ...data,
                updatedAt: new Date()
            }
        })

        // Revalidate cache
        revalidatePath('/admin/hero-section-or-banner-or-banner')
        revalidatePath('/admin/hero-section-or-banner')

        return { success: true }
    } catch (error) {
        console.error('Error updating hero section:', error)
        throw new Error(error instanceof Error ? error.message : 'Gagal memperbarui hero section')
    }
}

export async function getHeroSectionById(id: string) {
    try {
        const heroSection = await prisma.heroSection.findUnique({
            where: { id: Number(id) }
        })

        if (!heroSection) return null
        return heroSection
    } catch (error) {
        console.error('Error fetching hero section:', error)
        return null
    }
}
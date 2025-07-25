// app/admin/hero-section/create/createHeroSectionAction.ts
"use server"

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { isValidUrl } from '@/lib/validators'

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
        // DEBUG: Log semua data yang diterima
        console.log('🔍 FormData received:')
        for (const [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value)
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

        revalidatePath('/admin/hero-section-or-banner')
    } catch (error) {
        console.error('Error creating hero section:', error)
        throw new Error(error instanceof Error ? error.message : 'Gagal membuat hero section')
    }

    return { success: true }
}

// lib/actions/feature-blocks.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { FeatureBlockFormData } from '@/types/feature-blocks'

export async function createFeatureBlock(data: FeatureBlockFormData) {
    try {
        await prisma.featureBlocks.create({
            data: {
                title: data.title,
                description: data.description || null,
                icon: data.icon || null,
                image_url: data.image_url || null,
                display_order: data.display_order || 0,
                is_active: data.is_active ?? true,
            },
        })

        revalidatePath('/admin/layanan')
        return { success: true }
    } catch (error) {
        console.error('Error creating feature block:', error)
        throw new Error('Gagal membuat fitur blok')
    }
}

export async function updateFeatureBlock(id: number, data: FeatureBlockFormData) {
    try {
        await prisma.featureBlocks.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description || null,
                icon: data.icon || null,
                image_url: data.image_url || null,
                display_order: data.display_order || 0,
                is_active: data.is_active ?? true,
            },
        })

        revalidatePath('/admin/layanan')
        return { success: true }
    } catch (error) {
        console.error('Error updating feature block:', error)
        throw new Error('Gagal memperbarui fitur blok')
    }
}

export async function deleteFeatureBlock(id: number) {
    try {
        await prisma.featureBlocks.delete({
            where: { id },
        })

        revalidatePath('/admin/layanan')
        return { success: true }
    } catch (error) {
        console.error('Error deleting feature block:', error)
        throw new Error('Gagal menghapus fitur blok')
    }
}

export async function toggleFeatureBlockStatus(id: number, is_active: boolean) {
    try {
        await prisma.featureBlocks.update({
            where: { id },
            data: { is_active },
        })

        revalidatePath('/admin/layanan')
        return { success: true }
    } catch (error) {
        console.error('Error toggling status:', error)
        throw new Error('Gagal mengubah status')
    }
}
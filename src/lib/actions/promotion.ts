// actions/promotion.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { PromotionFormData } from '@/types/promotion'

export async function getPromotions() {
    try {
        const promotions = await prisma.promotions.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        return promotions
    } catch (error) {
        console.error('Error fetching promotions:', error)
        return []
    }
}

export async function getPromotionById(id: number) {
    try {
        const promotion = await prisma.promotions.findUnique({
            where: { id }
        })
        return promotion
    } catch (error) {
        console.error('Error fetching promotion:', error)
        return null
    }
}

export async function createPromotion(data: PromotionFormData) {
    try {
        await prisma.promotions.create({
            data: {
                title: data.title,
                description: data.description || null,
                image_url: data.image_url || null,
                link_url: data.link_url || null,
                start_date: data.start_date ? new Date(data.start_date) : null,
                end_date: data.end_date ? new Date(data.end_date) : null,
                is_active: data.is_active
            }
        })
        revalidatePath('/admin/promosi')
        return { success: true }
    } catch (error) {
        console.error('Error creating promotion:', error)
        return { success: false, error: 'Failed to create promotion' }
    }
}

export async function updatePromotion(id: number, data: PromotionFormData) {
    try {
        await prisma.promotions.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description || null,
                image_url: data.image_url || null,
                link_url: data.link_url || null,
                start_date: data.start_date ? new Date(data.start_date) : null,
                end_date: data.end_date ? new Date(data.end_date) : null,
                is_active: data.is_active
            }
        })
        revalidatePath('/admin/promosi')
        return { success: true }
    } catch (error) {
        console.error('Error updating promotion:', error)
        return { success: false, error: 'Failed to update promotion' }
    }
}

export async function deletePromotion(id: number) {
    try {
        await prisma.promotions.delete({
            where: { id }
        })
        revalidatePath('/admin/promosi')
        return { success: true }
    } catch (error) {
        console.error('Error deleting promotion:', error)
        return { success: false, error: 'Failed to delete promotion' }
    }
}
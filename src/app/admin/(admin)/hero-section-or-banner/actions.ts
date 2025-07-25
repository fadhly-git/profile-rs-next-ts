// app/admin/hero-section/actions.ts
"use server"

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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
        revalidatePath('/admin/hero-section')
    } catch (error) {
        console.error('Error deleting hero section:', error)
        throw new Error('Gagal menghapus hero section')
    }
}
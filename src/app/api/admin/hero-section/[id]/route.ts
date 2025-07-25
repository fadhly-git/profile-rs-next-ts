// app/api/admin/hero-section/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const heroSection = await prisma.heroSection.findUnique({
            where: { id: Number(id) }
        })

        if (!heroSection) {
            return NextResponse.json(
                { error: 'Hero section tidak ditemukan' },
                { status: 404 }
            )
        }

        return NextResponse.json(heroSection)
    } catch (error) {
        console.error('Error fetching hero section:', error)
        return NextResponse.json(
            { error: 'Gagal memuat hero section' },
            { status: 500 }
        )
    }
}
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {

        // Test simple query
        const count = await prisma.kategori.count({
            where: { is_active: true }
        });

        const kategoris = await prisma.kategori.findMany({
            where: {
                is_active: true
            },
            select: {
                id_kategori: true,
                nama_kategori: true,
                slug_kategori: true,
            },
            orderBy: {
                nama_kategori: 'asc'
            }
        });

        // Convert BigInt to string for JSON serialization
        const serializedKategoris = kategoris.map(kategori => ({
            ...kategori,
            id_kategori: kategori.id_kategori.toString()
        }));

        return NextResponse.json({
            success: true,
            message: 'Kategori loaded successfully',
            data: {
                count,
                kategoris: serializedKategoris
            }
        });

    } catch (error) {
        console.error('Error testing kategori:', error);

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : null
        }, { status: 500 });
    }
}

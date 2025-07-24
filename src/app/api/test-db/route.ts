import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Test database connection
        await prisma.$connect();

        // Test kategori table
        const count = await prisma.kategori.count();
        const sample = await prisma.kategori.findFirst({
            select: {
                id_kategori: true,
                nama_kategori: true,
                is_active: true
            }
        });

        // Convert BigInt to string for JSON serialization
        const serializedSample = sample ? {
            ...sample,
            id_kategori: sample.id_kategori.toString()
        } : null;

        return NextResponse.json({
            success: true,
            message: 'Database connection successful',
            data: {
                total_categories: count,
                sample_category: serializedSample,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Database test error:', error);

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : null
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

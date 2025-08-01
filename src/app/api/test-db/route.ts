import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Test database connection
        await prisma.$connect();
        const data = await prisma.indikatormutu.findMany({
            orderBy: [
                {judul: 'asc'},
                {period: 'desc'}
            ]
        })
        return NextResponse.json({
            success: true,
            data: data
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

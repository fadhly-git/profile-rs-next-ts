import { NextResponse } from 'next/server';
import { getKategoriOptions } from '@/app/admin/(admin)/berita/create/_data';

export async function GET() {
    try {
        const kategoris = await getKategoriOptions();

        return NextResponse.json({
            success: true,
            data: kategoris,
            count: kategoris.length
        });

    } catch (error) {
        console.error('Error in kategori API:', error);

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

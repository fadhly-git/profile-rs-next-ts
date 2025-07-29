// api/admin/upload/image/berita/delete/route.ts
"use server"

import { NextRequest, NextResponse } from 'next/server';
import { unlink, stat } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        // Dapatkan URL gambar dari request body
        const { url } = await request.json();

        // Validasi URL
        if (!url) {
            return NextResponse.json({
                error: 'URL gambar tidak valid'
            }, { status: 400 });
        }

        // Ekstrak path file dari URL
        // Misalnya, dari "/uploads/images/1234567-abcdef.jpg"
        const relativePath = url.startsWith('/') ? url : `/${url}`;

        // Bangun path absolut ke file
        const filePath = path.join(process.cwd(), 'public', relativePath);

        try {
            // Periksa apakah file ada
            await stat(filePath);
        } catch {
            // File tidak ditemukan
            return NextResponse.json({
                success: true,
                message: 'File tidak ditemukan atau sudah dihapus'
            });
        }

        // Hapus file
        await unlink(filePath);

        return NextResponse.json({
            success: true,
            message: 'Gambar berhasil dihapus'
        });

    } catch (error) {
        console.error('Delete image error:', error);
        return NextResponse.json({
            error: 'Gagal menghapus gambar'
        }, { status: 500 });
    }
}
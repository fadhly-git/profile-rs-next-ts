// api/admin/upload/image/berita/route.ts
// This file handles the image upload functionality for the admin panel.

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file received' }, { status: 400 });
        }

        // Validasi tipe file
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                error: 'Tipe file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF'
            }, { status: 400 });
        }

        // Validasi ukuran file (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({
                error: 'Ukuran file terlalu besar. Maksimal 5MB'
            }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const extension = path.extname(file.name);
        const filename = `${timestamp}-${randomStr}${extension}`;

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images', 'news-thumb');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (error) {
            // Directory might already exist
            console.error('Upload directory creation:', error);
        }

        // Save file
        // Save file
        const filePath = path.join(uploadDir, filename);

        try {
            await writeFile(filePath, buffer);

        } catch (error) {
            console.error('❌ File write error:', error);
            return NextResponse.json({
                error: 'Gagal menyimpan file: ' + (error instanceof Error ? error.message : 'Unknown error')
            }, { status: 500 });
        }

        // Return the URL
        const fileUrl = `/uploads/images/news-thumb/${filename}`;

        return NextResponse.json({
            success: true,
            url: fileUrl,
            filename: filename
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: 'Gagal mengupload file'
        }, { status: 500 });
    }
}

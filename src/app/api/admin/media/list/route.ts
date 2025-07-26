/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/media/list/route.ts
import { NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import path from 'path'

export async function GET() {
    try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'images')
        const files = await getFilesRecursively(uploadsDir, '/uploads/images')

        return NextResponse.json({
            success: true,
            files: files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        })
    } catch (error) {
        console.error('Error listing files:', error)
        return NextResponse.json({
            success: false,
            files: [],
            error: 'Gagal mengambil daftar file'
        })
    }
}

async function getFilesRecursively(dir: string, baseUrl: string): Promise<any[]> {
    const files: any[] = []

    try {
        const items = await readdir(dir)

        for (const item of items) {
            const fullPath = path.join(dir, item)
            const stats = await stat(fullPath)

            if (stats.isDirectory()) {
                const subFiles = await getFilesRecursively(fullPath, `${baseUrl}/${item}`)
                files.push(...subFiles)
            } else {
                const url = `${baseUrl}/${item}`.replace(/\\/g, '/')
                const category = path.basename(path.dirname(fullPath))

                files.push({
                    id: fullPath,
                    filename: item,
                    url,
                    size: stats.size,
                    type: getFileType(item),
                    category,
                    createdAt: stats.birthtime.toISOString()
                })
            }
        }
    } catch (error) {
        console.error(`Failed to read directory: ${dir}`, (error instanceof Error ? error.message : String(error)))
    }

    return files
}

function getFileType(filename: string): string {
    const ext = path.extname(filename).toLowerCase()
    const imageTypes: { [key: string]: string } = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif'
    }
    return imageTypes[ext] || 'application/octet-stream'
}
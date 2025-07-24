import { prisma } from '@/lib/prisma';

export async function getKategori() {
    const kategori = await prisma.kategori.findMany({
        orderBy: { createdAt: 'asc' }
    });
    return kategori
}
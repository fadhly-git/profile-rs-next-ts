import { prisma } from "@/lib/prisma";

export async function getKategoriOptions() {
    try {
        console.log('Fetching categories from database...');

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

        console.log('Categories fetched:', kategoris.length);

        // Convert BigInt to string for client-side compatibility
        const serializedKategoris = kategoris.map(kategori => ({
            ...kategori,
            id_kategori: kategori.id_kategori.toString()
        }));

        return serializedKategoris;
    } catch (error) {
        console.error('Error fetching categories:', error);

        // Fallback return empty array dengan informasi error
        throw new Error(`Gagal memuat kategori: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
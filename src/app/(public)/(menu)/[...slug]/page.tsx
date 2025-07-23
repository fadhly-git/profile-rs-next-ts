import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DynamicMenuPage({
    params
}: {
    params: Promise<{ slug: string[] }>
}) {
    // ⬇️ Await params
    const { slug } = await params;
    const path = `/${slug.join('/')}`;

    // 1. Cek apakah path ada di menu
    const menu = await prisma.menu.findFirst({
        where: { route: path },
        include: { kategori: true }
    });

    if (!menu) return notFound();

    // 2. Handle berdasarkan tipe menu
    if (menu.kategori) {
        // Ambil konten kategori terkait
        const beritas = await prisma.beritas.findMany({
            where: { id_kategori: menu.kategori.id_kategori }
        });

        // Ganti dengan komponen yang sesuai untuk kategori
        return "halo";
    }

    // 3. Fallback untuk menu tanpa kategori
    return "halo"; // Ganti dengan komponen yang sesuai untuk menu tanpa kategori
}
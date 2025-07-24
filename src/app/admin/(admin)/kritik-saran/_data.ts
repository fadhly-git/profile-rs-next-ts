import { prisma } from '@/lib/prisma';

export async function getKritikSaran() {
    const kritikSaran = await prisma.kritikSaran.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return kritikSaran.map(item => ({
        ...item,
        telepon: item.telepon === null ? undefined : item.telepon,
        nama_kmr_no_kmr: item.nama_kmr_no_kmr === null ? undefined : item.nama_kmr_no_kmr,
    }));
}
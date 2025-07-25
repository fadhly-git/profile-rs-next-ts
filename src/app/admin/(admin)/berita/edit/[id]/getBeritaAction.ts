// app/admin/berita/[id]/getBeritaAction.ts
"use server"

import { prisma } from '@/lib/prisma';
import { Beritas } from '@/types';

export async function getBeritaByIdAction(id: string) {
    try {
        const berita = await prisma.beritas.findUnique({
            where: {
                id_berita: BigInt(id)
            },
            include: {
                kategori: {
                    select: {
                        id_kategori: true,
                        nama_kategori: true,
                        slug_kategori: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        if (!berita) {
            return { success: false, error: 'Berita tidak ditemukan' };
        }

        // Convert BigInt to string for JSON serialization
        const serializedBerita: Beritas = {
            ...berita,
            id_berita: berita.id_berita.toString() as unknown as bigint,
            id_user: berita.id_user.toString() as unknown as bigint,
            id_kategori: berita.id_kategori.toString() as unknown as bigint,
            tanggal_post: berita.tanggal_post ? berita.tanggal_post.toISOString() : null,
            createdAt: berita.createdAt,
            updatedAt: berita.updatedAt,
            kategori: berita.kategori ? {
                id_kategori: berita.kategori.id_kategori.toString() as unknown as bigint,
                nama_kategori: berita.kategori.nama_kategori,
                slug_kategori: berita.kategori.slug_kategori,
                is_main_menu: false, // atau isi sesuai data
                is_active: true,     // atau isi sesuai data
                createdAt: new Date(), // atau isi sesuai data
                updatedAt: new Date(), // atau isi sesuai data
            } : undefined,
            user: berita.user ? {
                id: Number(berita.user.id), // pastikan number
                name: berita.user.name,
                email: berita.user.email,
            } : undefined
        };

        return { success: true, data: serializedBerita };
    } catch (error) {
        console.error('Error fetching berita:', error);
        return { success: false, error: 'Gagal memuat data berita' };
    }
}
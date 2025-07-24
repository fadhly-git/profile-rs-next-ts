// app/admin/berita/[id]/updateBeritaAction.ts
"use server"

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { EnumStatusBerita, EnumBeritasBahasa } from '@/types';

export async function updateBeritaAction(id: string, formData: FormData) {
    try {
        // Validasi session
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            throw new Error('Unauthorized');
        }

        // Extract data dari FormData
        const data = {
            judul_berita: formData.get('judul_berita') as string,
            slug_berita: formData.get('slug_berita') as string,
            isi: formData.get('isi') as string,
            id_kategori: BigInt(formData.get('id_kategori') as string),
            status_berita: formData.get('status_berita') as EnumStatusBerita,
            jenis_berita: formData.get('jenis_berita') as string,
            bahasa: formData.get('bahasa') as EnumBeritasBahasa,
            keywords: formData.get('keywords') as string || null,
            thumbnail: formData.get('thumbnail') as string || null,
            gambar: formData.get('gambar') as string || null,
            icon: formData.get('icon') as string || null,
            tanggal_post: new Date(formData.get('tanggal_post') as string),
        };

        // Validasi required fields
        if (!data.judul_berita || !data.isi || !data.id_kategori) {
            throw new Error('Judul, konten, dan kategori wajib diisi');
        }

        // Cek apakah berita exists
        const existingBerita = await prisma.beritas.findUnique({
            where: { id_berita: BigInt(id) }
        });

        if (!existingBerita) {
            throw new Error('Berita tidak ditemukan');
        }

        // Update berita
        const updatedBerita = await prisma.beritas.update({
            where: { id_berita: BigInt(id) },
            data: {
                ...data,
                updater: session.user.name || session.user.email || 'Unknown',
                updatedAt: new Date(),
            }
        });

        // Revalidate cache
        revalidatePath('/admin/berita');
        revalidatePath(`/admin/berita/${id}`);
        revalidatePath(`/berita/${data.slug_berita}`);

        console.log('Berita updated successfully:', updatedBerita.id_berita.toString());

    } catch (error) {
        console.error('Error updating berita:', error);
        throw new Error(error instanceof Error ? error.message : 'Gagal mengupdate berita');
    }

    // Redirect ke halaman list berita
    redirect('/admin/berita');
}
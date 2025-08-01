"use server";

import { prisma } from '@/lib/prisma';
import { z } from 'zod'

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

const kritikSaranSchema = z.object({
  nama: z.string().min(1).max(100),
  email: z.string().email().max(100),
  telepon: z.string().optional(),
  alamat: z.string().min(1).max(255),
  nama_kmr_no_kmr: z.string().optional(),
  nama_poli: z.string().optional(),
  perawatan_terakait: z.enum(['Poliklinik', 'RawatInap']),
  kritik: z.string().min(1),
  saran: z.string().min(1)
})

export async function submitKritikSaran(data: z.infer<typeof kritikSaranSchema>) {
  try {
    // Validate input
    const validatedData = kritikSaranSchema.parse(data)

    // Save to database
    await prisma.kritikSaran.create({
      data: {
        nama: validatedData.nama,
        email: validatedData.email,
        telepon: validatedData.telepon || null,
        alamat: validatedData.alamat,
        nama_kmr_no_kmr: validatedData.nama_kmr_no_kmr || null,
        nama_poli: validatedData.nama_poli || null,
        perawatan_terakait: validatedData.perawatan_terakait,
        kritik: validatedData.kritik,
        saran: validatedData.saran
      }
    })

    return {
      success: true,
      message: 'Kritik dan saran berhasil dikirim'
    }
  } catch (error) {
    console.error('Error submitting kritik saran:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Data yang dikirim tidak valid'
      }
    }

    return {
      success: false,
      message: 'Terjadi kesalahan saat menyimpan data'
    }
  }
}
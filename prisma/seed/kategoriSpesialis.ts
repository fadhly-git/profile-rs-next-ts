// prisma/seed/kategoriSpesialis.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedKategoriSpesialis = async () => {
  const kategoriSpesialisData = [
    { id: BigInt(1), nama_spesialis: 'Lorem ipsum', deskripsi: 'ipsum' },
    { id: BigInt(2), nama_spesialis: 'dolor sit amet', deskripsi: 'Quia voluptatem, exercitationem nihil enim assumenda perspiciatis?' },
    { id: BigInt(3), nama_spesialis: 'Jantung', deskripsi: 'Spesialis Jantung' },
    { id: BigInt(5), nama_spesialis: 'Bedah', deskripsi: null },
    { id: BigInt(6), nama_spesialis: 'Orthopaedi & Traumatologi', deskripsi: null },
    { id: BigInt(7), nama_spesialis: 'Kandungan', deskripsi: null },
    { id: BigInt(8), nama_spesialis: 'Mata', deskripsi: null },
    { id: BigInt(9), nama_spesialis: 'Penyakit Dalam', deskripsi: null },
    { id: BigInt(10), nama_spesialis: 'Anak', deskripsi: null },
    { id: BigInt(11), nama_spesialis: 'syaraf', deskripsi: null },
  ];

  for (const kategoriSpesialis of kategoriSpesialisData) {
    await prisma.kategoriSpesialis.upsert({
      where: { id: kategoriSpesialis.id },
      update: {
        nama_spesialis: kategoriSpesialis.nama_spesialis,
        deskripsi: kategoriSpesialis.deskripsi,
      },
      create: { ...kategoriSpesialis },
    });
  }

  console.log(`✅ Seeded ${kategoriSpesialisData.length} kategori spesialis.`);
};
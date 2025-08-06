// prisma/seed/kategori.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedKategori = async () => {
  const kategoriData = [
    {
      id_kategori: BigInt(1),
      nama_kategori: 'Layanan',
      slug_kategori: 'layanan',
      gambar: null,
      keterangan: 'Kategori untuk semua layanan rumah sakit',
      parent_id: null,
      is_main_menu: true,
      urutan: 0,
      is_active: true,
      createdAt: new Date('2025-07-28T21:18:47'),
      updatedAt: new Date('2025-07-28T21:18:47'),
    },
    {
      id_kategori: BigInt(2),
      nama_kategori: 'Berita',
      slug_kategori: 'berita',
      gambar: null,
      keterangan: 'Kategori untuk berita dan pengumuman',
      parent_id: null,
      is_main_menu: true,
      urutan: 0,
      is_active: true,
      createdAt: new Date('2025-07-28T21:18:47'),
      updatedAt: new Date('2025-07-28T21:18:47'),
    },
    {
      id_kategori: BigInt(3),
      nama_kategori: 'Tentang Kami',
      slug_kategori: 'tentang-kami',
      gambar: null,
      keterangan: 'Tentang Kami',
      parent_id: null,
      is_main_menu: true,
      urutan: null,
      is_active: true,
      createdAt: new Date('2025-07-28T22:33:14'),
      updatedAt: new Date('2025-07-28T22:33:14'),
    },
    {
      id_kategori: BigInt(4),
      nama_kategori: 'Hubungi Kami',
      slug_kategori: 'hubungi-kami',
      gambar: null,
      keterangan: '',
      parent_id: null,
      is_main_menu: true,
      urutan: null,
      is_active: true,
      createdAt: new Date('2025-07-31T22:27:33'),
      updatedAt: new Date('2025-07-31T22:27:33'),
    },
    {
      id_kategori: BigInt(5),
      nama_kategori: 'Indikator Mutu',
      slug_kategori: 'indikator-mutu',
      gambar: null,
      keterangan: 'Indikator Mutu ',
      parent_id: null,
      is_main_menu: true,
      urutan: null,
      is_active: true,
      createdAt: new Date('2025-08-01T02:51:30'),
      updatedAt: new Date('2025-08-01T02:51:30'),
    },
  ];

  for (const kategori of kategoriData) {
    await prisma.kategori.upsert({
      where: { slug_kategori: kategori.slug_kategori },
      update: {
        nama_kategori: kategori.nama_kategori,
        gambar: kategori.gambar,
        keterangan: kategori.keterangan,
        parent_id: kategori.parent_id,
        is_main_menu: kategori.is_main_menu,
        urutan: kategori.urutan,
        is_active: kategori.is_active,
        createdAt: kategori.createdAt,
        updatedAt: kategori.updatedAt,
      },
      create: {
        id_kategori: kategori.id_kategori,
        nama_kategori: kategori.nama_kategori,
        slug_kategori: kategori.slug_kategori,
        gambar: kategori.gambar,
        keterangan: kategori.keterangan,
        parent_id: kategori.parent_id,
        is_main_menu: kategori.is_main_menu,
        urutan: kategori.urutan,
        is_active: kategori.is_active,
        createdAt: kategori.createdAt,
        updatedAt: kategori.updatedAt,
      },
    });
  }

  console.log(`✅ Seeded ${kategoriData.length} kategori.`);
};
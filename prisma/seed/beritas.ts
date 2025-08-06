// prisma/seed/beritas.ts
import { PrismaClient, EnumBeritasBahasa, EnumStatusBerita } from '@prisma/client';

const prisma = new PrismaClient();

export const seedBeritas = async () => {
  const beritasData = [
    {
      id_berita: BigInt(3),
      id_user: BigInt(5),
      id_kategori: BigInt(2),
      bahasa: 'ID' as EnumBeritasBahasa,
      updater: 'Admin RS',
      slug_berita: 'milad-rs-pku-muhammadiyah-boja',
      judul_berita: 'Milad RS PKU Muhammadiyah Boja',
      isi: `<p>Alhamdulillah, tepat hari ini RS PKU Muhammadiyah Boja berusia 1 Tahun.</p><p></p><p style="text-align: justify;">Semoga menjadi rumah sakit yang dapat memberikan manfaat bagi warga boja dan sekitarnya dan semakin menjaga kualitas pelayanan dan berkembang, amin</p><p style="text-align: justify;"></p><p style="text-align: justify;">Menyehatkan Umat - Mencerdaskan Semesta</p><p style="text-align: justify;"></p><img class="max-w-full h-auto rounded-lg" src="/uploads/images/news/1754109255964-x6mhxh.jpeg"><p></p>`,
      status_berita: 'publish' as EnumStatusBerita,
      jenis_berita: 'berita',
      keywords: null,
      thumbnail: '/uploads/images/other/foto-rs-1754108971761.jpeg',
      gambar: null,
      icon: null,
      hits: 20,
      urutan: 1,
      tanggal_post: new Date('2025-04-04T03:31:00.000Z'),
      created_at: new Date('2025-08-01T21:35:23'),
      updated_at: new Date('2025-08-05T03:38:47'),
    },
    {
      id_berita: BigInt(4),
      id_user: BigInt(5),
      id_kategori: BigInt(2),
      bahasa: 'ID' as EnumBeritasBahasa,
      updater: 'Admin RS',
      slug_berita: 'selamat-hari-raya-idul-fitri-1446-h',
      judul_berita: 'Selamat Hari Raya Idul Fitri 1446 H',
      isi: `<p>Taqabbalallahu minna wa minkum</p><p></p><p style="text-align: justify;">Mohon maaf lahir dan batin. Semoga Allah menerima amal ibadah kita dan memberkahi dengan kebahagiaan sejati di hari yang fitri ini. Aamiin.</p><p style="text-align: justify;"></p><p style="text-align: justify;">Bagi Masyarakat yang membutuhkan layanan kesehatan terutama dalam keadaan darurat dapat memanfaatkan layanan IGD (0294) 6103005</p><p style="text-align: justify;">Menyehatkan Umat - Mencerdaskan Semesta</p><img class="max-w-full h-auto rounded-lg" src="/uploads/images/news/1754110033204-u1fjc6.jpeg"><p></p>`,
      status_berita: 'publish' as EnumStatusBerita,
      jenis_berita: 'artikel',
      keywords: null,
      thumbnail: '/uploads/images/other/foto-rs-1754108971761.jpeg',
      gambar: null,
      icon: null,
      hits: 11,
      urutan: 2,
      tanggal_post: new Date('2025-03-31T07:38:00.000Z'),
      created_at: new Date('2025-08-01T21:48:10'),
      updated_at: new Date('2025-08-05T03:38:47'),
    },
  ];

  for (const berita of beritasData) {
    await prisma.beritas.upsert({
      where: { id_berita: berita.id_berita },
      update: {
        id_user: berita.id_user,
        id_kategori: berita.id_kategori,
        bahasa: berita.bahasa,
        updater: berita.updater,
        slug_berita: berita.slug_berita,
        judul_berita: berita.judul_berita,
        isi: berita.isi,
        status_berita: berita.status_berita,
        jenis_berita: berita.jenis_berita,
        keywords: berita.keywords,
        thumbnail: berita.thumbnail,
        gambar: berita.gambar,
        icon: berita.icon,
        hits: berita.hits,
        urutan: berita.urutan,
        tanggal_post: berita.tanggal_post,
        createdAt: berita.created_at,
        updatedAt: berita.updated_at,
      },
      create: { ...berita },
    });
  }

  console.log(`✅ Seeded ${beritasData.length} beritas.`);
};
// prisma/seed/halaman.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedHalaman = async () => {
  const halamanData = [
    {
      id_halaman: BigInt(1),
      judul: 'Sejarah Kami',
      slug: 'sejarah-kami',
      konten: `<p>Ini adalah halaman tentang kami yang di buat dari admin panel broooo<br>keren tak, tapi berat kali brooo is is is</p><blockquote><p>anjay</p></blockquote><p></p>`,
      gambar: '/uploads/images/news-thumb/1754020612963-jbsv5s.png',
      menuId: BigInt(1),
      kategoriId: BigInt(4),
      is_published: true,
      created_at: new Date('2025-07-28T21:18:47'),
      updated_at: new Date('2025-08-01T22:34:10'),
    },
    {
      id_halaman: BigInt(2),
      judul: 'mencoba untuk layanan',
      slug: 'mencoba-untuk-layanan',
      konten: `<p>      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae repellendus vero ipsum. Quaerat minus facere voluptates animi maiores sunt facilis nobis, distinctio neque repellendus sint, ut repudiandae, in sit molestias.</p><p>      Cum eius eveniet quidem aperiam optio esse ipsam quasi autem modi soluta adipisci aspernatur, numquam ea incidunt pariatur culpa magnam exercitationem architecto! Dolores reiciendis placeat esse expedita, iusto laudantium voluptas.</p>`,
      gambar: '/uploads/images/general/logo-1753972705620.png',
      menuId: null,
      kategoriId: BigInt(1),
      is_published: true,
      created_at: new Date('2025-07-31T19:41:40'),
      updated_at: new Date('2025-08-01T22:34:29'),
    },
    {
      id_halaman: BigInt(3),
      judul: 'Syarat Layanan',
      slug: 'syarat-layanan',
      konten: `<p>lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
      gambar: null,
      menuId: null,
      kategoriId: null,
      is_published: true,
      created_at: new Date('2025-07-31T20:40:19'),
      updated_at: new Date('2025-07-31T20:40:19'),
    },
    {
      id_halaman: BigInt(4),
      judul: 'Jadwal Dokter',
      slug: 'jadwal-dokter',
      konten: `<p>hanya untuk dummy</p>`,
      gambar: null,
      menuId: null,
      kategoriId: BigInt(1),
      is_published: true,
      created_at: new Date('2025-07-31T21:27:59'),
      updated_at: new Date('2025-07-31T21:27:59'),
    },
    {
      id_halaman: BigInt(6),
      judul: 'Kebijakan Privasi',
      slug: 'kebijakan-privasi',
      konten: `<p style="text-align: justify;">Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae est alias quas modi, eius, incidunt aliquid obcaecati, nesciunt cumque aperiam fuga eveniet eligendi? Libero placeat expedita repudiandae dolorem porro reprehenderit </p><p style="text-align: justify;">Animi quibusdam reprehenderit adipisci, dolorem corporis dolor beatae nam! Voluptas eaque dolorem harum vero voluptatem explicabo suscipit delectus deserunt ipsa perferendis pariatur quidem eveniet odit, culpa, accusantium earum itaque. Aperiam?</p><p style="text-align: justify;">Sed repellendus facilis illo fugiat asperiores vitae omnis similique, dolorem et? Mollitia quos nihil dolore dicta culpa dolorem unde dolor eum magnam? Incidunt corporis, ipsum distinctio recusandae animi libero laboriosam.</p><p style="text-align: justify;">Tempora quas dicta aut rerum totam error ullam hic iure sequi ducimus modi ut inventore ratione labore, tempore recusandae nulla nobis incidunt. Magni ullam voluptate, distinctio non eveniet rerum laudantium!</p>`,
      gambar: null,
      menuId: null,
      kategoriId: null,
      is_published: true,
      created_at: new Date('2025-08-01T02:50:39'),
      updated_at: new Date('2025-08-01T02:50:39'),
    },
  ];

  for (const halaman of halamanData) {
    await prisma.halaman.upsert({
      where: { slug: halaman.slug },
      update: {
        judul: halaman.judul,
        konten: halaman.konten,
        gambar: halaman.gambar,
        menuId: halaman.menuId,
        kategoriId: halaman.kategoriId,
        is_published: halaman.is_published,
        createdAt: halaman.created_at,
        updatedAt: halaman.updated_at,
      },
      create: { ...halaman },
    });
  }

  console.log(`✅ Seeded ${halamanData.length} halaman.`);
};
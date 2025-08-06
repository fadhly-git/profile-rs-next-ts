import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedAboutUs() {
  const aboutUsSections = [
    {
      id: 1,
      title: 'Tentang Kami',
      short_description: 'Assalamualaikum Warahmatullahi Wabarakatuh.\nDengan segala Ikhtiar, doa dan tawakal Kepada Allah SWT, rumah sakit berlandaskan Cerdas, Amanah, Kuat, Agamis dan Profesional (CAKAP), siap melayani pasien dengan sepenuh hati dalam berjuang meningkatkan taraf hidup masyarakat SiBoLi ( Singorojo, Boja, Limbangan) dalam bidang kesehatan.',
      image_url: '',
      read_more_link: '/tentang-kami',
      created_at: new Date('2025-07-28T21:18:47.000Z'),
      updated_at: new Date('2025-08-01T21:26:33.000Z')
    },
    {
      id: 2,
      title: 'Tentang Kami',
      short_description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae est alias quas modi, eius, incidunt aliquid obcaecati, nesciunt cumque aperiam fuga eveniet eligendi? Libero placeat expedita repudiandae dolorem porro reprehenderit?\n                Animi quibusdam reprehenderit adipisci, dolorem corporis dolor beatae nam! Voluptas eaque dolorem harum vero voluptatem explicabo suscipit delectus deserunt ipsa perferendis pariatur quidem eveniet odit, culpa, accusantium earum itaque. Aperiam?',
      image_url: '/uploads/images/profile/01jnq17h63gkq55jkdc73g35k1-1754111149611.jpg',
      read_more_link: '/tentang-kami',
      created_at: new Date('2025-07-28T21:18:47.000Z'),
      updated_at: new Date('2025-08-01T22:33:08.000Z')
    }
  ];

  for (const aboutUs of aboutUsSections) {
    await prisma.aboutUsSection.upsert({
      where: { id: aboutUs.id },
      update: {},
      create: aboutUs
    });
  }
}
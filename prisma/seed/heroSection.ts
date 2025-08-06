// prisma/seed/heroSection.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedHeroSections = async () => {
  const heroSectionsData = [
    {
      id: 1,
      headline: 'Pelayanan Kesehatan Terbaik',
      subheading: 'Dengan tim dokter profesional dan fasilitas modern',
      background_image: '/uploads/images/profile/01jnq17h63gkq55jkdc73g35k1-1754111149611.jpg',
      cta_button_text_1: null,
      cta_button_link_1: null,
      cta_button_text_2: null,
      cta_button_link_2: null,
      created_at: new Date('2025-07-28T21:18:47'),
      updated_at: new Date('2025-08-01T22:06:04'),
    },
    {
      id: 2,
      headline: 'Selamat Datang guysssss',
      subheading: 'lorem ipsum',
      background_image: '/uploads/images/other/foto-rs-1754108971761.jpeg',
      cta_button_text_1: 'Hubungi Kami',
      cta_button_link_1: '/hubungi-kami',
      cta_button_text_2: null,
      cta_button_link_2: null,
      created_at: new Date('2025-07-31T06:41:36'),
      updated_at: new Date('2025-08-04T03:48:50'),
    },
  ];

  for (const hero of heroSectionsData) {
    await prisma.heroSection.upsert({
      where: { id: hero.id },
      update: {
        headline: hero.headline,
        subheading: hero.subheading,
        background_image: hero.background_image,
        cta_button_text_1: hero.cta_button_text_1,
        cta_button_link_1: hero.cta_button_link_1,
        cta_button_text_2: hero.cta_button_text_2,
        cta_button_link_2: hero.cta_button_link_2,
        createdAt: hero.created_at,
        updatedAt: hero.updated_at,
      },
      create: { ...hero },
    });
  }

  console.log(`✅ Seeded ${heroSectionsData.length} hero sections.`);
};
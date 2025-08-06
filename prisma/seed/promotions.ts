// prisma/seed/promotions.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedPromotions = async () => {
  const promotionsData = [
    {
      id: 1,
      title: 'lorem ipsum',
      description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem repudiandae ab possimus aspernatur! Alias fugit voluptates ratione corporis rerum eaque sit earum, ad illum necessitatibus tempora asperiores excepturi voluptatum optio?`,
      image_url: '/uploads/images/general/logo-1753972705620.png',
      link_url: '/hubungi-kami',
      start_date: new Date('2025-08-26'),
      end_date: new Date('2025-08-31'),
      is_active: true,
      created_at: new Date('2025-08-01T20:38:58'),
      updated_at: new Date('2025-08-01T22:33:30'),
    },
  ];

  for (const promo of promotionsData) {
    await prisma.promotions.upsert({
      where: { id: promo.id },
      update: {
        title: promo.title,
        description: promo.description,
        image_url: promo.image_url,
        link_url: promo.link_url,
        start_date: promo.start_date,
        end_date: promo.end_date,
        is_active: promo.is_active,
        createdAt: promo.created_at,
        updatedAt: promo.updated_at,
      },
      create: { ...promo },
    });
  }

  console.log(`✅ Seeded ${promotionsData.length} promotions.`);
};
// prisma/seed/featureBlocks.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedFeatureBlocks = async () => {
  const featureBlocksData = [
    {
      id: 1,
      title: 'IGD 24 Jam',
      description: 'Unit Gawat Darurat siap melayani 24 jam sehari',
      icon: '/uploads/images/other/printer-1497542-1754112655442.png',
      image_url: null,
      display_order: 1,
      is_active: true,
      createdAt: new Date('2025-07-28T21:18:47'),
      updatedAt: new Date('2025-08-02T06:10:49'),
    },
    {
      id: 2,
      title: 'Laboratorium Modern',
      description: 'Peralatan laboratorium terkini untuk diagnosa akurat',
      icon: '/uploads/images/other/printer-1497542-1754112655442.png',
      image_url: null,
      display_order: 2,
      is_active: true,
      createdAt: new Date('2025-07-28T21:18:47'),
      updatedAt: new Date('2025-08-02T06:11:02'),
    },
    {
      id: 3,
      title: 'Layanan Lorem',
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae est alias quas modi, eius, incidunt aliquid obcaecati, nesciunt cumque aperiam fuga eveniet eligendi? Libero placeat expedita repudiandae dolorem porro reprehenderit 
    Animi quibusdam reprehenderit adipisci, dolorem corporis dolor beatae nam! Voluptas eaque dolorem harum vero voluptatem explicabo suscipit delectus deserunt ipsa perferendis pariatur quidem eveniet odit, culpa, accusantium earum itaque. Aperiam?`,
      icon: '/uploads/images/other/printer-1497542-1754112655442.png',
      image_url: '/uploads/images/other/printer-1497542-1754112655442.png',
      display_order: 3,
      is_active: true,
      createdAt: new Date('2025-07-28T21:18:47'),
      updatedAt: new Date('2025-08-02T06:11:28'),
    },
    {
      id: 4,
      title: 'layanan ipsum',
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae est alias quas modi, eius, incidunt aliquid obcaecati, nesciunt cumque aperiam fuga eveniet eligendi? Libero placeat expedita repudiandae dolorem porro reprehenderit `,
      icon: null,
      image_url: '/uploads/images/other/printer-1497542-1754112655442.png',
      display_order: 0,
      is_active: true,
      createdAt: new Date('2025-08-01T02:33:50'),
      updatedAt: new Date('2025-08-02T06:10:34'),
    },
    {
      id: 5,
      title: 'layanan tempora',
      description: `Tempora quas dicta aut rerum totam error ullam hic iure sequi ducimus modi ut inventore ratione labore, tempore recusandae nulla nobis incidunt. Magni ullam voluptate, distinctio non eveniet rerum laudantium!`,
      icon: '/uploads/images/other/printer-1497542-1754112655442.png',
      image_url: null,
      display_order: 0,
      is_active: true,
      createdAt: new Date('2025-08-01T02:39:51'),
      updatedAt: new Date('2025-08-02T06:10:16'),
    },
  ];

  for (const feature of featureBlocksData) {
    await prisma.featureBlocks.upsert({
      where: { id: feature.id },
      update: {
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
        image_url: feature.image_url,
        display_order: feature.display_order,
        is_active: feature.is_active,
        createdAt: feature.createdAt,
        updatedAt: feature.updatedAt,
      },
      create: { ...feature },
    });
  }

  console.log(`✅ Seeded ${featureBlocksData.length} feature blocks.`);
};
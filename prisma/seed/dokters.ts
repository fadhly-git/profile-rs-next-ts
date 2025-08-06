// prisma/seed/dokters.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedDokters = async () => {
  const doktersData = [
    {
      id_dokter: BigInt(5),
      nama_dokter: 'dr. Argo Ismoyo, Sp.B',
      photo: '/uploads/images/other/dr-argo-1754028765353.png',
      userId: null,
    },
    {
      id_dokter: BigInt(6),
      nama_dokter: 'dr. Bondan A. Chandra, Sp.OG',
      photo: '/uploads/images/other/dr-bondan-1754028765357.png',
      userId: null,
    },
    {
      id_dokter: BigInt(7),
      nama_dokter: 'dr. Dyah Ayu Shinta Ratnasari, SpPD',
      photo: '/uploads/images/other/dr-dyah-1754028765360.png',
      userId: null,
    },
    {
      id_dokter: BigInt(8),
      nama_dokter: 'dr. Erni Dyah Kaswindiarti, Sp.A',
      photo: '/uploads/images/other/dr-erni-1754028765362.png',
      userId: null,
    },
    {
      id_dokter: BigInt(10),
      nama_dokter: 'dr. Ditha Paramasitha, Sp.M',
      photo: '/uploads/images/other/dr-ditha-1754028765359.png',
      userId: null,
    },
    {
      id_dokter: BigInt(11),
      nama_dokter: 'dr. Aries Rahman H, M.Ked.Klin,Sp.OT,AIFO-K',
      photo: '/uploads/images/other/dr-aries-1754028765355.png',
      userId: null,
    },
    {
      id_dokter: BigInt(12),
      nama_dokter: 'dr. Rizal Nur Rohman, Sp.N',
      photo: '/uploads/images/other/dr-rizal-1754028765363.png',
      userId: null,
    },
  ];

  for (const dokter of doktersData) {
    await prisma.dokters.upsert({
      where: { id_dokter: dokter.id_dokter },
      update: {
        nama_dokter: dokter.nama_dokter,
        photo: dokter.photo,
        userId: dokter.userId,
      },
      create: { ...dokter },
    });
  }

  console.log(`✅ Seeded ${doktersData.length} dokters.`);
};
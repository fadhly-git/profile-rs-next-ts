// prisma/seed/dokterSpesialis.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedDokterSpesialis = async () => {
  const dokterSpesialisData = [
    { id_dokter: BigInt(5), id_spesialis: BigInt(5) },
    { id_dokter: BigInt(11), id_spesialis: BigInt(6) },
    { id_dokter: BigInt(6), id_spesialis: BigInt(7) },
    { id_dokter: BigInt(10), id_spesialis: BigInt(8) },
    { id_dokter: BigInt(7), id_spesialis: BigInt(9) },
    { id_dokter: BigInt(8), id_spesialis: BigInt(10) },
    { id_dokter: BigInt(12), id_spesialis: BigInt(11) },
  ];

  for (const ds of dokterSpesialisData) {
    await prisma.dokter_spesialis.upsert({
      where: {
        id_dokter_id_spesialis: {
          id_dokter: ds.id_dokter,
          id_spesialis: ds.id_spesialis,
        },
      },
      update: {},
      create: {
        id_dokter: ds.id_dokter,
        id_spesialis: ds.id_spesialis,
      },
    });
  }

  console.log(`✅ Seeded ${dokterSpesialisData.length} dokter spesialis.`);
};
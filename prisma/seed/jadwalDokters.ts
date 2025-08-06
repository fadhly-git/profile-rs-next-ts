// prisma/seed/jadwalDokters.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedJadwalDokters = async () => {
  const jadwalDoktersData = [
    {
      id_jadwal: BigInt(5),
      id_dokter: BigInt(5),
      hari: 'Senin',
      jam_mulai: new Date('1970-01-01T00:30:00Z'),
      jam_selesai: new Date('1970-01-01T02:00:00Z'),
      status: 1,
    },
    {
      id_jadwal: BigInt(6),
      id_dokter: BigInt(5),
      hari: 'Selasa',
      jam_mulai: new Date('1970-01-01T00:30:00Z'),
      jam_selesai: new Date('1970-01-01T02:00:00Z'),
      status: 1,
    },
    {
      id_jadwal: BigInt(7),
      id_dokter: BigInt(5),
      hari: 'Rabu',
      jam_mulai: new Date('1970-01-01T00:30:00Z'),
      jam_selesai: new Date('1970-01-01T02:00:00Z'),
      status: 1,
    },
    {
      id_jadwal: BigInt(8),
      id_dokter: BigInt(5),
      hari: 'Kamis',
      jam_mulai: new Date('1970-01-01T00:30:00Z'),
      jam_selesai: new Date('1970-01-01T02:00:00Z'),
      status: 1,
    },
    {
      id_jadwal: BigInt(9),
      id_dokter: BigInt(5),
      hari: 'Jumat',
      jam_mulai: new Date('1970-01-01T00:30:00Z'),
      jam_selesai: new Date('1970-01-01T02:00:00Z'),
      status: 1,
    },
  ];

  for (const jadwal of jadwalDoktersData) {
    await prisma.jadwalDokters.upsert({
      where: { id_jadwal: jadwal.id_jadwal },
      update: {
        id_dokter: jadwal.id_dokter,
        hari: jadwal.hari,
        jam_mulai: jadwal.jam_mulai,
        jam_selesai: jadwal.jam_selesai,
        status: jadwal.status,
      },
      create: { ...jadwal },
    });
  }

  console.log(`✅ Seeded ${jadwalDoktersData.length} jadwal dokters.`);
};
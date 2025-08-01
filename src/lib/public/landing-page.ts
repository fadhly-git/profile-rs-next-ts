import { prisma } from "@/lib/prisma";
import { 
  HeroSection as HeroSectionType, 
  FeatureBlock, 
  Dokter, 
  AboutUsSection as AboutUsSectionType, 
  Berita 
} from '@/types/public';

// Mock functions untuk fetch data - ganti dengan API calls yang sebenarnya
export async function getHeroData(): Promise<HeroSectionType[]> {
  // Implementasi fetch dari database
  return await prisma.heroSection.findMany();
}

export async function getServicesData(): Promise<FeatureBlock[]> {
  // Implementasi fetch dari database
  return await prisma.featureBlocks.findMany({
    where: { is_active: true },
    orderBy: { display_order: 'asc' }
  });
}

export async function getDoctorsWithSchedule(): Promise<Dokter[]> {
  // Implementasi fetch dari database
  const rawDoctors = await prisma.dokters.findMany({
    include: {
      JadwalDokters: true,
      dokter_spesialis: {
        include: {
          spesialis: true
        }
      }
    }
  });

  // Convert bigint fields to number for Dokter type compatibility
  const doctors: Dokter[] = rawDoctors.map(dokter => ({
    ...dokter,
    userId: typeof dokter.userId === 'bigint' ? Number(dokter.userId) : dokter.userId,
    id_dokter: typeof dokter.id_dokter === 'bigint' ? Number(dokter.id_dokter) : dokter.id_dokter,
    dokter_spesialis: dokter.dokter_spesialis?.map(ds => ({
      ...ds,
      id_dokter: typeof ds.id_dokter === 'bigint' ? Number(ds.id_dokter) : ds.id_dokter,
      id_spesialis: typeof ds.id_spesialis === 'bigint' ? Number(ds.id_spesialis) : ds.id_spesialis,
      spesialis: ds.spesialis
        ? {
            ...ds.spesialis,
            id: typeof ds.spesialis.id === 'bigint' ? Number(ds.spesialis.id) : ds.spesialis.id
          }
        : ds.spesialis
    })) ?? [],
    JadwalDokters: dokter.JadwalDokters?.map(jd => ({
      ...jd,
      id_dokter: typeof jd.id_dokter === 'bigint' ? Number(jd.id_dokter) : jd.id_dokter,
      id_jadwal: typeof jd.id_jadwal === 'bigint' ? Number(jd.id_jadwal) : jd.id_jadwal
    })) ?? []
  }));

  return doctors;
}

export async function getAboutUsData(): Promise<AboutUsSectionType | null> {
  // Implementasi fetch dari database
  return await prisma.aboutUsSection.findFirst();
}

export async function getLatestNews(): Promise<Berita[]> {
  // Implementasi fetch dari database
  const beritaRaw = await prisma.beritas.findMany({
    where: { 
      status_berita: 'publish',
      tanggal_post: { lte: new Date() }
    },
    include: {
      kategori: true
    },
    orderBy: { tanggal_post: 'desc' },
    take: 4
  });

  // Convert bigint fields to number and update type assertion
  const berita = beritaRaw.map(b => ({
    ...b,
    id_berita: typeof b.id_berita === 'bigint' ? Number(b.id_berita) : b.id_berita,
    id_user: typeof b.id_user === 'bigint' ? Number(b.id_user) : b.id_user,
    kategori: b.kategori
      ? {
          ...b.kategori,
          id_kategori: typeof b.kategori.id_kategori === 'bigint' ? Number(b.kategori.id_kategori) : b.kategori.id_kategori,
          parent_id: typeof b.kategori.parent_id === 'bigint' ? (b.kategori.parent_id !== null ? Number(b.kategori.parent_id) : null) : b.kategori.parent_id
        }
      : b.kategori
  })) as unknown as Berita[];

  return berita;
}
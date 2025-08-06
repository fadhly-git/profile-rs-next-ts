// prisma/seed.ts
import { seedUsers } from './seed/user';
import { seedKategori } from './seed/kategori';
import { seedWebsiteSettings } from './seed/websiteSettings';
import { seedHeroSections } from './seed/heroSection';
import { seedAboutUs } from './seed/aboutUsSection';
import { seedFeatureBlocks } from './seed/featureBlocks';
import { seedPromotions } from './seed/promotions';
import { seedKategoriSpesialis } from './seed/kategoriSpesialis';
import { seedDokters } from './seed/dokters';
import { seedDokterSpesialis } from './seed/dokterSpesialis';
import { seedJadwalDokters } from './seed/jadwalDokters';
import { seedBeritas } from './seed/beritas';
import { seedHalaman } from './seed/halaman';
import { seedIndikatorMutu } from './seed/indikatorMutu';
import { prisma } from '@/lib/prisma';
// Import seed files lainnya sesuai kebutuhan

const runSeeds = async () => {
  try {
    await seedUsers();
    await seedKategori();
    await seedWebsiteSettings();
    await seedHeroSections();
    await seedAboutUs();
    await seedFeatureBlocks();
    await seedPromotions();
    await seedKategoriSpesialis();
    await seedDokters();
    await seedDokterSpesialis();
    await seedJadwalDokters();
    await seedBeritas();
    await seedHalaman();
    await seedIndikatorMutu();
    // Panggil fungsi seed lainnya sesuai urutan dependensi

    console.log('✅ Semua data telah di-seed dengan sukses!');
  } catch (error) {
    console.error('❌ Terjadi kesalahan saat seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
};

runSeeds();
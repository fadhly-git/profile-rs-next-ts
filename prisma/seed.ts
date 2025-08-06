// prisma/seed.ts
import { seedUsers } from './seed/user.js';
import { seedKategori } from './seed/kategori.js';
import { seedWebsiteSettings } from './seed/websiteSettings.js';
import { seedHeroSections } from './seed/heroSection.js';
import { seedAboutUs } from './seed/aboutUsSection.js';
import { seedFeatureBlocks } from './seed/featureBlocks.js';
import { seedPromotions } from './seed/promotions.js';
import { seedKategoriSpesialis } from './seed/kategoriSpesialis.js';
import { seedDokters } from './seed/dokters.js';
import { seedDokterSpesialis } from './seed/dokterSpesialis.js';
import { seedJadwalDokters } from './seed/jadwalDokters.js';
import { seedBeritas } from './seed/beritas.js';
import { seedHalaman } from './seed/halaman.js';
import { seedIndikatorMutu } from './seed/indikatorMutu.js';
import { prisma } from '../src/lib/prisma.js';
// ...import lainnya...
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
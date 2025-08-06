// prisma/seed/websiteSettings.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedWebsiteSettings = async () => {
  const websiteSettingsData = [
    {
      id: 1,
      website_name: 'RS PKU Muhammadiyah Boja',
      logo_url: '/uploads/images/website-settings/logo-rs-1753972648339.png',
      favicon_url: '/uploads/images/general/logo-1753972705620.png',
      logo_akreditasi_url: '/uploads/images/general/logo-akred-rs-1753972659025.png',
      nama_akreditasi: 'akreditasi larsi',
      email: 'informasi@rspkuboja.com',
      phone: '(029)46103005',
      address: 'Salamsari, Kabupaten Kendal',
      facebook_url: 'https://www.facebook.com/people/Rspku-Muhammadiyah-Boja/61554122393189/',
      twitter_url: 'https://www.tiktok.com/@rspkuboja',
      instagram_url: 'https://www.instagram.com/rspkuboja/',
      youtube_url: 'https://www.youtube.com/@RSPKUBOJA',
      footer_text: 'Mari bersama-sama menjaga kesehatan dan meningkatkan kualitas hidup bersama RS PKU Muhammadiyah Boja. Dapatkan informasi lengkap mengenai layanan dan program kesehatan kami di www.rspkuboja.com. Jangan ragu untuk berkonsultasi—kami siap melayani Anda dengan sepenuh hati.',
      copyright_text: '',
      createdAt: new Date('2025-07-28T21:18:47'),
      updatedAt: new Date('2025-08-01T21:25:19'),
      url_maps: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.11054741301!2d110.2786412!3d-7.1131861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70630bc3a29c41%3A0x3dab212da0b34ae8!2sRUMAH%20SAKIT%20PKU%20Muhammadiyah%20Boja!5e0!3m2!1sid!2sid!4v1754031865192!5m2!1sid!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
    },
  ];

  for (const setting of websiteSettingsData) {
    await prisma.websiteSettings.upsert({
      where: { id: setting.id },
      update: {
        website_name: setting.website_name,
        logo_url: setting.logo_url,
        favicon_url: setting.favicon_url,
        logo_akreditasi_url: setting.logo_akreditasi_url,
        nama_akreditasi: setting.nama_akreditasi,
        email: setting.email,
        phone: setting.phone,
        address: setting.address,
        facebook_url: setting.facebook_url,
        twitter_url: setting.twitter_url,
        instagram_url: setting.instagram_url,
        youtube_url: setting.youtube_url,
        footer_text: setting.footer_text,
        copyright_text: setting.copyright_text,
        createdAt: setting.createdAt,
        updatedAt: setting.updatedAt,
        url_maps: setting.url_maps,
      },
      create: { ...setting },
    });
  }

  console.log(`✅ Seeded ${websiteSettingsData.length} website settings.`);
};
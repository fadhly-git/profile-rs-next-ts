/* eslint-disable @typescript-eslint/no-explicit-any */
import { MenuCategory, WebsiteSettings } from '@/types';
import { prisma } from '../prisma'

export async function getWebsiteData() {
  let retries = 3;
  
  while (retries > 0) {
    try {
      // Pastikan koneksi
      await prisma.$connect()
      
      const [websiteSettings, menuCategories] = await Promise.all([
        prisma.websiteSettings.findFirst({
          orderBy: {
            updatedAt: 'desc',
          },
        }),
        
        prisma.kategori.findMany({
          where: {
            is_main_menu: true,
            is_active: true,
          },
          include: {
            children: {
              where: {
                is_active: true,
              },
              include: {
                Halaman: {
                  where: {
                    is_published: true,
                  },
                },
              },
              orderBy: {
                urutan: 'asc',
              },
            },
            Halaman: {
              where: {
                is_published: true,
              },
            },
          },
          orderBy: {
            urutan: 'asc',
          },
        }),
      ]);

      // Jika berhasil, return data
      return {
        websiteSettings: websiteSettings || getDefaultWebsiteSettings(),
        menuCategories: transformMenuCategories(menuCategories),
      };
      
    } catch (error) {
      console.error(`Error fetching website data (attempt ${4 - retries}):`, error);
      retries--;
      
      if (retries === 0) {
        // Jika semua retry gagal, return default data
        return {
          websiteSettings: getDefaultWebsiteSettings(),
          menuCategories: [] as MenuCategory[],
        };
      }
      
      // Tunggu sebentar sebelum retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

function getDefaultWebsiteSettings(): WebsiteSettings {
  return {
    id: 1,
    website_name: 'Rumah Sakit',
    logo_url: null,
    favicon_url: null,
    logo_akreditasi_url: null,
    nama_akreditasi: null,
    email: null,
    phone: null,
    address: null,
    facebook_url: null,
    twitter_url: null,
    instagram_url: null,
    youtube_url: null,
    footer_text: null,
    copyright_text: null,
    createdAt: null,
    updatedAt: null,
  };
}

function transformMenuCategories(categories: any[]): MenuCategory[] {
  return categories.map(category => ({
    ...category,
    id_kategori: Number(category.id_kategori),
    parent_id: category.parent_id ? Number(category.parent_id) : null,
    children: category.children?.map((child: any) => ({
      ...child,
      id_kategori: Number(child.id_kategori),
      parent_id: child.parent_id ? Number(child.parent_id) : null,
      children: [],
      Halaman: child.Halaman?.map((page: any) => ({
        ...page,
        id_halaman: Number(page.id_halaman),
        menuId: page.menuId ? Number(page.menuId) : null,
        kategoriId: page.kategoriId ? Number(page.kategoriId) : null,
      })) || []
    })) || [],
    Halaman: category.Halaman?.map((page: any) => ({
      ...page,
      id_halaman: Number(page.id_halaman),
      menuId: page.menuId ? Number(page.menuId) : null,
      kategoriId: page.kategoriId ? Number(page.kategoriId) : null,
    })) || []
  }));
}
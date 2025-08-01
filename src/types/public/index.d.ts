// types/index.ts
export interface HeroSection {
    id: number;
    headline: string;
    subheading?: string | null;
    background_image?: string | null;
    cta_button_text_1?: string | null;
    cta_button_link_1?: string | null;
    cta_button_text_2?: string | null;
    cta_button_link_2?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export interface FeatureBlock {
    id: number;
    title: string;
    description?: string | null;
    icon?: string | null;
    image_url?: string | null;
    display_order?: number | null;
    is_active?: boolean | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export interface KategoriSpesialis {
  id: number; // Changed from bigint to number
  nama_spesialis: string;
  deskripsi?: string | null; // Changed from string | undefined to string | null
}

export interface DokterSpesialis {
  id_dokter: number; // Changed from bigint to number
  id_spesialis: number; // Changed from bigint to number
  spesialis: KategoriSpesialis;
}

export interface JadwalDokter {
  id_jadwal: number; // Changed from bigint to number
  id_dokter: number; // Changed from bigint to number
  hari: string;
  jam_mulai: Date;
  jam_selesai: Date;
  status: number;
}

export interface Dokter {
  id_dokter: number; // Changed from bigint to number
  nama_dokter: string;
  photo: string;
  userId?: number | null; // Changed from bigint to number
  dokter_spesialis: DokterSpesialis[];
  JadwalDokters: JadwalDokter[];
}

export interface AboutUsSection {
    id: number;
    title?: string | null;
    short_description: string | null;
    image_url?: string | null;
    read_more_link?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export interface Kategori {
    id_kategori: number;
    nama_kategori: string;
}

export interface Berita {
    id_berita: bigint;
    id_user: bigint;
    id_kategori: bigint;
    bahasa: 'ID' | 'EN';
    updater: string | null;
    slug_berita: string | null;
    judul_berita: string | null;
    isi: string | null;
    status_berita: 'draft' | 'publish';
    jenis_berita: string | null;
    keywords?: string | null;
    thumbnail?: string | null;
    gambar?: string | null;
    icon?: string | null;
    hits?: number | null;
    urutan?: number | null;
    tanggal_post?: Date | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    kategori: Kategori;
}

export interface ProcessedSchedule {
    jam_mulai: string;
    jam_selesai: string;
    activeDays: string[];
    inactiveDays: string[];
}

export interface ProcessedDoctor extends Omit<Dokter, 'JadwalDokters'> {
    processedSchedules: ProcessedSchedule[];
}
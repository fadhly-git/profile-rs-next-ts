export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface User {
    id?: number;
    name?: string;
    email?: string;
    image?: string | null;
}

export interface Account {
    id: string;
    userId: bigint;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string;
    access_token?: string;
    expires_at?: number;
    token_type?: string;
    scope?: string;
    id_token?: string;
    session_state?: string;
    user?: User;
}

export interface Session {
    id: string;
    sessionToken: string;
    userId: bigint;
    expires: Date;
    user?: User;
}

export interface VerificationToken {
    identifier: string;
    token: string;
    expires: Date;
}

export interface AboutUsSection {
    id: number;
    title?: string;
    short_description: string;
    image_url?: string;
    read_more_link?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Kategori {
    id_kategori: bigint;
    nama_kategori: string;
    slug_kategori: string;
    gambar?: string | null;
    keterangan?: string | null;
    parent_id?: bigint | null;
    is_main_menu: boolean;
    urutan?: number | null;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
    parent?: Kategori;
    children?: Kategori[];
    beritas?: Beritas[];
    menu?: Menu[];
    Halaman?: Halaman[];
}

export interface Beritas {
    id_berita: bigint;
    id_user: bigint;
    id_kategori: bigint;
    bahasa: EnumBeritasBahasa;
    updater: string;
    slug_berita: string;
    judul_berita: string;
    isi: string;
    status_berita: EnumStatusBerita;
    jenis_berita: string;
    keywords?: string;
    thumbnail?: string;
    gambar?: string;
    icon?: string;
    hits?: number;
    urutan?: number;
    tanggal_post?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    user?: User;
    kategori?: Kategori;
}

export type EnumStatusBerita = 'draft' | 'publish';
export type EnumBeritasBahasa = 'ID' | 'EN';

export interface Menu {
    id_menu: bigint;
    nama_menu: string;
    route: string;
    icon?: string;
    parent_id?: bigint;
    kategoriId?: bigint;
    external_url?: string;
    urutan?: number;
    is_active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    parent?: Menu;
    children?: Menu[];
    kategori?: Kategori;
    Halaman?: Halaman[];
}

export interface Halaman {
    id_halaman: bigint;
    judul: string;
    slug: string;
    konten: string;
    gambar?: string;
    menuId?: bigint;
    kategoriId?: bigint;
    is_published: boolean;
    createdAt: Date;
    updatedAt: Date;
    menu?: Menu;
    kategori?: Kategori;
}

export interface Dokters {
    id_dokter: bigint;
    nama_dokter: string;
    photo: string;
    dokter_spesialis?: Dokter_spesialis[];
}

export interface Dokter_spesialis {
    id_dokter: bigint;
    id_spesialis: bigint;
    dokter?: Dokters;
}

export interface FeatureBlocks {
    id: number;
    title: string;
    description?: string;
    icon?: string;
    image_url?: string;
    display_order?: number;
    is_active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface HeroSection {
    id: number;
    headline: string;
    subheading?: string;
    background_image?: string;
    cta_button_text_1?: string;
    cta_button_link_1?: string;
    cta_button_text_2?: string;
    cta_button_link_2?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Indikatormutu {
    id: number;
    period?: string;
    judul?: string;
    capaian?: string;
    target?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface JadwalDokters {
    id_jadwal: bigint;
    id_dokter: bigint;
    hari: string;
    jam_mulai: Date;
    jam_selesai: Date;
    status: number;
}

export interface Promotions {
    id: number;
    title: string;
    description?: string;
    image_url?: string;
    link_url?: string;
    start_date?: Date;
    end_date?: Date;
    is_active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface WebsiteSettings {
    id: number;
    website_name?: string | null;
    logo_url?: string | null;
    favicon_url?: string | null;
    logo_akreditasi_url?: string | null;
    nama_akreditasi?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    facebook_url?: string | null;
    twitter_url?: string | null;
    instagram_url?: string | null;
    youtube_url?: string | null;
    footer_text?: string | null;
    copyright_text?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}


export interface KritikSaran {
    id: bigint;
    nama: string;
    email: string;
    alamat: string;
    telepon?: string;
    perawatan_terakait: EnumPerawatanTerkait;
    nama_poli?: string | null;
    nama_kmr_no_kmr?: string;
    kritik: string;
    saran: string;
    createdAt: Date;
    updatedAt: Date;
}

export type EnumPerawatanTerkait = 'Poliklinik' | 'RawatInap';

export interface Visitor {
    id: bigint;
    ipAddress: string;
    visitorId?: string;
    sessionId?: string;
    userAgent?: string;
    referrer?: string;
    path: string;
    country?: string;
    city?: string;
    isBot: boolean;
    isMobile: boolean;
    createdAt: Date;
    expiresAt?: Date;
}
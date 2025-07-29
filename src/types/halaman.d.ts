// types/halaman.ts
export interface HalamanType {
    id_halaman: string
    judul: string
    slug: string
    konten: string
    gambar?: string | null
    kategoriId?: string | null
    is_published: boolean
    createdAt: Date
    updatedAt: Date
    kategori?: {
        id_kategori: string
        nama_kategori: string
        slug_kategori: string
    } | null
}

export interface KategoriType {
    id_kategori: string
    nama_kategori: string
    slug_kategori: string
    parent_id?: string | null
}
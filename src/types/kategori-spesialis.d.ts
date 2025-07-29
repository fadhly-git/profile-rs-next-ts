export type KategoriSpesialis = {
    id: bigint
    nama_spesialis: string
    deskripsi: string | null
    id_spesialis: string
}

export type KategoriSpesialisWithDokter = KategoriSpesialis & {
    dokter_spesialis: Array<{
        id_dokter: string
        id_spesialis: string
        dokter: {
            id_dokter: string
            nama_dokter: string
            photo: string
            userId: string | null
        }
    }>
}
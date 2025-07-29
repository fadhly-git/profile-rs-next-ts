// types/jadwal.ts
export interface JadwalDokter {
    id_jadwal: bigint
    id_dokter: bigint
    hari: string
    jam_mulai: Date
    jam_selesai: Date
    status: number
    dokter: {
        id_dokter: bigint
        nama_dokter: string
        photo: string
        dokter_spesialis: {
            spesialis: {
                nama_spesialis: string
            }
        }[]
    }
}

export interface CreateJadwalInput {
    id_dokter: bigint
    hari: string
    jam_mulai: string
    jam_selesai: string
    status: number
}

export interface UpdateJadwalInput extends CreateJadwalInput {
    id_jadwal: bigint
}
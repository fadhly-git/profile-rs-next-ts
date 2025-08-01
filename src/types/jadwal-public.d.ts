// types/jadwal.ts
export interface Dokters {
  id_dokter: bigint;
  nama_dokter: string;
  photo: string;
  userId: bigint | null; // Ubah dari undefined ke null
  dokter_spesialis: DokterSpesialis[];
  JadwalDokters: JadwalDokters[];
}

export interface DokterSpesialis {
  id_dokter: bigint;
  id_spesialis: bigint;
  spesialis: KategoriSpesialis;
}

export interface KategoriSpesialis {
  id: bigint;
  nama_spesialis: string;
  deskripsi: string | null; // Ubah dari optional ke null
}

export interface JadwalDokters {
  id_jadwal: bigint;
  id_dokter: bigint;
  hari: string;
  jam_mulai: Date;
  jam_selesai: Date;
  status: number;
}

export interface GroupedSchedule {
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  status: number;
}

export interface DokterWithSchedules {
  id_dokter: bigint;
  nama_dokter: string;
  photo: string;
  schedules: GroupedSchedule[];
}

export interface SpesialisGroup {
  nama_spesialis: string;
  dokters: DokterWithSchedules[];
}

// Type untuk data yang dikembalikan dari Prisma
export type PrismaDokters = {
  id_dokter: bigint;
  nama_dokter: string;
  photo: string;
  userId: bigint | null;
  dokter_spesialis: {
    id_dokter: bigint;
    id_spesialis: bigint;
    spesialis: {
      id: bigint;
      nama_spesialis: string;
      deskripsi: string | null;
    };
  }[];
  JadwalDokters: {
    id_jadwal: bigint;
    id_dokter: bigint;
    hari: string;
    jam_mulai: Date;
    jam_selesai: Date;
    status: number;
  }[];
}[];
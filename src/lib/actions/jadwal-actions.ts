// lib/actions/jadwal-actions.ts
'use server'
import { prisma } from '../prisma'
import { revalidatePath } from 'next/cache'
import { CreateJadwalInput, UpdateJadwalInput } from '@/types/jadwal'

export async function getJadwalDokters() {
    try {
        const jadwals = await prisma.jadwalDokters.findMany({
            include: {
                dokter: {
                    include: {
                        dokter_spesialis: {
                            include: {
                                spesialis: true
                            }
                        }
                    }
                }
            },
            orderBy: [
                { hari: 'asc' },
                { jam_mulai: 'asc' }
            ]
        })
        return { success: true, data: jadwals }
    } catch (error) {
        console.error('Error fetching jadwal dokters:', error)
        return { success: false, error: 'Gagal mengambil data jadwal' }
    }
}

export async function createJadwalDokter(data: CreateJadwalInput) {
    try {
        const jamMulai = new Date(`1970-01-01T${data.jam_mulai}:00`)
        const jamSelesai = new Date(`1970-01-01T${data.jam_selesai}:00`)

        await prisma.jadwalDokters.create({
            data: {
                id_dokter: BigInt(data.id_dokter),
                hari: data.hari,
                jam_mulai: jamMulai,
                jam_selesai: jamSelesai,
                status: data.status
            }
        })

        revalidatePath('/admin/jadwal-dokter')
        return { success: true, message: 'Jadwal berhasil ditambahkan' }
    } catch (error) {
        console.error('Error creating jadwal dokter:', error)
        return { success: false, error: 'Gagal menambahkan jadwal' }
    }
}

export async function updateJadwalDokter(data: UpdateJadwalInput) {
    try {
        const jamMulai = new Date(`1970-01-01T${data.jam_mulai}:00`)
        const jamSelesai = new Date(`1970-01-01T${data.jam_selesai}:00`)

        await prisma.jadwalDokters.update({
            where: { id_jadwal: BigInt(data.id_jadwal) },
            data: {
                id_dokter: BigInt(data.id_dokter),
                hari: data.hari,
                jam_mulai: jamMulai,
                jam_selesai: jamSelesai,
                status: data.status
            }
        })

        revalidatePath('/admin/jadwal-dokter')
        return { success: true, message: 'Jadwal berhasil diperbarui' }
    } catch (error) {
        console.error('Error updating jadwal dokter:', error)
        return { success: false, error: 'Gagal memperbarui jadwal' }
    }
}

export async function deleteJadwalDokter(id: bigint) {
    try {
        await prisma.jadwalDokters.delete({
            where: { id_jadwal: BigInt(id) }
        })

        revalidatePath('/admin/jadwal-dokter')
        return { success: true, message: 'Jadwal berhasil dihapus' }
    } catch (error) {
        console.error('Error deleting jadwal dokter:', error)
        return { success: false, error: 'Gagal menghapus jadwal' }
    }
}

export async function updateJadwalStatus(id: bigint, status: number) {
    try {
        await prisma.jadwalDokters.update({
            where: { id_jadwal: BigInt(id) },
            data: { status }
        })

        revalidatePath('/admin/jadwal-dokter')
        return { success: true, message: `Status jadwal berhasil ${status === 1 ? 'diaktifkan' : 'dinonaktifkan'}` }
    } catch (error) {
        console.error("Error update status: ", error)
        return { success: false, error: 'Gagal mengubah status jadwal' }
    }
}

export async function getDokters() {
    try {
        const dokters = await prisma.dokters.findMany({
            include: {
                dokter_spesialis: {
                    include: {
                        spesialis: true
                    }
                }
            }
        })
        return { success: true, data: dokters }
    } catch (error) {
        console.error('Error fetching dokters:', error)
        return { success: false, error: 'Gagal mengambil data dokter' }
    }
}
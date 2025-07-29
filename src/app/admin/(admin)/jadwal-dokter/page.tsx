// app/admin/jadwal-dokter/page.tsx
import { Suspense } from 'react'
import { JadwalDokterPage } from '@/components/jadwal-dokter/jadwal-dokter-page'
import { getJadwalDokters, getDokters } from '@/lib/actions/jadwal-actions'
import { LoadingSpinner } from '@/components/atoms/loading-spinner'

export default async function AdminJadwalDokterPage() {
    const [jadwalResult, dokterResult] = await Promise.all([
        getJadwalDokters(),
        getDokters()
    ])

    if (!jadwalResult.success || !dokterResult.success) {
        return (
            <div className="p-6">
                <div className="text-center text-red-500">
                    Terjadi kesalahan saat memuat data
                </div>
            </div>
        )
    }

    // ...existing code...
    const jadwalData = (jadwalResult.data ?? []).map((jadwal) => ({
        ...jadwal,
        id_jadwal: typeof jadwal.id_jadwal === "string" ? BigInt(jadwal.id_jadwal) : jadwal.id_jadwal,
        dokter: {
            ...jadwal.dokter,
            id_dokter: typeof jadwal.dokter.id_dokter === "string" ? BigInt(jadwal.dokter.id_dokter) : jadwal.dokter.id_dokter,
            userId: jadwal.dokter.userId,
            dokter_spesialis: (jadwal.dokter.dokter_spesialis ?? []).map((ds) => ({
                ...ds,
                id_dokter: typeof ds.id_dokter === "string" ? BigInt(ds.id_dokter) : ds.id_dokter,
                id_spesialis: typeof ds.id_spesialis === "string" ? BigInt(ds.id_spesialis) : ds.id_spesialis,
                spesialis: {
                    ...ds.spesialis,
                    id: typeof ds.spesialis.id === "string" ? BigInt(ds.spesialis.id) : ds.spesialis.id,
                },
            })),
        },
    }))
    // ...existing code...

    // Convert bigint fields to string for dokterResult.data
    const dokterData = (dokterResult.data ?? []).map((dokter) => ({
        ...dokter,
        id_dokter: dokter.id_dokter?.toString?.() ?? "",
        userId: dokter.userId?.toString?.() ?? null,
        dokter_spesialis: (dokter.dokter_spesialis ?? []).map((ds) => ({
            ...ds,
            id_dokter: ds.id_dokter?.toString?.() ?? "",
            id_spesialis: ds.id_spesialis?.toString?.() ?? "",
            spesialis: {
                ...ds.spesialis,
                id: ds.spesialis.id?.toString?.() ?? "",
            },
        })),
    }))

    return (
        <Suspense fallback={<div className="p-6"><LoadingSpinner /></div>}>
            <JadwalDokterPage
                initialData={jadwalData}
                dokters={dokterData}
            />
        </Suspense>
    )
}
// app/admin/dokter/page.tsx
import { getAllDokter } from "@/lib/actions/data-dokter"
import { DokterPageClient } from "@/components/data-dokter/dokter-page-client"

export default async function DokterPage() {
    const dokterListRaw = await getAllDokter()

    // Convert bigint fields to string
    const dokterList = dokterListRaw.map((dokter) => ({
        ...dokter,
        dokter_spesialis: dokter.dokter_spesialis.map((sp) => ({
            id_dokter: sp.id_dokter.toString(),
            id_spesialis: sp.id_spesialis.toString(),
        })),
    }))

    return <DokterPageClient initialData={dokterList} />
}
// app/admin/dokter/edit/[id]/page.tsx
import { getDokterById } from "@/lib/actions/data-dokter"
import { DokterForm } from "@/components/data-dokter/dokter-form"
import { notFound } from "next/navigation"
type EditDokterPageProps = {
    params: Promise<{ id: string }>
}

export default async function EditDokterPage({ params }: EditDokterPageProps) {
    const resolvedParams = await params
    const { id } = resolvedParams
    const dokter = await getDokterById(id)

    if (!dokter) {
        notFound()
    }

    // Map dokter_spesialis to ensure spesialis has id_spesialis property
    const fixedDokter = {
        ...dokter,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dokter_spesialis: dokter.dokter_spesialis.map((ds: any) => ({
            ...ds,
            spesialis: ds.spesialis
                ? {
                    id_spesialis: ds.id_spesialis,
                    nama_spesialis: ds.spesialis.nama_spesialis,
                    deskripsi: ds.spesialis.deskripsi,
                }
                : undefined,
        })),
    }

    return <DokterForm initialData={fixedDokter} isEdit />
}
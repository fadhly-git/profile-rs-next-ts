// app/admin/dokter/edit/[id]/page.tsx
import { getDokterById } from "@/lib/actions/data-dokter"
import { DokterForm } from "@/components/data-dokter/dokter-form"
import { notFound } from "next/navigation"

interface EditDokterPageProps {
    params: {
        id: string
    }
}

export default async function EditDokterPage({ params }: EditDokterPageProps) {
    const awaitParam = await params
    const id = awaitParam.id
    const dokter = await getDokterById(id)

    if (!dokter) {
        notFound()
    }

    return <DokterForm initialData={dokter} isEdit />
}
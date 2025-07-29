// app/admin/halaman/edit/[id]/page.tsx
import { getAllKategori, getHalaman } from '@/lib/actions/halaman'
import { HalamanForm } from '@/components/halaman/halaman-form'
import { notFound } from 'next/navigation'

interface EditHalamanPageProps {
    params: {
        id: string
    }
}

export default async function EditHalamanPage({ params }: EditHalamanPageProps) {
    const awaitParamas = await params
    const id = awaitParamas.id
    try {
        const [halaman, kategoriOptions] = await Promise.all([
            getHalaman(id),
            getAllKategori()
        ])

        return (
            <div className="container mx-auto py-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">Edit Halaman</h1>
                        <p className="text-muted-foreground">
                            Edit halaman: {halaman.judul}
                        </p>
                    </div>

                    <HalamanForm
                        kategoriOptions={kategoriOptions}
                        initialData={halaman}
                        mode="edit"
                    />
                </div>
            </div>
        )
    } catch {
        notFound()
    }
}
// app/admin/halaman/create/page.tsx
import { getAllKategori } from '@/lib/actions/halaman'
import { HalamanForm } from '@/components/halaman/halaman-form'

export default async function CreateHalamanPage() {
    const kategoriOptions = await getAllKategori()

    return (
        <div className="container mx-auto py-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Tambah Halaman Baru</h1>
                    <p className="text-muted-foreground">
                        Buat halaman statis baru untuk website Anda
                    </p>
                </div>

                <HalamanForm
                    kategoriOptions={kategoriOptions}
                    mode="create"
                />
            </div>
        </div>
    )
}
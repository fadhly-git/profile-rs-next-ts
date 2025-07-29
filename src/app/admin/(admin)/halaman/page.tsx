// app/admin/halaman/page.tsx
import { getAllHalaman } from '@/lib/actions/halaman'
import { HalamanList } from '@/components/halaman/halaman-list'

export default async function HalamanPage() {
    const halaman = await getAllHalaman()

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Manajemen Halaman</h1>
                    <p className="text-muted-foreground">
                        Kelola halaman statis website Anda
                    </p>
                </div>
            </div>

            <HalamanList initialData={halaman} />
        </div>
    )
}
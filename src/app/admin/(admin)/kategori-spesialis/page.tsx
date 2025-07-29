import { Suspense } from 'react'
import { getAllSpesialis } from '@/lib/actions/kategori-spesialis'
import KategoriSpesialisDesktop from '@/components/kategori-spesialis/KategoriSpesialisDesktop'
import KategoriSpesialisMobile from '@/components/kategori-spesialis/KategoriSpesialisMobile'
import { LoadingSpinner } from '@/components/atoms/loading-spinner'




export default async function KategoriSpesialisPage() {
    const data = await getAllSpesialis()

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Kelola Kategori Spesialis
                </h1>
                <p className="text-muted-foreground mt-2">
                    Kelola kategori spesialis dokter untuk sistem rumah sakit
                </p>
            </div>

            <Suspense fallback={<LoadingSpinner />}>
                {/* Desktop View */}
                <div className="hidden md:block">
                    <KategoriSpesialisDesktop data={data} />
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                    <KategoriSpesialisMobile data={data} />
                </div>
            </Suspense>
        </div>
    )
}
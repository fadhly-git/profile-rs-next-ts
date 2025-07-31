"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BeritaPageTemplate } from "@/components/berita/templates/BeritaPageTemplate"
import { BeritaDataTable } from "@/components/berita/BeritaDataTable"
import { BeritaDetailModal } from "@/components/berita/BeritaDetailModal"
import { deleteBeritaAction } from '@/lib/actions/berita' 
import { type Beritas } from '@/types'

interface BeritaPageClientProps {
    initialData: Beritas[]
}

export function BeritaPageClient({ initialData }: BeritaPageClientProps) {
    const router = useRouter()
    const [selectedBerita, setSelectedBerita] = useState<Beritas | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)

    const handleDelete = async (id: string) => {
        try {
            await deleteBeritaAction(id)
            toast.success("Berita berhasil dihapus")
            router.refresh()
        } catch (error: unknown) {
            toast.error("Gagal menghapus berita", {
                description: error instanceof Error ? error.message : "Silakan coba lagi"
            })
            throw error
        }
    }

    const handleViewDetail = (berita: Beritas) => {
        setSelectedBerita(berita)
        setShowDetailModal(true)
    }

    return (
        <>
            <BeritaPageTemplate
                title="Manajemen Berita"
                description="Kelola semua berita dan artikel di sistem"
                showCreateButton={true}
            >
                <BeritaDataTable
                    data={initialData}
                    onDelete={handleDelete}
                    onViewDetail={handleViewDetail}
                />
            </BeritaPageTemplate>

            <BeritaDetailModal
                open={showDetailModal}
                onOpenChange={setShowDetailModal}
                berita={selectedBerita}
            />
        </>
    )
}
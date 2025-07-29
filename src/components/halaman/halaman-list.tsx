// components/admin/halaman/halaman-list.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HalamanType } from '@/types/halaman'
import { DataTable } from '@/components/ui/data-table'
import { createColumns } from './columns'
import { MobileCard } from './mobile-card'
import { DetailModal } from './detail-modal'
import { ContextMenuWrapper } from './context-menu-wrapper'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { deleteHalaman } from '@/lib/actions/halaman'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface HalamanListProps {
    initialData: HalamanType[]
}

export function HalamanList({ initialData }: HalamanListProps) {
    const router = useRouter()
    const isMobile = useMediaQuery('(max-width: 768px)')

    const [selectedHalaman, setSelectedHalaman] = useState<HalamanType | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleView = (halaman: HalamanType) => {
        setSelectedHalaman(halaman)
        setShowDetailModal(true)
    }

    const handleEdit = (id: string) => {
        router.push(`/admin/halaman/edit/${id}`)
    }

    const handleDelete = (id: string) => {
        setDeleteId(id)
    }

    const confirmDelete = async () => {
        if (!deleteId) return

        setIsDeleting(true)
        try {
            await deleteHalaman(deleteId)
            toast.success('Halaman berhasil dihapus')
            router.refresh()
        } catch {
            toast.error('Gagal menghapus halaman')
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    const columns = createColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowWrapper = (row: any, children: React.ReactNode) => (
        <ContextMenuWrapper
            halaman={row.original}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            key={row.id}

        >
            {children}
        </ContextMenuWrapper>
    )

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-medium">Daftar Halaman</h2>
                    <span className="text-sm text-muted-foreground">
                        ({initialData.length} halaman)
                    </span>
                </div>

                <Button onClick={() => router.push('/admin/halaman/create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Halaman
                </Button>
            </div>

            {isMobile ? (
                <div className="space-y-4">
                    {initialData.map((halaman) => (
                        <MobileCard
                            key={halaman.id_halaman}
                            halaman={halaman}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={initialData}
                    searchPlaceholder="Cari halaman..."
                    searchColumn="judul"
                    rowWrapper={rowWrapper}
                />
            )}

            <DetailModal
                halaman={selectedHalaman}
                open={showDetailModal}
                onOpenChange={setShowDetailModal}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Halaman</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus halaman ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? 'Menghapus...' : 'Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
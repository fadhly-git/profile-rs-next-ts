// components/admin/about-us/about-us-table.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/ui/data-table'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { columns } from './columns'
import { AboutUsDetailModal } from './about-us-detail-modal'
import { DeleteConfirmDialog } from '@/components/molecules/delete-confirm-dialog'
import { deleteAboutUs } from '@/lib/actions/about-us'
import type { AboutUsSection } from '@/types/about-us'

interface AboutUsTableProps {
    data: AboutUsSection[]
}

export function AboutUsTable({ data }: AboutUsTableProps) {
    const router = useRouter()
    const [selectedItem, setSelectedItem] = useState<AboutUsSection | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        if (!selectedItem) return

        setDeleting(true)
        try {
            await deleteAboutUs(selectedItem.id)
            setShowDeleteDialog(false)
            setSelectedItem(null)
        } catch (error) {
            console.error('Error deleting about us:', error)
        } finally {
            setDeleting(false)
        }
    }

    const handleContextMenu = (item: AboutUsSection) => {
        return {
            onViewDetail: () => {
                setSelectedItem(item)
                setShowDetailModal(true)
            },
            onEdit: () => {
                router.push(`/admin/tentang-kami/edit/${item.id}`)
            },
            onDelete: () => {
                setSelectedItem(item)
                setShowDeleteDialog(true)
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowWrapper = (row: any, children: React.ReactNode) => {
        const item = data[row.index] as AboutUsSection
        const actions = handleContextMenu(item)

        return (
            <ContextMenu key={row.id}>
                <ContextMenuTrigger asChild>
                    {children}
                </ContextMenuTrigger>
                <ContextMenuContent className="w-48">
                    <ContextMenuItem onClick={actions.onViewDetail} className="cursor-pointer">
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Detail
                    </ContextMenuItem>
                    <ContextMenuItem onClick={actions.onEdit} className="cursor-pointer">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={actions.onDelete}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        )
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                searchColumn="title"
                searchPlaceholder="Cari berdasarkan judul..."
                rowWrapper={rowWrapper}
            />

            <AboutUsDetailModal
                data={selectedItem}
                open={showDetailModal}
                onOpenChange={setShowDetailModal}
            />

            <DeleteConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleDelete}
                loading={deleting}
                title="Hapus About Us"
                description={`Apakah Anda yakin ingin menghapus "${selectedItem?.title}"? Tindakan ini tidak dapat dibatalkan.`}
            />
        </>
    )
}
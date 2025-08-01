'use client'

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { deleteSpesialis } from '@/lib/actions/kategori-spesialis'
import { toast } from 'sonner'

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: any
    onEdit: () => void
    onDetail: () => void
    children: React.ReactNode
}

export default function KategoriSpesialisContextMenu({
    item,
    onEdit,
    onDetail,
    children,
}: Props) {
    const handleDelete = async () => {
        if (confirm(`Apakah Anda yakin ingin menghapus "${item.original.nama_spesialis}"?`)) {
            try {
                await deleteSpesialis(item.original.id_spesialis)
                toast.success('Kategori spesialis berhasil dihapus')
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Gagal menghapus kategori spesialis')
            }
        }
    }

    return (
        <ContextMenu key={item.id_spesialis}>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={onDetail}>
                    <Eye className="h-4 w-4 mr-2" />
                    Lihat Detail
                </ContextMenuItem>
                <ContextMenuItem onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                </ContextMenuItem>
                <ContextMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
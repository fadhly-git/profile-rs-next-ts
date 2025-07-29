// components/admin/halaman/context-menu-wrapper.tsx
'use client'

import { HalamanType } from '@/types/halaman'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Eye, Edit, Trash2 } from 'lucide-react'

interface ContextMenuWrapperProps {
    halaman: HalamanType
    children: React.ReactNode
    onView: (halaman: HalamanType) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export function ContextMenuWrapper({
    halaman,
    children,
    onView,
    onEdit,
    onDelete
}: ContextMenuWrapperProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => onView(halaman)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onEdit(halaman.id_halaman)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(halaman.id_halaman)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
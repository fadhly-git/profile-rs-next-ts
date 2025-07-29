// components/admin/halaman/columns.tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { HalamanType } from '@/types/halaman'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Image from 'next/image'

interface ColumnsProps {
    onView: (halaman: HalamanType) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export const createColumns = ({ onView, onEdit, onDelete }: ColumnsProps): ColumnDef<HalamanType>[] => [
    {
        accessorKey: 'gambar',
        header: 'Gambar',
        cell: ({ row }) => {
            const gambar = row.getValue('gambar') as string
            return gambar ? (
                <div className="w-12 h-12 relative rounded-md overflow-hidden">
                    <Image
                        src={gambar}
                        alt="Gambar halaman"
                        fill
                        className="object-cover"
                    />
                </div>
            ) : (
                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">No Image</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'judul',
        header: 'Judul',
        cell: ({ row }) => {
            const judul = row.getValue('judul') as string
            return (
                <div className="max-w-[200px]">
                    <p className="font-medium truncate">{judul}</p>
                    <p className="text-sm text-muted-foreground truncate">
                        /{row.original.slug}
                    </p>
                </div>
            )
        },
    },
    {
        accessorKey: 'kategori',
        header: 'Kategori',
        cell: ({ row }) => {
            const kategori = row.original.kategori
            return kategori ? (
                <Badge variant="secondary">{kategori.nama_kategori}</Badge>
            ) : (
                <span className="text-muted-foreground">-</span>
            )
        },
    },
    {
        accessorKey: 'is_published',
        header: 'Status',
        cell: ({ row }) => {
            const isPublished = row.getValue('is_published') as boolean
            return (
                <Badge variant={isPublished ? 'default' : 'destructive'}>
                    {isPublished ? 'Dipublikasi' : 'Draft'}
                </Badge>
            )
        },
    },
    {
        accessorKey: 'updatedAt',
        header: 'Terakhir Diupdate',
        cell: ({ row }) => {
            const date = row.getValue('updatedAt') as Date
            return format(date, 'dd MMM yyyy, HH:mm', { locale: id })
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const halaman = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" key={halaman.id_halaman}>
                        <DropdownMenuItem onClick={() => onView(halaman)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(halaman.id_halaman)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete(halaman.id_halaman)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
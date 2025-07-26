// components/admin/about-us/columns.tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import type { AboutUsSection } from '@/types/about-us'

export const columns: ColumnDef<AboutUsSection>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
            <Badge variant="outline">{row.getValue('id')}</Badge>
        ),
    },
    {
        accessorKey: 'title',
        header: 'Judul',
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate font-medium">
                {row.getValue('title') || 'Tentang Kami'}
            </div>
        ),
    },
    {
        accessorKey: 'short_description',
        header: 'Deskripsi',
        cell: ({ row }) => (
            <div className="max-w-[300px] truncate text-gray-600">
                {row.getValue('short_description')}
            </div>
        ),
    },
    {
        accessorKey: 'image_url',
        header: 'Gambar',
        cell: ({ row }) => {
            const imageUrl = row.getValue('image_url') as string
            return (
                <div className="flex items-center">
                    {imageUrl ? (
                        <Badge variant="secondary">Ada</Badge>
                    ) : (
                        <Badge variant="outline">Kosong</Badge>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Dibuat',
        cell: ({ row }) => {
            const date = row.getValue('createdAt') as Date
            return date
                ? formatDistanceToNow(new Date(date), { addSuffix: true, locale: id })
                : '-'
        },
    },
]
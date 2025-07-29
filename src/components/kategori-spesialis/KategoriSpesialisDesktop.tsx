/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Plus, MoreHorizontal } from 'lucide-react'
import { KategoriSpesialis } from '@/types/kategori-spesialis'
import KategoriSpesialisForm from './KategoriSpesialisForm'
import KategoriSpesialisDetail from './KategoriSpesialisDetail'
import KategoriSpesialisContextMenu from './KategoriSpesialisContextMenu'
import { Badge } from '@/components/ui/badge'

interface Props {
    data: KategoriSpesialis[]
}

export default function KategoriSpesialisDesktop({ data }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<KategoriSpesialis | null>(null)
    const [detailItemId, setDetailItemId] = useState<string | null>(null)

    const handleCreate = () => {
        setEditingItem(null)
        setIsFormOpen(true)
    }

    const handleEdit = (item: any) => {
        console.log('Editing item:', item.original)
        setEditingItem(item.original)
        setIsFormOpen(true)
    }

    const handleDetail = (item: any) => {
        setDetailItemId(item.id_spesialis)
        setIsDetailOpen(true)
    }

    const columns: ColumnDef<KategoriSpesialis>[] = [
        {
            accessorKey: 'id_spesialis',
            header: 'ID',
            cell: ({ row }) => (
                <Badge variant="outline" className="font-mono">
                    {row.getValue('id_spesialis')}
                </Badge>
            ),
        },
        {
            accessorKey: 'nama_spesialis',
            header: 'Nama Spesialis',
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('nama_spesialis')}</div>
            ),
        },
        {
            accessorKey: 'deskripsi',
            header: 'Deskripsi',
            cell: ({ row }) => {
                const deskripsi = row.getValue('deskripsi') as string
                return (
                    <div className="max-w-xs truncate text-muted-foreground">
                        {deskripsi || '-'}
                    </div>
                )
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            ),
        },
    ]

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold">Daftar Kategori Spesialis</h2>
                    <p className="text-sm text-muted-foreground">
                        Total: {data.length} kategori
                    </p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah Kategori
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={data}
                searchPlaceholder="Cari nama spesialis..."
                searchColumn="nama_spesialis"
                rowWrapper={(row, children) => (
                    <KategoriSpesialisContextMenu
                        item={row}
                        onEdit={() => handleEdit(row)}
                        onDetail={() => handleDetail(row)}
                    >
                        {children}
                    </KategoriSpesialisContextMenu>
                )}
            />

            <KategoriSpesialisForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                editingItem={editingItem}
            />

            <KategoriSpesialisDetail
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                spesialisId={detailItemId}
            />
        </div>
    )
}
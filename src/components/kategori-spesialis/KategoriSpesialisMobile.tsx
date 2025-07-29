'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Plus, Eye, Edit, Trash2, MoreVertical } from 'lucide-react'
import { KategoriSpesialis } from '@/types/kategori-spesialis'
import { deleteSpesialis } from '@/lib/actions/kategori-spesialis'
import KategoriSpesialisForm from './KategoriSpesialisForm'
import KategoriSpesialisDetail from './KategoriSpesialisDetail'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Props {
    data: KategoriSpesialis[]
}

export default function KategoriSpesialisMobile({ data }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<KategoriSpesialis | null>(null)
    const [detailItemId, setDetailItemId] = useState<string | null>(null)

    const handleCreate = () => {
        setEditingItem(null)
        setIsFormOpen(true)
    }

    const handleEdit = (item: KategoriSpesialis) => {
        setEditingItem(item)
        setIsFormOpen(true)
    }

    const handleDetail = (item: KategoriSpesialis) => {
        setDetailItemId(item.id_spesialis)
        setIsDetailOpen(true)
    }

    const handleDelete = async (item: KategoriSpesialis) => {
        if (confirm(`Apakah Anda yakin ingin menghapus "${item.nama_spesialis}"?`)) {
            try {
                await deleteSpesialis(item.id_spesialis)
                toast.success('Kategori spesialis berhasil dihapus')
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Gagal menghapus kategori spesialis')
            }
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold">Kategori Spesialis</h2>
                    <p className="text-sm text-muted-foreground">
                        Total: {data.length} kategori
                    </p>
                </div>
                <Button onClick={handleCreate} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah
                </Button>
            </div>

            <div className="space-y-3">
                {data.map((item) => (
                    <Card key={item.id_spesialis} className="relative">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            ID: {item.id_spesialis}
                                        </Badge>
                                    </div>
                                    <h3 className="font-medium leading-tight">
                                        {item.nama_spesialis}
                                    </h3>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleDetail(item)}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            Lihat Detail
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(item)}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.deskripsi || 'Tidak ada deskripsi'}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

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
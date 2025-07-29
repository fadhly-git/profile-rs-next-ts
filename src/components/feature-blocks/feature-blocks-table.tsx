// components/admin/feature-blocks/feature-blocks-table.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
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
import {
    Eye,
    Edit,
    Trash2,
    Hash,
    Image as ImageIcon,
    Plus
} from 'lucide-react'
import { FeatureBlock } from '@/types/feature-blocks'
import { DetailModal } from './detail-modal'
import { MobileFeatureCard } from './mobile-feature-card'
import { deleteFeatureBlock, toggleFeatureBlockStatus } from '@/lib/actions/feature-blocks'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { useMediaQuery } from '@/hooks/use-media-query'

interface FeatureBlocksTableProps {
    data: FeatureBlock[]
}

export function FeatureBlocksTable({ data }: FeatureBlocksTableProps) {
    const router = useRouter()
    const isMobile = useMediaQuery('(max-width: 768px)')
    const [isPending, startTransition] = useTransition()
    const [selectedItem, setSelectedItem] = useState<FeatureBlock | null>(null)
    const [showDetail, setShowDetail] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<number | null>(null)

    const handleEdit = (id: number) => {
        router.push(`/admin/layanan/edit/${id}`)
    }

    const handleDelete = (id: number) => {
        setItemToDelete(id)
        setShowDeleteDialog(true)
    }

    const confirmDelete = () => {
        if (!itemToDelete) return

        startTransition(async () => {
            try {
                await deleteFeatureBlock(itemToDelete)
                toast.success('Fitur blok berhasil dihapus')
                setShowDeleteDialog(false)
                setItemToDelete(null)
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Gagal menghapus fitur blok')
            }
        })
    }

    const handleToggleStatus = (id: number, currentStatus: boolean) => {
        startTransition(async () => {
            try {
                await toggleFeatureBlockStatus(id, !currentStatus)
                toast.success(`Status berhasil ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`)
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Gagal mengubah status')
            }
        })
    }

    const columns: ColumnDef<FeatureBlock>[] = [
        {
            accessorKey: 'display_order',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2"
                >
                    <Hash className="mr-2 h-4 w-4" />
                    Urutan
                </Button>
            ),
            cell: ({ row }) => (
                <div className="text-center font-medium">
                    {row.getValue('display_order') ?? '-'}
                </div>
            ),
        },
        {
            accessorKey: 'title',
            header: 'Judul',
            cell: ({ row }) => (
                <div className="max-w-[200px]">
                    <div className="font-medium truncate">{row.getValue('title')}</div>
                    {row.original.description && (
                        <div className="text-sm text-muted-foreground truncate">
                            {row.original.description.slice(0, 50)}...
                        </div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'media',
            header: 'Media',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {row.original.icon && (
                        <Badge variant="secondary" className="text-xs">
                            <ImageIcon className="mr-1 h-3 w-3" />
                            Ikon
                        </Badge>
                    )}
                    {row.original.image_url && (
                        <Badge variant="secondary" className="text-xs">
                            <ImageIcon className="mr-1 h-3 w-3" />
                            Gambar
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => (
                <Switch
                    checked={row.getValue('is_active')}
                    onCheckedChange={() => handleToggleStatus(row.original.id, row.original.is_active || false)}
                    disabled={isPending}
                />
            ),
        },
        {
            accessorKey: 'updatedAt',
            header: 'Terakhir Diperbarui',
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    {formatDate(row.getValue('updatedAt'))}
                </div>
            ),
        },
    ]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowWrapper = (row: any, children: React.ReactNode) => (
        <ContextMenu key={row.id}>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => {
                    setSelectedItem(row.original)
                    setShowDetail(true)
                }}>
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleEdit(row.original.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={() => handleDelete(row.original.id)}
                    className="text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )

    if (isMobile) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Layanan ({data.length})</h2>
                    <Button
                        onClick={() => router.push('/admin/layanan/create')}
                        size="sm"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah
                    </Button>
                </div>

                <div className="space-y-3">
                    {data.map((item) => (
                        <MobileFeatureCard
                            key={item.id}
                            item={item}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

                {/* Modals */}
                {selectedItem && (
                    <DetailModal
                        item={selectedItem}
                        open={showDetail}
                        onOpenChange={setShowDetail}
                    />
                )}

                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Fitur Blok</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus fitur blok ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                disabled={isPending}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {isPending ? 'Menghapus...' : 'Hapus'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Layanan</h2>
                    <p className="text-muted-foreground">
                        Kelola fitur promosi layanan yang ditampilkan di website
                    </p>
                </div>
                <Button
                    onClick={() => router.push('/admin/layanan/create')}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Layanan
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={data}
                searchPlaceholder="Cari berdasarkan judul..."
                searchColumn="title"
                rowWrapper={rowWrapper}
            />

            {/* Modals */}
            {selectedItem && (
                <DetailModal
                    item={selectedItem}
                    open={showDetail}
                    onOpenChange={setShowDetail}
                />
            )}

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Fitur Blok</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus fitur blok ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isPending ? 'Menghapus...' : 'Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
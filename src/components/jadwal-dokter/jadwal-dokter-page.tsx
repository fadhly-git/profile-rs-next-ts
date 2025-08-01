/* eslint-disable @typescript-eslint/no-explicit-any */
// components/templates/jadwal-dokter-page.tsx
'use client'

import { useState, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
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
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DataTable } from '@/components/ui/data-table'
import { JadwalFormModal } from '@/components/jadwal-dokter/jadwal-form-modal'
import { JadwalDetailModal } from '@/components/jadwal-dokter/jadwal-detail-modal'
import { JadwalMobileList } from '@/components/jadwal-dokter/jadwal-mobile-list'
import { useIsMobile } from '@/hooks/use-mobile'
import { JadwalDokter } from '@/types/jadwal'
import { deleteJadwalDokter } from '@/lib/actions/jadwal-actions'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { StatusSwitch } from '@/components/molecules/status-switch'

interface JadwalDokterPageProps {
    initialData: JadwalDokter[]
    dokters: any[]
}

export function JadwalDokterPage({ initialData, dokters }: JadwalDokterPageProps) {
    const isMobile = useIsMobile()
    const [formModalOpen, setFormModalOpen] = useState(false)
    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedJadwal, setSelectedJadwal] = useState<JadwalDokter>()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleView = (jadwal: JadwalDokter) => {
        setSelectedJadwal(jadwal)
        setDetailModalOpen(true)
    }

    const handleEdit = (jadwal: JadwalDokter) => {
        setSelectedJadwal(jadwal)
        setFormModalOpen(true)
    }

    const handleDelete = (jadwal: JadwalDokter) => {
        setSelectedJadwal(jadwal)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!selectedJadwal) return

        setIsDeleting(true)
        try {
            const result = await deleteJadwalDokter(selectedJadwal.id_jadwal)
            if (result.success) {
                toast.success("berhasil", {
                    description: result.message
                })
                setDeleteDialogOpen(false)
                setSelectedJadwal(undefined)
            } else {
                toast.error("Gagal", {
                    description: result.error
                })
            }
        } catch (error) {
            toast.error("Terjadi Kesalahan", {
                description: error instanceof Error ? error.message : String(error)
            })
        } finally {
            setIsDeleting(false)
        }
    }

    const columns: ColumnDef<JadwalDokter>[] = useMemo(() => [
        {
            accessorKey: 'dokter',
            header: 'Dokter',
            cell: ({ row }) => {
                const dokter = row.original.dokter
                return (
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={dokter.photo} />
                            <AvatarFallback>
                                {dokter.nama_dokter.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{dokter.nama_dokter}</p>
                            <div className="flex flex-wrap gap-1">
                                {dokter.dokter_spesialis.slice(0, 2).map((ds) => (
                                    <Badge key={ds.spesialis.nama_spesialis} variant="outline" className="text-xs">
                                        {ds.spesialis.nama_spesialis}
                                    </Badge>
                                ))}
                                {dokter.dokter_spesialis.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{dokter.dokter_spesialis.length - 2}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: 'hari',
            header: 'Hari',
        },
        {
            accessorKey: 'jam_mulai',
            header: 'Jam Mulai',
            cell: ({ row }) => row.original.jam_mulai.toTimeString().slice(0, 5),
        },
        {
            accessorKey: 'jam_selesai',
            header: 'Jam Selesai',
            cell: ({ row }) => row.original.jam_selesai.toTimeString().slice(0, 5),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <StatusSwitch
                    jadwalId={row.original.id_jadwal}
                    currentStatus={row.original.status}
                    size="sm"
                />
            ),
        },
    ], [])

    const rowWrapper = (row: any, children: React.ReactNode) => (
        <ContextMenu key={row.id}>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => handleView(row.original)} className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleEdit(row.original)} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={() => handleDelete(row.original)}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Jadwal Dokter
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Kelola jadwal praktik dokter
                    </p>
                </div>
                <Button onClick={() => {
                    setSelectedJadwal(undefined)
                    setFormModalOpen(true)
                }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Jadwal
                </Button>
            </div>

            {isMobile ? (
                <JadwalMobileList
                    data={initialData}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={initialData}
                    searchPlaceholder="Cari dokter..."
                    searchColumn="nama_dokter"
                    rowWrapper={rowWrapper}
                />
            )}

            {/* Form Modal */}
            <JadwalFormModal
                open={formModalOpen}
                onOpenChange={setFormModalOpen}
                jadwal={selectedJadwal}
                dokters={dokters}
            />

            {/* Detail Modal */}
            <JadwalDetailModal
                open={detailModalOpen}
                onOpenChange={setDetailModalOpen}
                jadwal={selectedJadwal}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Jadwal</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus jadwal{' '}
                            <span className="font-semibold">
                                {selectedJadwal?.dokter.nama_dokter}
                            </span>{' '}
                            pada hari{' '}
                            <span className="font-semibold">
                                {selectedJadwal?.hari}
                            </span>?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? 'Menghapus...' : 'Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
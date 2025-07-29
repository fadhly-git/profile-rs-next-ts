// app/admin/dokter/_components/dokter-page-client.tsx
"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Edit, Trash2 } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { deleteDokter } from "@/lib/actions/data-dokter"
import { DokterDetailModal } from "./dokter-detail-modal"
import { DokterMobileCard } from "./dokter-mobile-card"

interface DokterData {
    id_dokter: string
    nama_dokter: string
    photo: string
    userId: string | null
    dokter_spesialis: Array<{
        id_dokter: string
        id_spesialis: string
    }>
}

interface DokterPageClientProps {
    initialData: DokterData[]
}

export function DokterPageClient({ initialData }: DokterPageClientProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [selectedDokter, setSelectedDokter] = useState<DokterData | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const handleDetail = (dokter: DokterData) => {
        setSelectedDokter(dokter)
        setIsDetailOpen(true)
    }

    const handleEdit = (id: string) => {
        router.push(`/admin/data-dokter/edit/${id}`)
    }

    const handleDelete = async (id: string) => {
        startTransition(async () => {
            try {
                await deleteDokter(id)
                toast.success("Data dokter berhasil dihapus")
                setDeleteId(null)
                router.refresh()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Gagal menghapus data")
            }
        })
    }

    const columns: ColumnDef<DokterData>[] = [
        {
            accessorKey: "photo",
            header: "Foto",
            cell: ({ row }) => {
                const dokter = row.original
                return (
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={dokter.photo} alt={dokter.nama_dokter} />
                        <AvatarFallback>
                            {dokter.nama_dokter
                                .split(" ")
                                .map(n => n[0])
                                .join("")
                                .substring(0, 2)
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                )
            },
        },
        {
            accessorKey: "nama_dokter",
            header: "Nama Dokter",
            cell: ({ row }) => {
                const dokter = row.original
                return (
                    <div>
                        <div className="font-medium">{dokter.nama_dokter}</div>
                        <div className="text-sm text-muted-foreground">
                            ID: {dokter.id_dokter}
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "userId",
            header: "User ID",
            cell: ({ row }) => {
                const userId = row.original.userId
                return userId ? (
                    <Badge variant="outline">{userId}</Badge>
                ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                )
            },
        },
        {
            accessorKey: "dokter_spesialis",
            header: "Spesialisasi",
            cell: ({ row }) => {
                const count = row.original.dokter_spesialis.length
                return (
                    <Badge variant={count > 0 ? "default" : "secondary"}>
                        {count > 0 ? `${count} spesialisasi` : "Belum ada"}
                    </Badge>
                )
            },
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => {
                const dokter = row.original
                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDetail(dokter)}
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(dokter.id_dokter)}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteId(dokter.id_dokter)}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowWrapper = (row: any, children: React.ReactNode) => (
        <ContextMenu key={row.id}>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => handleDetail(row.original)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Lihat Detail
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleEdit(row.original.id_dokter)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={() => setDeleteId(row.original.id_dokter)}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Manajemen Dokter</h1>
                    <p className="text-muted-foreground">
                        Kelola data dokter di sistem
                    </p>
                </div>
                <Button onClick={() => router.push("/admin/data-dokter/create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Dokter
                </Button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <DataTable
                    columns={columns}
                    data={initialData}
                    searchPlaceholder="Cari nama dokter..."
                    searchColumn="nama_dokter"
                    rowWrapper={rowWrapper}
                />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {initialData.map((dokter) => (
                    <DokterMobileCard
                        key={dokter.id_dokter}
                        dokter={dokter}
                        onDetail={handleDetail}
                        onEdit={handleEdit}
                        onDelete={(id) => setDeleteId(id)}
                    />
                ))}

                {initialData.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Belum ada data dokter</p>
                        <Button
                            className="mt-3"
                            onClick={() => router.push("/admin/dokter-dokter/create")}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Dokter Pertama
                        </Button>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <DokterDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                dokter={selectedDokter}
            />

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus data dokter ini?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteId && handleDelete(deleteId)}
                            disabled={isPending}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isPending ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
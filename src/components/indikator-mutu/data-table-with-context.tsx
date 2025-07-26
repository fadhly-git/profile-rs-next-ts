// components/indikator-mutu/data-table-with-context.tsx
"use client"

import { useState } from "react"
import { Edit, Plus, ScanEye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { IndikatorMutuForm } from "./indikator-mutu-form"
import { DetailModal } from "./detail-modal"
import { createColumns } from "./columns"
import {
    deleteIndikatorMutu
} from "@/lib/actions/indikator-mutu"
import { toast } from "sonner"
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
import { IndikatorMutu } from "@/types"

interface IndikatorMutuDataTableProps {
    data: IndikatorMutu[]
    uniqueJuduls: string[]
}

// Group data by title for better visualization
const groupDataByTitle = (data: IndikatorMutu[]) => {
    const grouped = data.reduce((acc, item) => {
        const title = item.judul || 'Tanpa Judul'
        if (!acc[title]) {
            acc[title] = []
        }
        acc[title].push(item)
        return acc
    }, {} as Record<string, IndikatorMutu[]>)

    // Sort periods within each group
    Object.keys(grouped).forEach(title => {
        grouped[title].sort((a, b) => {
            const months = [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "Juli", "Agustus", "September", "Oktober", "November", "Desember"
            ]
            const aIndex = months.indexOf(a.period || '')
            const bIndex = months.indexOf(b.period || '')
            return aIndex - bIndex
        })
    })

    return grouped
}

export function IndikatorMutuDataTable({ data, uniqueJuduls }: IndikatorMutuDataTableProps) {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [editingData, setEditingData] = useState<IndikatorMutu | null>(null)
    const [detailData, setDetailData] = useState<IndikatorMutu | null>(null)
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleCreate = () => {
        setEditingData(null)
        setFormMode('create')
        setIsFormOpen(true)
    }

    const handleEdit = (data: IndikatorMutu) => {
        setEditingData(data)
        setFormMode('edit')
        setIsFormOpen(true)
    }

    const handleDetail = (data: IndikatorMutu) => {
        setDetailData(data)
        setIsDetailOpen(true)
    }

    const handleDelete = (id: number) => {
        setDeleteId(id)
    }

    const confirmDelete = async () => {
        if (!deleteId) return

        setIsDeleting(true)
        try {
            const result = await deleteIndikatorMutu(deleteId)

            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
        } catch {
            toast.error("Terjadi kesalahan saat menghapus data")
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    const columns = createColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onDetail: handleDetail
    })

    const groupedData = groupDataByTitle(data)

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                            Total: {data.length} record • {Object.keys(groupedData).length} indikator unik
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Klik kanan pada baris untuk aksi cepat
                        </div>
                    </div>
                    <Button onClick={handleCreate} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Data
                    </Button>
                </div>

                {/* Grouped View */}
                <div className="space-y-6">
                    {Object.entries(groupedData).map(([title, items]) => (
                        <div key={title} className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-lg">{title}</h3>
                                <div className="text-sm text-muted-foreground">
                                    {items.length} periode
                                </div>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <ContextMenu>
                                    <ContextMenuTrigger asChild>
                                        <div>
                                            <DataTable
                                                columns={columns}
                                                data={items}
                                                searchColumn="judul"
                                                searchPlaceholder="Cari berdasarkan judul..."
                                            />
                                        </div>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                        <ContextMenuItem
                                            onClick={() => handleDetail(items[0])}
                                            className="gap-2"
                                        >
                                            <ScanEye className="h-4 w-4" />
                                            Detail &quot;{title}&quot;
                                        </ContextMenuItem>
                                        <ContextMenuItem
                                            onClick={() => handleCreate()}
                                            className="gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Tambah periode baru untuk &quot;{title}&quot;
                                        </ContextMenuItem>
                                        <ContextMenuItem
                                            onClick={() => handleEdit(items[0])}
                                            className="gap-2"
                                        >
                                            <Edit className="h-4 w-4" />
                                            Edit &quot;{title}&quot;
                                        </ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Fallback for empty state */}
                {Object.keys(groupedData).length === 0 && (
                    <div className="text-center py-12 border rounded-lg">
                        <div className="text-muted-foreground mb-4">
                            Belum ada data indikator mutu
                        </div>
                        <Button onClick={handleCreate} variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Data Pertama
                        </Button>
                    </div>
                )}
            </div>

            <IndikatorMutuForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                data={editingData}
                mode={formMode}
                uniqueJuduls={uniqueJuduls}
            />

            <DetailModal
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                data={detailData}
                onEdit={handleEdit}
            />

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus data ini?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
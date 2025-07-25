// components/indikator-mutu/data-table.tsx
"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { IndikatorMutuForm } from "./indikator-mutu-form"
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
}

export function IndikatorMutuDataTable({ data }: IndikatorMutuDataTableProps) {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingData, setEditingData] = useState<IndikatorMutu | null>(null)
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

    const columns = createColumns({ onEdit: handleEdit, onDelete: handleDelete })

    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        Total: {data.length} indikator mutu
                    </div>
                    <Button onClick={handleCreate} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Indikator
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={data}
                    searchColumn="judul"
                    searchPlaceholder="Cari berdasarkan judul..."
                />
            </div>

            <IndikatorMutuForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                data={editingData}
                mode={formMode}
            />

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus indikator mutu ini?
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
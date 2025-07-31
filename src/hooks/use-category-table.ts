import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { type Kategori } from '@/types'

export function useCategoryTable() {
    const router = useRouter()
    const [selectedKategori, setSelectedKategori] = useState<Kategori | null>(null)
    const [showDetailDialog, setShowDetailDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleView = (kategori: Kategori) => {
        setSelectedKategori(kategori)
        setShowDetailDialog(true)
    }

    const handleEdit = (kategori: Kategori) => {
        router.push(`/admin/kategori/edit/${kategori.id_kategori}`)
    }

    const handleDelete = (kategori: Kategori) => {
        setSelectedKategori(kategori)
        setShowDeleteDialog(true)
    }

    const confirmDelete = async (deleteAction: (id: string) => Promise<void>) => {
        if (!selectedKategori) return

        setIsDeleting(true)
        try {
            await deleteAction(selectedKategori.id_kategori.toString())
            toast.success("Kategori berhasil dihapus")
            router.refresh()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error("Gagal menghapus kategori", {
                description: error.message || "Silakan coba lagi"
            })
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
            setSelectedKategori(null)
        }
    }

    const closeDialogs = () => {
        setShowDetailDialog(false)
        setShowDeleteDialog(false)
        setSelectedKategori(null)
    }

    return {
        selectedKategori,
        showDetailDialog,
        showDeleteDialog,
        isDeleting,
        handleView,
        handleEdit,
        handleDelete,
        confirmDelete,
        closeDialogs,
        setShowDetailDialog,
        setShowDeleteDialog
    }
}
"use client"

import { CategoryTable } from "./category-table"
import { CategoryDetailDialog } from "./category-detail-dialog"
import { CategoryDeleteDialog } from "./category-delete-dialog"
import { useCategoryTable } from "@/hooks/use-category-table"
import { deleteKategoriAction } from "@/lib/actions/kategori"
import { type Kategori } from '@/types'

interface CategoryTableContainerProps {
    data: Kategori[]
}

export function CategoryTableContainer({ data }: CategoryTableContainerProps) {
    const {
        selectedKategori,
        showDetailDialog,
        showDeleteDialog,
        isDeleting,
        handleView,
        handleEdit,
        handleDelete,
        confirmDelete,
        setShowDetailDialog,
        setShowDeleteDialog
    } = useCategoryTable()

    return (
        <>
            <CategoryTable
                data={data}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <CategoryDetailDialog
                isOpen={showDetailDialog}
                onClose={() => setShowDetailDialog(false)}
                kategori={selectedKategori}
            />

            <CategoryDeleteDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={() => confirmDelete(async (id: string) => {
                    await deleteKategoriAction(id);
                })}
                kategori={selectedKategori}
                isDeleting={isDeleting}
            />
        </>
    )
}
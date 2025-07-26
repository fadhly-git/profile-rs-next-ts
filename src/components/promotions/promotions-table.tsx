// components/promotions/promotions-table.tsx
"use client"

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/ui/data-table'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { PromotionDetailModal } from './promotion-detail-modal'
import { columns } from './columns'
import { deletePromotion } from '@/lib/actions/promotion'
import { toast } from 'sonner'
import { Eye, Edit, Trash2 } from 'lucide-react'
import type { Promotion } from '@/types/promotion'

interface PromotionsTableProps {
    data: Promotion[]
}

export function PromotionsTable({ data }: PromotionsTableProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
    const [detailModalOpen, setDetailModalOpen] = useState(false)

    const handleDelete = (promotion: Promotion) => {
        if (!confirm('Are you sure you want to delete this promotion?')) return

        startTransition(async () => {
            const result = await deletePromotion(promotion.id)
            if (result.success) {
                toast.success('Promotion deleted successfully')
            } else {
                toast.error(result.error || 'Failed to delete promotion')
            }
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowWrapper = (row: any, children: React.ReactNode) => (
        <ContextMenu key={row.id}>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem
                    onClick={() => {
                        setSelectedPromotion(row.original)
                        setDetailModalOpen(true)
                    }}
                    className="cursor-pointer"
                >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={() => router.push(`/admin/promosi/edit/${row.original.id}`)}
                    className="cursor-pointer"
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={() => handleDelete(row.original)}
                    className="cursor-pointer text-red-600 dark:text-red-400"
                    disabled={isPending}
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )

    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                searchPlaceholder="Search promotions..."
                searchColumn="title"
                rowWrapper={rowWrapper}
            />

            <PromotionDetailModal
                promotion={selectedPromotion}
                open={detailModalOpen}
                onOpenChange={setDetailModalOpen}
            />
        </>
    )
}
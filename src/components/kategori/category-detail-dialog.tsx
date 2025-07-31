import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BadgeStatus } from "../ui/badge-status"
import { formatDate } from "@/lib/utils"
import { type Kategori } from '@/types'
import { Badge } from "../ui/badge"

interface CategoryDetailDialogProps {
    isOpen: boolean
    onClose: () => void
    kategori: Kategori | null
}

export function CategoryDetailDialog({
    isOpen,
    onClose,
    kategori
}: CategoryDetailDialogProps) {
    if (!kategori) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl sm:max-w-4xl max-h-[90vh]">
                <DialogHeader className="pb-4">
                    <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span>Detail Kategori</span>
                        <Badge variant="outline">{kategori.id_kategori}</Badge>
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Informasi lengkap kategori: {kategori.nama_kategori}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-4">
                            <DetailField
                                label="ID Kategori"
                                value={kategori.id_kategori}
                                mono
                            />

                            <DetailField
                                label="Nama Kategori"
                                value={kategori.nama_kategori}
                                className="font-medium"
                            />

                            <DetailField
                                label="Slug Kategori"
                                value={kategori.slug_kategori}
                                mono
                            />

                            <DetailField
                                label="Parent ID"
                                value={
                                    kategori.parent_id ? (
                                        <Badge variant="secondary">{kategori.parent_id}</Badge>
                                    ) : (
                                        <span className="text-muted-foreground">Tidak ada parent</span>
                                    )
                                }
                            />
                        </div>

                        <div className="space-y-4">
                            <DetailField
                                label="Keterangan"
                                value={
                                    <ScrollArea className="h-20 w-full">
                                        <div className="bg-muted px-3 py-2 rounded text-sm">
                                            {kategori.keterangan || 'Tidak ada keterangan'}
                                        </div>
                                    </ScrollArea>
                                }
                            />

                            <DetailField
                                label="Main Menu"
                                value={
                                    <BadgeStatus
                                        status={kategori.is_main_menu ? "success" : "info"}
                                        className="text-xs"

                                    >
                                        {kategori.is_main_menu ? "Ya" : "Tidak"}
                                    </BadgeStatus>
                                }
                            />

                            <DetailField
                                label="Status Aktif"
                                value={<BadgeStatus status={kategori.is_active ? "success" : "warning"} className="text-xs">
                                    {kategori.is_active ? "Aktif" : "Nonaktif"}
                                </BadgeStatus>}
                            />

                            <DetailField
                                label="Tanggal Dibuat"
                                value={formatDate(kategori.createdAt)}
                                className="text-sm"
                            />
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

interface DetailFieldProps {
    label: string
    value: React.ReactNode
    mono?: boolean
    className?: string
}

function DetailField({ label, value, mono, className }: DetailFieldProps) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">
                {label}
            </label>
            <div className={`text-sm ${mono ? 'font-mono bg-muted px-2 py-1 rounded' : ''} ${className || ''}`}>
                {value}
            </div>
        </div>
    )
}
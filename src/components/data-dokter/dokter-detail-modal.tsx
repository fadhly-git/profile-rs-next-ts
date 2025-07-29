// @/components/data-dokter/dokter-detail-modal.tsx
"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, User, Hash } from "lucide-react"

interface DokterDetailModalProps {
    isOpen: boolean
    onClose: () => void
    dokter: {
        id_dokter: string
        nama_dokter: string
        photo: string
        userId: string | null
        dokter_spesialis: Array<{
            id_dokter: string
            id_spesialis: string
        }>
    } | null
}

export function DokterDetailModal({ isOpen, onClose, dokter }: DokterDetailModalProps) {
    if (!dokter) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Detail Dokter</DialogTitle>
                    <DialogDescription>
                        Informasi lengkap mengenai dokter
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Avatar dan Nama */}
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={dokter.photo} alt={dokter.nama_dokter} />
                            <AvatarFallback className="text-lg">
                                {dokter.nama_dokter
                                    .split(" ")
                                    .map(n => n[0])
                                    .join("")
                                    .substring(0, 2)
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold">{dokter.nama_dokter}</h3>
                            <p className="text-muted-foreground">Dokter</p>
                        </div>
                    </div>

                    {/* Informasi Detail */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-sm">
                            <Hash className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">ID Dokter:</span>
                            <Badge variant="secondary">{dokter.id_dokter}</Badge>
                        </div>

                        {dokter.userId && (
                            <div className="flex items-center space-x-3 text-sm">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">User ID:</span>
                                <Badge variant="outline">{dokter.userId}</Badge>
                            </div>
                        )}

                        <div className="flex items-center space-x-3 text-sm">
                            <CalendarDays className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Spesialisasi:</span>
                            <span>
                                {dokter.dokter_spesialis.length > 0
                                    ? `${dokter.dokter_spesialis.length} spesialisasi`
                                    : "Belum ada spesialisasi"
                                }
                            </span>
                        </div>
                    </div>

                    {/* Photo URL */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            URL Foto:
                        </label>
                        <div className="p-2 bg-muted rounded text-sm font-mono break-all">
                            {dokter.photo}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
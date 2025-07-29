// @/components/data-dokter/dokter-mobile-card.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Eye, Edit, Trash2, User, Hash } from "lucide-react"

interface DokterMobileCardProps {
    dokter: {
        id_dokter: string
        nama_dokter: string
        photo: string
        userId: string | null
        dokter_spesialis: Array<{
            id_dokter: string
            id_spesialis: string
        }>
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDetail: (dokter: any) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export function DokterMobileCard({ dokter, onDetail, onEdit, onDelete }: DokterMobileCardProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                            <Avatar className="w-12 h-12">
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

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base truncate">
                                    {dokter.nama_dokter}
                                </h3>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="secondary" className="text-xs">
                                        <Hash className="w-3 h-3 mr-1" />
                                        {dokter.id_dokter}
                                    </Badge>

                                    {dokter.userId && (
                                        <Badge variant="outline" className="text-xs">
                                            <User className="w-3 h-3 mr-1" />
                                            {dokter.userId}
                                        </Badge>
                                    )}
                                </div>

                                <p className="text-sm text-muted-foreground mt-1">
                                    {dokter.dokter_spesialis.length > 0
                                        ? `${dokter.dokter_spesialis.length} spesialisasi`
                                        : "Belum ada spesialisasi"
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onDetail(dokter)}
                                className="flex-1"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Detail
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onEdit(dokter.id_dokter)}
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onDelete(dokter.id_dokter)}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </ContextMenuTrigger>

            <ContextMenuContent>
                <ContextMenuItem onClick={() => onDetail(dokter)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Lihat Detail
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onEdit(dokter.id_dokter)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={() => onDelete(dokter.id_dokter)}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
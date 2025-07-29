// components/molecules/jadwal-mobile-list.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { JadwalDokter } from '@/types/jadwal'
import { Eye, Edit, Trash2 } from 'lucide-react'

interface JadwalMobileListProps {
    data: JadwalDokter[]
    onView: (jadwal: JadwalDokter) => void
    onEdit: (jadwal: JadwalDokter) => void
    onDelete: (jadwal: JadwalDokter) => void
}

export function JadwalMobileList({ data, onView, onEdit, onDelete }: JadwalMobileListProps) {
    return (
        <div className="space-y-4">
            {data.map((jadwal) => (
                <ContextMenu key={String(jadwal.id_jadwal)}>
                    <ContextMenuTrigger>
                        <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={jadwal.dokter.photo} />
                                        <AvatarFallback>
                                            {jadwal.dokter.nama_dokter.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {jadwal.dokter.nama_dokter}
                                        </h4>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {jadwal.dokter.dokter_spesialis.slice(0, 2).map((ds) => (
                                                <Badge key={ds.spesialis.nama_spesialis} variant="outline" className="text-xs">
                                                    {ds.spesialis.nama_spesialis}
                                                </Badge>
                                            ))}
                                            {jadwal.dokter.dokter_spesialis.length > 2 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{jadwal.dokter.dokter_spesialis.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={jadwal.status === 1 ? "default" : "secondary"} className="mb-1">
                                            {jadwal.status === 1 ? 'Aktif' : 'Tidak Aktif'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="mt-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium">{jadwal.hari}</span>
                                    <span>
                                        {jadwal.jam_mulai.toTimeString().slice(0, 5)} - {jadwal.jam_selesai.toTimeString().slice(0, 5)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem onClick={() => onView(jadwal)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => onEdit(jadwal)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() => onDelete(jadwal)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            ))}
        </div>
    )
}
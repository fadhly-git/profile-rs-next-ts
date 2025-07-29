// components/admin/halaman/mobile-card.tsx
'use client'

import { HalamanType } from '@/types/halaman'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Image from 'next/image'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface MobileCardProps {
    halaman: HalamanType
    onView: (halaman: HalamanType) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export function MobileCard({ halaman, onView, onEdit, onDelete }: MobileCardProps) {
    return (
        <Card className="w-full">
            <CardContent className="p-4">
                <div className="flex gap-3">
                    {halaman.gambar ? (
                        <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                            <Image
                                src={halaman.gambar}
                                alt="Gambar halaman"
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                            <span className="text-muted-foreground text-xs">No Image</span>
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm truncate">{halaman.judul}</h3>
                                <p className="text-xs text-muted-foreground truncate">/{halaman.slug}</p>

                                <div className="flex items-center gap-2 mt-2">
                                    {halaman.kategori && (
                                        <Badge variant="secondary" className="text-xs">
                                            {halaman.kategori.nama_kategori}
                                        </Badge>
                                    )}
                                    <Badge
                                        variant={halaman.is_published ? 'default' : 'destructive'}
                                        className="text-xs"
                                    >
                                        {halaman.is_published ? 'Dipublikasi' : 'Draft'}
                                    </Badge>
                                </div>

                                <p className="text-xs text-muted-foreground mt-1">
                                    {format(halaman.updatedAt, 'dd MMM yyyy, HH:mm', { locale: id })}
                                </p>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onView(halaman)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Lihat Detail
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onEdit(halaman.id_halaman)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => onDelete(halaman.id_halaman)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Hapus
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
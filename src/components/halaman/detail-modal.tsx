// components/admin/halaman/detail-modal.tsx
'use client'

import { HalamanType } from '@/types/halaman'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Image from 'next/image'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DetailModalProps {
    halaman: HalamanType | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DetailModal({ halaman, open, onOpenChange }: DetailModalProps) {
    if (!halaman) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Detail Halaman</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                    <div className="space-y-4">
                        {halaman.gambar && (
                            <div className="w-full h-48 relative rounded-md overflow-hidden">
                                <Image
                                    src={halaman.gambar}
                                    alt="Gambar halaman"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <div>
                                <label className="text-sm font-medium">Judul</label>
                                <p className="text-sm text-muted-foreground">{halaman.judul}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Slug</label>
                                <p className="text-sm text-muted-foreground">/{halaman.slug}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Kategori</label>
                                <div className="mt-1">
                                    {halaman.kategori ? (
                                        <Badge variant="secondary">{halaman.kategori.nama_kategori}</Badge>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">-</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Status</label>
                                <div className="mt-1">
                                    <Badge variant={halaman.is_published ? 'default' : 'destructive'}>
                                        {halaman.is_published ? 'Dipublikasi' : 'Draft'}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Konten</label>
                                <div className="mt-1 p-3 bg-muted rounded-md">
                                    <div
                                        className="prose prose-sm max-w-none dark:prose-invert"
                                        dangerouslySetInnerHTML={{ __html: halaman.konten }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Dibuat</label>
                                    <p className="text-sm text-muted-foreground">
                                        {format(halaman.createdAt, 'dd MMM yyyy, HH:mm', { locale: id })}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Terakhir Diupdate</label>
                                    <p className="text-sm text-muted-foreground">
                                        {format(halaman.updatedAt, 'dd MMM yyyy, HH:mm', { locale: id })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
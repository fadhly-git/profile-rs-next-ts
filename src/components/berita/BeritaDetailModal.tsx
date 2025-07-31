"use client"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type Beritas } from '@/types'

interface BeritaDetailModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    berita: Beritas | null
}

export function BeritaDetailModal({ open, onOpenChange, berita }: BeritaDetailModalProps) {
    if (!berita) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-4xl !max-h-[90vh]">
                <DialogHeader className="pb-4">
                    <DialogTitle className="flex items-center gap-2">
                        Detail Berita
                        <Badge variant="outline">{berita.id_berita.toString()}</Badge>
                    </DialogTitle>
                    <DialogDescription>
                        {berita.judul_berita}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Judul</label>
                                <p className="text-sm font-medium">{berita.judul_berita}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Slug</label>
                                <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                    {berita.slug_berita}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Kategori</label>
                                <p className="text-sm">
                                    {berita.kategori ? (
                                        <Badge variant="secondary">
                                            {berita.kategori.nama_kategori}
                                        </Badge>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Penulis</label>
                                <p className="text-sm">
                                    {berita.user ? (
                                        <Badge variant="secondary">
                                            {berita.user.name}
                                        </Badge>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Status</label>
                                <p className="text-sm">
                                    <Badge variant={berita.status_berita === 'publish' ? "default" : "secondary"}>
                                        {berita.status_berita === 'publish' ? "Terbit" : "Draft"}
                                    </Badge>
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Jenis Berita</label>
                                <p className="text-sm">
                                    <Badge variant="outline">
                                        {berita.jenis_berita || '-'}
                                    </Badge>
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Bahasa</label>
                                <p className="text-sm">
                                    <Badge variant="outline">
                                        {berita.bahasa}
                                    </Badge>
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Tanggal Terbit</label>
                                <p className="text-sm">
                                    {berita.tanggal_post ?
                                        format(new Date(berita.tanggal_post), 'dd MMM yyyy', { locale: id }) :
                                        '-'
                                    }
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Kata Kunci</label>
                                <p className="text-sm bg-muted px-3 py-2 rounded">
                                    {berita.keywords || '-'}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Hits</label>
                                <p className="text-sm">
                                    {berita.hits || 0} kali dilihat
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Thumbnail</label>
                            {berita.thumbnail ? (
                                <div className="mt-1">
                                    <Image
                                        src={berita.thumbnail}
                                        alt={berita.judul_berita}
                                        className="max-w-xs rounded-md"
                                        width={200}
                                        height={120}
                                    />
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground mt-1">Tidak ada thumbnail</p>
                            )}
                        </div>

                        {berita.gambar && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Gambar Utama</label>
                                <div className="mt-1">
                                    <Image
                                        src={berita.gambar}
                                        alt={berita.judul_berita}
                                        className="max-w-xs rounded-md"
                                        width={200}
                                        height={120}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Isi Berita</label>
                            <div
                                className="prose prose-sm dark:prose-invert mt-2 max-w-none"
                                dangerouslySetInnerHTML={{ __html: berita.isi }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Dibuat</label>
                                <p className="text-sm">
                                    {berita.createdAt ? format(new Date(berita.createdAt), 'dd MMM yyyy HH:mm', { locale: id }) : '-'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Diperbarui</label>
                                <p className="text-sm">
                                    {berita.updatedAt ? format(new Date(berita.updatedAt), 'dd MMM yyyy HH:mm', { locale: id }) : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
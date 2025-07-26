// components/admin/about-us/about-us-detail-modal.tsx
'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import type { AboutUsSection } from '@/types/about-us'

interface AboutUsDetailModalProps {
    data: AboutUsSection | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AboutUsDetailModal({
    data,
    open,
    onOpenChange
}: AboutUsDetailModalProps) {
    if (!data) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogHeader>
                <DialogTitle>Detail About Us</DialogTitle>
            </DialogHeader>
            <DialogContent className="!max-w-2xl min-h-0 overflow-y-auto">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">{data.title}</h3>
                        <Badge variant="outline">ID: {data.id}</Badge>
                    </div>

                    {data.image_url && (
                        <div>
                            <label className="text-sm font-medium block mb-2">
                                Gambar
                            </label>
                            <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                <Image
                                    src={data.image_url}
                                    alt={data.title || 'About Us Image'}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium block mb-2">
                            Deskripsi Singkat
                        </label>
                        <div className="p-4 rounded-lg">
                            <p className="text-sm whitespace-pre-wrap text-justify">
                                {data.short_description}
                            </p>
                        </div>
                    </div>

                    {data.read_more_link && (
                        <div>
                            <label className="text-sm font-medium block mb-2">
                                Link Selengkapnya
                            </label>
                            <p className="text-sm text-blue-600 underline">
                                {data.read_more_link}
                            </p>
                        </div>
                    )}

                    <div className="flex gap-4 text-sm">
                        <div>
                            <span className="font-medium">Dibuat:</span>{' '}
                            {data.createdAt
                                ? formatDistanceToNow(new Date(data.createdAt), {
                                    addSuffix: true,
                                    locale: id
                                })
                                : '-'
                            }
                        </div>
                        <div>
                            <span className="font-medium">Diperbarui:</span>{' '}
                            {data.updatedAt
                                ? formatDistanceToNow(new Date(data.updatedAt), {
                                    addSuffix: true,
                                    locale: id
                                })
                                : '-'
                            }
                        </div>
                    </div>
                </div>
                <DialogDescription className="mt-4 text-xs text-accent/80">
                    Ini adalah detail lengkap dari About Us section. Anda dapat melihat
                    informasi lengkap seperti gambar, deskripsi, dan link selengkapnya.
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
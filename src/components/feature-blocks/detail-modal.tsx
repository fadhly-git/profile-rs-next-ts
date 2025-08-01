// components/admin/feature-blocks/detail-modal.tsx
'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FeatureBlock } from '@/types/feature-blocks'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import { isValidImageUrl } from '@/lib/validators'

interface DetailModalProps {
    item: FeatureBlock
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DetailModal({ item, open, onOpenChange }: DetailModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Detail Fitur Blok
                        <Badge variant={item.is_active ? "default" : "secondary"}>
                            {item.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium mb-2">Informasi Dasar</h3>
                        <Separator className="mb-3" />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">ID:</span>
                                <p className="font-medium">{item.id}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Urutan Tampilan:</span>
                                <p className="font-medium">{item.display_order ?? '-'}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Judul</h3>
                        <p className="text-sm bg-muted p-3 rounded-lg">{item.title}</p>
                    </div>

                    {item.description && (
                        <div>
                            <h3 className="font-medium mb-2">Deskripsi</h3>
                            <p className="text-sm bg-muted p-3 rounded-lg whitespace-pre-wrap">
                                {item.description}
                            </p>
                        </div>
                    )}

                    <div>
                        <h3 className="font-medium mb-2">Media</h3>
                        <Separator className="mb-3" />
                        <div className="grid md:grid-cols-2 gap-4">
                            {item.icon && (
                                <div className="space-y-2">
                                    <span className="text-sm text-muted-foreground">Ikon:</span>
                                    <div className="border rounded-lg p-3 bg-muted/30">
                                        {item.icon.startsWith('http') ? (
                                            <Image
                                                src={item.icon}
                                                alt="Icon"
                                                width={48}
                                                height={48}
                                                className="rounded"
                                            />
                                        ) : (
                                            <div className="text-xs font-mono break-all">{item.icon}</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {item.image_url && (
                                <div className="space-y-2">
                                    <span className="text-sm text-muted-foreground">Gambar:</span>
                                    <div className="border rounded-lg p-3 bg-muted/30">
                                        {isValidImageUrl(item.image_url) ? (
                                            <Image
                                                src={item.image_url}
                                                alt="Image"
                                                width={200}
                                                height={120}
                                                className="rounded object-cover"
                                            />
                                        ) : (
                                            <div className="text-xs font-mono break-all">{JSON.stringify(isValidImageUrl(item.image_url))}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Informasi Sistem</h3>
                        <Separator className="mb-3" />
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Dibuat:</span>
                                <span>{formatDate(item.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Diperbarui:</span>
                                <span>{formatDate(item.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
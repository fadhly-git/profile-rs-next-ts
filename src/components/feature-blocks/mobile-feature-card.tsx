// components/admin/feature-blocks/mobile-feature-card.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
    Eye,
    Edit,
    Trash2,
    MoreVertical,
    Image as ImageIcon,
    Hash
} from 'lucide-react'
import { FeatureBlock } from '@/types/feature-blocks'
import { DetailModal } from './detail-modal'
import { formatDate } from '@/lib/utils'

interface MobileFeatureCardProps {
    item: FeatureBlock
    onEdit: (id: number) => void
    onDelete: (id: number) => void
}

export function MobileFeatureCard({ item, onEdit, onDelete }: MobileFeatureCardProps) {
    const [showDetail, setShowDetail] = useState(false)

    return (
        <>
            <Card className="w-full">
                <CardContent className="p-4">
                    <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                                <h3 className="font-medium text-sm">{item.title}</h3>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={item.is_active ? "default" : "secondary"}
                                        className="text-xs"
                                    >
                                        {item.is_active ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                    {item.display_order !== null && (
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Hash className="h-3 w-3" />
                                            {item.display_order}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setShowDetail(true)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Lihat Detail
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onEdit(item.id)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onDelete(item.id)}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Hapus
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Description */}
                        {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.description}
                            </p>
                        )}

                        {/* Media Preview */}
                        <div className="flex items-center gap-4">
                            {item.icon && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <ImageIcon className="h-3 w-3" />
                                    Ikon
                                </div>
                            )}
                            {item.image_url && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <ImageIcon className="h-3 w-3" />
                                    Gambar
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="text-xs text-muted-foreground pt-2 border-t">
                            Diperbarui {formatDate(item.updatedAt)}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <DetailModal
                item={item}
                open={showDetail}
                onOpenChange={setShowDetail}
            />
        </>
    )
}
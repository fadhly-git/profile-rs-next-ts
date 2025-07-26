// components/promotions/promotion-detail-modal.tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BadgeStatus } from '@/components/ui/badge-status'
import { format } from 'date-fns'
import Image from 'next/image'
import type { Promotion } from '@/types/promotion'

interface PromotionDetailModalProps {
    promotion: Promotion | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PromotionDetailModal({ promotion, open, onOpenChange }: PromotionDetailModalProps) {
    if (!promotion) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Promotion Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {promotion.image_url && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                            <Image
                                src={promotion.image_url}
                                alt={promotion.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold">{promotion.title}</h3>
                            <div className="flex gap-2 mt-2">
                                <BadgeStatus status={promotion?.is_active ? 'success' : 'warning'} >
                                    {promotion.is_active ? 'Active' : 'Inactive'}
                                </BadgeStatus>
                            </div>
                        </div>

                        {promotion.description && (
                            <div>
                                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                    {promotion.description}
                                </p>
                            </div>
                        )}

                        {promotion.link_url && (
                            <div>
                                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">
                                    Link URL
                                </h4>
                                <a
                                    href={promotion.link_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                                >
                                    {promotion.link_url}
                                </a>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {promotion.start_date && (
                                <div>
                                    <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">
                                        Start Date
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {format(new Date(promotion.start_date), 'PPP')}
                                    </p>
                                </div>
                            )}

                            {promotion.end_date && (
                                <div>
                                    <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">
                                        End Date
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {format(new Date(promotion.end_date), 'PPP')}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">
                                    Created At
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {promotion.createdAt ? format(new Date(promotion.createdAt), 'PPp') : '-'}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">
                                    Updated At
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {promotion.updatedAt ? format(new Date(promotion.updatedAt), 'PPp') : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
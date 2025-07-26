// components/promotions/columns.tsx
"use client"

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import Image from 'next/image'
import { BadgeStatus } from '../ui/badge-status'
import type { Promotion } from '@/types/promotion'

export const columns: ColumnDef<Promotion>[] = [
    {
        accessorKey: 'image_url',
        header: 'Image',
        cell: ({ row }) => {
            const imageUrl = row.getValue('image_url') as string
            return imageUrl ? (
                <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                    <Image
                        src={imageUrl}
                        alt={row.original.title}
                        fill
                        className="object-cover"
                    />
                </div>
            ) : (
                <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-400">No Image</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => {
            const title = row.getValue('title') as string
            return (
                <div>
                    <div className="font-medium">{title}</div>
                    {row.original.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                            {row.original.description}
                        </div>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: 'start_date',
        header: 'Start Date',
        cell: ({ row }) => {
            const startDate = row.getValue('start_date') as Date
            return startDate ? format(new Date(startDate), 'MMM dd, yyyy') : '-'
        },
    },
    {
        accessorKey: 'end_date',
        header: 'End Date',
        cell: ({ row }) => {
            const endDate = row.getValue('end_date') as Date
            return endDate ? format(new Date(endDate), 'MMM dd, yyyy') : '-'
        },
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
            const isActive = row.getValue('is_active') as boolean
            return (
                <BadgeStatus status={isActive ? 'success' : 'warning'}>
                    {isActive ? 'Active' : 'Inactive'}
                </BadgeStatus>
            )
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => {
            const createdAt = row.getValue('createdAt') as Date
            return createdAt ? format(new Date(createdAt), 'MMM dd, yyyy') : '-'
        },
    },
]
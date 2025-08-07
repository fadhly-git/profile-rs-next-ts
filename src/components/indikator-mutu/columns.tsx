// components/indikator-mutu/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Edit, Trash2, ArrowUpDown, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BadgeStatus } from "@/components/ui/badge-status"
import { type IndikatorMutu } from "@/types"
import { formatDate, formatPeriod, getPeriodBadgeInfo } from "@/lib/utils"
import { Badge } from "../ui/badge"

interface ActionsProps {
    onEdit: (data: IndikatorMutu) => void
    onDelete: (id: number) => void
    onDetail: (data: IndikatorMutu) => void // NEW: Tambahkan onDetail
}

const getStatusBadge = (capaian: string, target: string) => {
    const capaianNum = parseFloat(capaian.replace('%', ''))
    const targetNum = parseFloat(target.replace('%', ''))

    if (capaianNum >= targetNum) {
        return <BadgeStatus status="success">Tercapai</BadgeStatus>
    } else if (capaianNum >= targetNum * 0.8) {
        return <BadgeStatus status="warning">Hampir Tercapai</BadgeStatus>
    } else {
        return <BadgeStatus status="danger">Tidak Tercapai</BadgeStatus>
    }
}

export const createColumns = ({ onEdit, onDelete, onDetail }: ActionsProps): ColumnDef<IndikatorMutu>[] => [
    {
        accessorKey: "period",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold"
                >
                    Period
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const period = row.getValue("period") as string
            const badgeInfo = getPeriodBadgeInfo(period)
            return (
                <div className="space-y-1">
                    <Badge variant={badgeInfo.variant} className="text-xs">
                        {badgeInfo.text}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                        {formatPeriod(period)}
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "judul",
        header: "Judul",
        cell: ({ row }) => (
            <div className="max-w-[300px] truncate">{row.getValue("judul")}</div>
        ),
    },
    {
        accessorKey: "capaian",
        header: "Capaian",
        cell: ({ row }) => (
            <div className="font-medium text-blue-600">{row.getValue("capaian")}</div>
        ),
    },
    {
        accessorKey: "target",
        header: "Target",
        cell: ({ row }) => (
            <div className="font-medium text-green-600">{row.getValue("target")}</div>
        ),
    },
    {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
            const capaian = row.getValue("capaian") as string
            const target = row.getValue("target") as string
            return getStatusBadge(capaian, target)
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold"
                >
                    Dibuat
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = row.getValue("createdAt") as Date
            return <div>{formatDate(date)}</div>
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const data = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onDetail(data)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(data)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(data.id)}
                            className="text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

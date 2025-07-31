"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
    ColumnFiltersState,
} from "@tanstack/react-table"
import { ArrowUpDown, Edit2Icon, Eye, Trash } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableFilters } from "../molecules/table-filters"
import { CategoryActions } from "../molecules/category-actions"
import { BadgeStatus } from "@/components/ui/badge-status"
import { type Kategori } from '@/types'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

interface CategoryTableProps {
    data: Kategori[]
    onView: (kategori: Kategori) => void
    onEdit: (kategori: Kategori) => void
    onDelete: (kategori: Kategori) => void
}

export function CategoryTable({ data, onView, onEdit, onDelete }: CategoryTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        slug_kategori: false,
        parent_id: false,
        keterangan: false,
        createdAt: false,
    })

    const columns: ColumnDef<Kategori>[] = [
        {
            accessorKey: "id_kategori",
            header: "ID",
            enableSorting: true,
            enableHiding: false,
            size: 60,
            cell: ({ row }) => (
                <div className="font-mono text-xs">
                    {row.original.id_kategori}
                </div>
            ),
        },
        {
            accessorKey: "nama_kategori",
            header: ({ column }) => (
                <div
                    className="cursor-pointer select-none flex items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nama Kategori
                    <ArrowUpDown className="h-3 w-3" />
                </div>
            ),
            enableSorting: true,
            enableHiding: false,
            cell: ({ row }) => (
                <div className="font-medium min-w-[120px] break-words">
                    {row.original.nama_kategori}
                </div>
            ),
        },
        {
            accessorKey: "slug_kategori",
            header: "Slug",
            cell: ({ row }) => (
                <code className="text-xs bg-muted px-1 py-0.5 rounded break-all">
                    {row.original.slug_kategori}
                </code>
            ),
        },
        {
            accessorKey: "parent_id",
            header: "Parent",
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.parent_id ? (
                        <BadgeStatus status="info" className="text-xs">
                            {row.original.parent_id}
                        </BadgeStatus>
                    ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "is_main_menu",
            header: "Main Menu",
            cell: ({ row }) => (
                <div className="text-center">
                    <BadgeStatus status={row.original.is_main_menu ? "success" : "info"} >
                        {row.original.is_main_menu ? "Ya" : "Tidak"}
                    </BadgeStatus>
                </div>
            ),
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => (
                <div className="text-center">
                    <BadgeStatus status={row.original.is_active ? "success" : "danger"}>
                        {row.original.is_active ? "Aktif" : "Nonaktif"}
                    </BadgeStatus>
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Dibuat",
            enableSorting: true,
            cell: ({ row }) => (
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {row.original.createdAt.toLocaleDateString('id-ID')}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Aksi",
            enableHiding: false,
            size: 50,
            cell: ({ row }) => (
                <CategoryActions
                    onView={() => onView(row.original)}
                    onEdit={() => onEdit(row.original)}
                    onDelete={() => onDelete(row.original)}
                />
            ),
        },
    ]

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnFilters, columnVisibility },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 10 },
        },
    })

    return (
        <div className="w-full space-y-4">
            <TableFilters
                table={table}
                searchValue={(table.getColumn("nama_kategori")?.getFilterValue() as string) ?? ""}
                onSearchChange={(value) => table.getColumn("nama_kategori")?.setFilterValue(value)}
                searchPlaceholder="Cari nama kategori..."
            />

            <div className="rounded-md border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead
                                            key={header.id}
                                            className="whitespace-nowrap px-2 sm:px-3 py-3 text-xs font-medium"
                                        >
                                            {header.isPlaceholder ? null : (
                                                flexRender(header.column.columnDef.header, header.getContext())
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <div className="text-sm">Tidak ada data tersedia</div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                table.getRowModel().rows.map(row => (
                                    <ContextMenu key={row.id}>
                                        <ContextMenuTrigger asChild>
                                            <TableRow className="hover:bg-muted/50">
                                                {row.getVisibleCells().map(cell => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="px-2 sm:px-3 py-3 text-xs sm:text-sm"
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuItem onClick={() => onView(row.original)}>
                                                <Eye /> Lihat
                                            </ContextMenuItem>
                                            <ContextMenuItem onClick={() => onEdit(row.original)}>
                                                <Edit2Icon /> Edit
                                            </ContextMenuItem>
                                            <ContextMenuItem className="text-red-500" onClick={() => onDelete(row.original)}>
                                                <Trash /> Hapus
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
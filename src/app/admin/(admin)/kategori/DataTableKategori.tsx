/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { ArrowUpDown, MoreHorizontal, Eye, Loader2 } from "lucide-react"
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
} from "@/components/ui/context-menu"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteKategoriAction } from "./deleteKategoriAction"
import { type Kategori } from '@/types';
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DataTableKategori({ data }: { data: Kategori[] }) {
    const router = useRouter();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        // Hide less important columns on mobile by default
        slug_kategori: false,
        parent_id: false,
        keterangan: false,
        createdAt: false,
    })
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [selectedKategori, setSelectedKategori] = React.useState<Kategori | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [openDetail, setOpenDetail] = React.useState(false)
    const [selectedDetail, setSelectedDetail] = React.useState<Kategori | null>(null)

    const handleDelete = async () => {
        if (!selectedKategori) return;

        setIsDeleting(true);
        try {
            await deleteKategoriAction(selectedKategori.id_kategori.toString());
            toast.success("Kategori berhasil dihapus");
            router.refresh();
        } catch (error: any) {
            toast.error("Gagal menghapus kategori", {
                description: error.message || "Silakan coba lagi"
            });
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
            setSelectedKategori(null);
        }
    };

    const columns: ColumnDef<Kategori>[] = [
        {
            accessorKey: "id_kategori",
            header: "ID",
            enableSorting: true,
            enableHiding: false,
            size: 80,
            cell: ({ row }) => (
                <div className="font-mono text-xs">
                    {row.original.id_kategori}
                </div>
            ),
        },
        {
            accessorKey: "nama_kategori",
            header: "Nama Kategori",
            enableSorting: true,
            enableHiding: false,
            size: 200,
            cell: ({ row }) => (
                <div className="font-medium min-w-[150px]">
                    {row.original.nama_kategori}
                </div>
            ),
        },
        {
            accessorKey: "slug_kategori",
            header: "Slug",
            enableSorting: true,
            size: 150,
            cell: ({ row }) => (
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    {row.original.slug_kategori}
                </code>
            ),
        },
        {
            accessorKey: "parent_id",
            header: "Parent",
            enableSorting: true,
            size: 100,
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.parent_id ? (
                        <Badge variant="secondary" className="text-xs">
                            {row.original.parent_id}
                        </Badge>
                    ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "keterangan",
            header: "Keterangan",
            size: 200,
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate" title={row.original.keterangan ?? undefined}>
                    {row.original.keterangan || '-'}
                </div>
            ),
        },
        {
            accessorKey: "is_main_menu",
            header: "Main Menu",
            size: 100,
            cell: ({ row }) => (
                <div className="text-center">
                    <Badge variant={row.original.is_main_menu ? "default" : "secondary"} className="text-xs">
                        {row.original.is_main_menu ? 'Ya' : 'Tidak'}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "is_active",
            header: "Status",
            size: 100,
            cell: ({ row }) => (
                <div className="text-center">
                    <Badge variant={row.original.is_active ? "default" : "destructive"} className="text-xs">
                        {row.original.is_active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Dibuat",
            enableSorting: true,
            size: 120,
            cell: ({ row }) => (
                <div className="text-xs text-muted-foreground">
                    {row.original.createdAt.toLocaleDateString('id-ID')}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Aksi",
            enableHiding: false,
            size: 80,
            cell: ({ row }) => {
                const kategori = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedDetail(kategori)
                                    setOpenDetail(true)
                                }}
                            >
                                Lihat detail
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    router.push(`/admin/kategori/edit/${kategori.id_kategori}`);
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedKategori(kategori);
                                    setShowDeleteDialog(true);
                                }}
                                className="text-destructive"
                            >
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

    return (
        <div className="w-full space-y-4">
            {/* Filter and Column Visibility Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="w-full sm:w-auto">
                    <Input
                        placeholder="Cari nama kategori..."
                        value={(table.getColumn("nama_kategori")?.getFilterValue() as string) ?? ""}
                        onChange={e =>
                            table.getColumn("nama_kategori")?.setFilterValue(e.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>

                {/* Column Visibility Toggle */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="ml-auto">
                            <Eye className="mr-2 h-4 w-4" />
                            Kolom
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table
                            .getAllColumns()
                            .filter(column => column.getCanHide())
                            .map(column => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.columnDef.header as string}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Table Container with Horizontal Scroll */}
            <div className="rounded-md border shadow-sm">
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className="whitespace-nowrap px-3 py-3 text-xs font-medium uppercase tracking-wider"
                                                style={{ width: header.getSize() }}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        {...{
                                                            className: header.column.getCanSort()
                                                                ? 'cursor-pointer select-none flex items-center gap-2'
                                                                : '',
                                                        }}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {header.column.getCanSort() && (
                                                            <ArrowUpDown className="h-3 w-3" />
                                                        )}
                                                        {{
                                                            asc: ' 🔼',
                                                            desc: ' 🔽',
                                                        }[header.column.getIsSorted() as string] ?? null}
                                                    </div>
                                                )}
                                            </TableHead>
                                        )
                                    })}
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
                                            <TableRow
                                                className="hover:bg-muted/50 cursor-pointer transition-colors"
                                            >
                                                {row.getVisibleCells().map(cell => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="px-3 py-3 text-sm"
                                                        style={{ width: cell.column.getSize() }}
                                                    >
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedDetail(row.original);
                                                    setOpenDetail(true);
                                                }}
                                            >
                                                Lihat detail
                                            </ContextMenuItem>
                                            <ContextMenuSeparator />
                                            <ContextMenuItem
                                                onClick={() => {
                                                    router.push(`/admin/kategori/edit/${row.original.id_kategori}`);
                                                }}
                                            >
                                                Edit
                                            </ContextMenuItem>
                                            <ContextMenuItem
                                                onClick={(e) => {
                                                    setSelectedKategori(row.original);
                                                    setShowDeleteDialog(true);
                                                }}
                                                className="text-destructive"
                                            >
                                                Hapus
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Enhanced Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Baris per halaman:</span>
                    <Select
                        value={String(table.getState().pagination.pageSize)}
                        onValueChange={value => table.setPageSize(Number(value))}
                    >
                        <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="Pilih" />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 30, 40, 50].map(pageSize => (
                                <SelectItem key={pageSize} value={String(pageSize)}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                        Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
                        {table.getPageCount()} ({table.getFilteredRowModel().rows.length} total)
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            ««
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            «
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            »
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            »»
                        </Button>
                    </div>
                </div>
            </div>

            {/* Enhanced Detail Dialog */}
            <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent className="!max-w-4xl h-1/2">
                    {selectedDetail && (
                        <>
                            <DialogHeader className="pb-4">
                                <DialogTitle className="flex items-center gap-2">
                                    Detail Kategori
                                    <Badge variant="outline">{selectedDetail.id_kategori}</Badge>
                                </DialogTitle>
                                <DialogDescription>
                                    Informasi lengkap kategori: {selectedDetail.nama_kategori}
                                </DialogDescription>
                            </DialogHeader>

                            <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">ID Kategori</label>
                                            <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                                {selectedDetail.id_kategori}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Nama Kategori</label>
                                            <p className="text-sm font-medium">{selectedDetail.nama_kategori}</p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Slug Kategori</label>
                                            <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                                {selectedDetail.slug_kategori}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Parent ID</label>
                                            <p className="text-sm">
                                                {selectedDetail.parent_id ? (
                                                    <Badge variant="secondary">{selectedDetail.parent_id}</Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">Tidak ada parent</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Keterangan</label>
                                            <ScrollArea className="h-20">
                                                <p className="text-sm bg-muted px-3 py-2 rounded">
                                                    {selectedDetail.keterangan || 'Tidak ada keterangan'}
                                                </p>
                                            </ScrollArea>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Main Menu</label>
                                            <p className="text-sm">
                                                <Badge variant={selectedDetail.is_main_menu ? "default" : "secondary"}>
                                                    {selectedDetail.is_main_menu ? "Ya" : "Tidak"}
                                                </Badge>
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Status Aktif</label>
                                            <p className="text-sm">
                                                <Badge variant={selectedDetail.is_active ? "default" : "destructive"}>
                                                    {selectedDetail.is_active ? "Aktif" : "Nonaktif"}
                                                </Badge>
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Tanggal Dibuat</label>
                                            <p className="text-sm">
                                                {selectedDetail.createdAt.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Kategori &quot;{selectedKategori?.nama_kategori}&quot;
                            akan dihapus secara permanen dari sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                "Hapus"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
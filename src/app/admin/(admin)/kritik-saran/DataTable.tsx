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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Eye, Mail, Phone, Calendar } from "lucide-react"
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
} from "@/components/ui/context-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type KritikSaran } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DataTable({ data }: { data: KritikSaran[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        // Hide less important columns on mobile by default
        alamat: false,
        telepon: false,
        nama_kmr_no_kmr: false,
        kritik: false,
        saran: false,
    })
    const [rowSelection, setRowSelection] = React.useState({})
    const [openDetail, setOpenDetail] = React.useState(false)
    const [selectedDetail, setSelectedDetail] = React.useState<KritikSaran | null>(null)

    const columns: ColumnDef<KritikSaran>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 50,
        },
        {
            accessorKey: "nama",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2"
                >
                    Nama
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-medium min-w-[120px]">
                    {row.getValue("nama")}
                </div>
            ),
            enableHiding: false,
            size: 150,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <div className="lowercase text-sm min-w-[160px] flex items-center gap-1">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    {row.getValue("email")}
                </div>
            ),
            enableHiding: false,
            size: 200,
        },
        {
            accessorKey: "alamat",
            header: "Alamat",
            cell: ({ row }) => (
                <div className="max-w-[150px] truncate text-sm" title={row.getValue("alamat") as string}>
                    {row.getValue("alamat")}
                </div>
            ),
            size: 150,
        },
        {
            accessorKey: "telepon",
            header: "Telepon",
            cell: ({ row }) => {
                const telepon = row.getValue("telepon") as string | null;
                return (
                    <div className="text-sm min-w-[100px]">
                        {telepon ? (
                            <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                {telepon}
                            </div>
                        ) : (
                            <span className="text-muted-foreground">-</span>
                        )}
                    </div>
                );
            },
            size: 120,
        },
        {
            accessorKey: "perawatan_terakait",
            header: "Perawatan",
            cell: ({ row }) => (
                <Badge variant="secondary" className="text-xs">
                    {row.getValue("perawatan_terakait")}
                </Badge>
            ),
            size: 120,
        },
        {
            accessorKey: "nama_poli",
            header: "Poli",
            cell: ({ row }) => (
                <Badge variant="outline" className="text-xs">
                    {row.getValue("nama_poli")}
                </Badge>
            ),
            size: 100,
        },
        {
            accessorKey: "nama_kmr_no_kmr",
            header: "Kamar",
            cell: ({ row }) => {
                const kamar = row.getValue("nama_kmr_no_kmr") as string | null;
                return (
                    <div className="text-sm text-center">
                        {kamar ? (
                            <Badge variant="secondary" className="text-xs">
                                {kamar}
                            </Badge>
                        ) : (
                            <span className="text-muted-foreground">-</span>
                        )}
                    </div>
                );
            },
            size: 100,
        },
        {
            accessorKey: "kritik",
            header: "Kritik",
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate text-sm" title={row.getValue("kritik") as string}>
                    {row.getValue("kritik")}
                </div>
            ),
            size: 200,
        },
        {
            accessorKey: "saran",
            header: "Saran",
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate text-sm" title={row.getValue("saran") as string}>
                    {row.getValue("saran")}
                </div>
            ),
            size: 200,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2"
                >
                    <Calendar className="mr-1 h-3 w-3" />
                    Tanggal
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => {
                const date = row.getValue("createdAt") as Date | string;
                return (
                    <div className="text-xs text-muted-foreground min-w-[80px]">
                        {new Date(date).toLocaleDateString('id-ID')}
                    </div>
                );
            },
            size: 100,
        },
        {
            id: "actions",
            header: "Aksi",
            enableHiding: false,
            cell: ({ row }) => {
                const kritik = row.original;
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedDetail(kritik);
                                    setOpenDetail(true);
                                }}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat detail
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    if (kritik.email) {
                                        window.open(`mailto:${kritik.email}`, '_blank');
                                    }
                                }}
                                disabled={!kritik.email}
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Kirim Email
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            size: 80,
        },
    ];

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className="w-full space-y-4">
            {/* Filters and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Input
                        placeholder="Cari nama..."
                        value={(table.getColumn("nama")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("nama")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <Input
                        placeholder="Cari email..."
                        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("email")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            <Eye className="mr-2 h-4 w-4" />
                            Kolom
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                const headerLabels: Record<string, string> = {
                                    nama: "Nama",
                                    email: "Email",
                                    alamat: "Alamat",
                                    telepon: "Telepon",
                                    perawatan_terakait: "Perawatan",
                                    nama_poli: "Poli",
                                    nama_kmr_no_kmr: "Kamar",
                                    kritik: "Kritik",
                                    saran: "Saran",
                                    createdAt: "Tanggal"
                                };

                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {headerLabels[column.id] || column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Selected Rows Info */}
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Badge variant="secondary">
                        {table.getFilteredSelectedRowModel().rows.length} dipilih
                    </Badge>
                    <Button variant="outline" size="sm">
                        Ekspor Terpilih
                    </Button>
                    <Button variant="outline" size="sm">
                        Hapus Terpilih
                    </Button>
                </div>
            )}

            {/* Table Container */}
            <div className="rounded-md border shadow-sm">
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="whitespace-nowrap px-3 py-3 text-xs font-medium uppercase tracking-wider"
                                            style={{ width: header.getSize() }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <ContextMenu key={row.id}>
                                        <ContextMenuTrigger asChild>
                                            <TableRow
                                                data-state={row.getIsSelected() && "selected"}
                                                className="hover:bg-muted/50 cursor-pointer transition-colors"
                                                onClick={() => {
                                                    setSelectedDetail(row.original);
                                                    setOpenDetail(true);
                                                }}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="px-3 py-3"
                                                        style={{ width: cell.column.getSize() }}
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuLabel>Aksi Baris</ContextMenuLabel>
                                            <ContextMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(String(row.original.id));
                                                }}
                                            >
                                                Copy ID
                                            </ContextMenuItem>
                                            <ContextMenuSeparator />
                                            <ContextMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedDetail(row.original);
                                                    setOpenDetail(true);
                                                }}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                Lihat detail
                                            </ContextMenuItem>
                                            <ContextMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (row.original.email) {
                                                        window.open(`mailto:${row.original.email}`, '_blank');
                                                    }
                                                }}
                                                disabled={!row.original.email}
                                            >
                                                <Mail className="mr-2 h-4 w-4" />
                                                Kirim Email
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <div className="text-sm">Tidak ada data kritik & saran</div>
                                        </div>
                                    </TableCell>
                                </TableRow>
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
                        {table.getFilteredSelectedRowModel().rows.length} dari {table.getFilteredRowModel().rows.length} dipilih
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
                        <div className="text-sm">
                            Hal {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
                        </div>
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
                <DialogContent className="!max-w-6xl h-[90vh]" aria-describedby="dialog-description">
                    {selectedDetail && (
                        <>
                            <DialogHeader className="pb-4">
                                <DialogTitle className="flex items-center gap-2">
                                    Detail Kritik & Saran
                                    <Badge variant="outline" className="text-xs">
                                        {new Date(selectedDetail.createdAt).toLocaleDateString('id-ID')}
                                    </Badge>
                                </DialogTitle>
                                <DialogDescription id="dialog-description">
                                    Kritik dan saran dari <strong>{selectedDetail?.nama || 'pengguna'}</strong>
                                </DialogDescription>
                            </DialogHeader>

                            <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
                                <div className="space-y-6">
                                    {/* Contact Information */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <Mail className="h-5 w-5" />
                                                Informasi Kontak
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
                                                    <p className="text-sm font-medium">{selectedDetail.nama}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                                                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                                        {selectedDetail.email}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Alamat</label>
                                                    <p className="text-sm">{selectedDetail.alamat}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Nomor Telepon</label>
                                                    <p className="text-sm">
                                                        {selectedDetail.telepon ? (
                                                            <span className="font-mono">{selectedDetail.telepon}</span>
                                                        ) : (
                                                            <span className="text-muted-foreground">Tidak tersedia</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Service Information */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Informasi Layanan</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Perawatan Terkait</label>
                                                    <p className="text-sm">
                                                        <Badge variant="secondary" className="mt-1">
                                                            {selectedDetail.perawatan_terakait}
                                                        </Badge>
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Poli</label>
                                                    <p className="text-sm">
                                                        <Badge variant="outline" className="mt-1">
                                                            {selectedDetail.nama_poli}
                                                        </Badge>
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Kamar/No Kamar</label>
                                                    <p className="text-sm">
                                                        {selectedDetail.nama_kmr_no_kmr ? (
                                                            <Badge variant="secondary" className="mt-1">
                                                                {selectedDetail.nama_kmr_no_kmr}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground">Tidak tersedia</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Feedback Content */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg text-red-600">Kritik</CardTitle>
                                                <CardDescription>Masukan dan keluhan yang diberikan</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <ScrollArea className="h-32">
                                                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                                                        <p className="text-sm whitespace-pre-line text-red-800">
                                                            {selectedDetail.kritik}
                                                        </p>
                                                    </div>
                                                </ScrollArea>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg text-green-600">Saran</CardTitle>
                                                <CardDescription>Usulan perbaikan yang diberikan</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <ScrollArea className="h-32">
                                                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                                                        <p className="text-sm whitespace-pre-line text-green-800">
                                                            {selectedDetail.saran}
                                                        </p>
                                                    </div>
                                                </ScrollArea>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Timestamp */}
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-4">
                                        <Calendar className="h-4 w-4" />
                                        <span>Dikirim pada: {new Date(selectedDetail.createdAt).toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </ScrollArea>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
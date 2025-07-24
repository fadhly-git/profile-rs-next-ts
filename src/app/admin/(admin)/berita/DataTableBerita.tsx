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
import { ArrowUpDown, MoreHorizontal, Eye, Loader2, Pen, Trash } from "lucide-react"
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
import { deleteBeritaAction } from "./deleteBeritaAction"
import { type Beritas } from '@/types';
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import Image from "next/image"

export function DataTableBerita({ data }: { data: Beritas[] }) {
    const router = useRouter();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        // Sembunyikan kolom yang kurang penting secara default
        id_user: false,
        updater: false,
        keywords: false,
        thumbnail: false,
        gambar: false,
        icon: false,
        hits: false,
        urutan: false,
        createdAt: false,
        updatedAt: false,
    })
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [selectedBerita, setSelectedBerita] = React.useState<Beritas | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [openDetail, setOpenDetail] = React.useState(false)
    const [selectedDetail, setSelectedDetail] = React.useState<Beritas | null>(null)

    const handleDelete = async () => {
        if (!selectedBerita) return;

        setIsDeleting(true);
        try {
            await deleteBeritaAction(selectedBerita.id_berita.toString());
            toast.success("Berita berhasil dihapus");
            router.refresh();
        } catch (error: any) {
            toast.error("Gagal menghapus berita", {
                description: error.message || "Silakan coba lagi"
            });
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
            setSelectedBerita(null);
        }
    };

    const columns: ColumnDef<Beritas>[] = [
        {
            accessorKey: "id_berita",
            header: "ID",
            enableSorting: true,
            enableHiding: false,
            size: 80,
            cell: ({ row }) => (
                <div className="font-mono text-xs">
                    {row.original.id_berita}
                </div>
            ),
        },
        {
            accessorKey: "judul_berita",
            header: "Judul",
            enableSorting: true,
            enableHiding: false,
            size: 300,
            cell: ({ row }) => (
                <div className="font-medium min-w-[200px]">
                    {row.original.judul_berita}
                </div>
            ),
        },
        {
            accessorKey: "kategori",
            header: "Kategori",
            cell: ({ row }) => (
                <div>
                    {row.original.kategori?.nama_kategori || '-'}
                </div>
            ),
        },
        {
            accessorKey: "user",
            header: "Penulis",
            cell: ({ row }) => (
                <div>
                    {row.original.user?.name || '-'}
                </div>
            ),
        },
        {
            accessorKey: "status_berita",
            header: "Status",
            size: 100,
            cell: ({ row }) => (
                <div className="text-center">
                    <Badge
                        variant={row.original.status_berita === "publish" ? "default" : "secondary"}
                        className="text-xs"
                    >
                        {row.original.status_berita === 'publish' ? 'Publish' : 'Draft'}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "jenis_berita",
            header: "Jenis Berita",
            size: 120,
            cell: ({ row }) => (
                <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                        {row.original.jenis_berita || '-'}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "bahasa",
            header: "Bahasa",
            size: 100,
            cell: ({ row }) => (
                <div className="text-center">
                    <Badge variant="secondary" className="text-xs">
                        {row.original.bahasa}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "tanggal_post",
            header: "Tanggal Post",
            enableSorting: true,
            size: 120,
            cell: ({ row }) => (
                <div className="text-xs text-muted-foreground">
                    {row.original.tanggal_post ?
                        format(new Date(row.original.tanggal_post), 'dd MMM yyyy', { locale: id }) :
                        '-'
                    }
                </div>
            ),
        },
        {
            id: "actions",
            header: "Aksi",
            enableHiding: false,
            size: 80,
            cell: ({ row }) => {
                const berita = row.original;
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
                                    setSelectedDetail(berita)
                                    setOpenDetail(true)
                                }}
                            >
                                <Eye className="mr-2 h-4 w-4" /> Lihat detail
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    router.push(`/admin/berita/edit/${berita.id_berita}`);
                                }}
                            >
                                <Pen className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedBerita(berita);
                                    setShowDeleteDialog(true);
                                }}
                                className="text-destructive"
                            >
                                <Trash className="mr-2 h-4 w-4" /> Hapus
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
            {/* Filter dan Kontrol Visibilitas Kolom */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="w-full sm:w-auto">
                    <Input
                        placeholder="Cari judul berita..."
                        value={(table.getColumn("judul_berita")?.getFilterValue() as string) ?? ""}
                        onChange={e =>
                            table.getColumn("judul_berita")?.setFilterValue(e.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>

                {/* Toggle Visibilitas Kolom */}
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

            {/* Tabel */}
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
                                                            onClick: header.column.getToggleSortingHandler(),
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
                                            <div className="text-sm">Tidak ada data berita</div>
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
                                                    router.push(`/admin/berita/edit/${row.original.id_berita}`);
                                                }}
                                            >
                                                Edit
                                            </ContextMenuItem>
                                            <ContextMenuItem
                                                onClick={() => {
                                                    setSelectedBerita(row.original);
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

            {/* Pagination */}
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

            {/* Dialog Detail */}
            <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent className="!max-w-4xl !max-h-[90vh]">
                    {selectedDetail && (
                        <>
                            <DialogHeader className="pb-4">
                                <DialogTitle className="flex items-center gap-2">
                                    Detail Berita
                                    <Badge variant="outline">{selectedDetail.id_berita}</Badge>
                                </DialogTitle>
                                <DialogDescription>
                                    {selectedDetail.judul_berita}
                                </DialogDescription>
                            </DialogHeader>

                            <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Judul</label>
                                            <p className="text-sm font-medium">{selectedDetail.judul_berita}</p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Slug</label>
                                            <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                                {selectedDetail.slug_berita}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Kategori</label>
                                            <p className="text-sm">
                                                {selectedDetail.kategori ? (
                                                    <Badge variant="secondary">
                                                        {selectedDetail.kategori.nama_kategori}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Penulis</label>
                                            <p className="text-sm">
                                                {selectedDetail.user ? (
                                                    <Badge variant="secondary">
                                                        {selectedDetail.user.name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Status</label>
                                            <p className="text-sm">
                                                <Badge variant={selectedDetail.status_berita === 'publish' ? "default" : "secondary"}>
                                                    {selectedDetail.status_berita === 'publish' ? "Publish" : "Draft"}
                                                </Badge>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Jenis Berita</label>
                                            <p className="text-sm">
                                                <Badge variant="outline">
                                                    {selectedDetail.jenis_berita || '-'}
                                                </Badge>
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Bahasa</label>
                                            <p className="text-sm">
                                                <Badge variant="outline">
                                                    {selectedDetail.bahasa}
                                                </Badge>
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Tanggal Post</label>
                                            <p className="text-sm">
                                                {selectedDetail.tanggal_post ?
                                                    format(new Date(selectedDetail.tanggal_post), 'dd MMM yyyy', { locale: id }) :
                                                    '-'
                                                }
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Keywords</label>
                                            <p className="text-sm bg-muted px-3 py-2 rounded">
                                                {selectedDetail.keywords || '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Thumbnail</label>
                                        {selectedDetail.thumbnail && (
                                            <div className="mt-1">
                                                <Image
                                                    src={selectedDetail.thumbnail}
                                                    alt={selectedDetail.judul_berita}
                                                    className="max-w-xs rounded-md"
                                                    width={200}
                                                    height={120}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Isi Berita</label>
                                        <div
                                            className="prose prose-sm dark:prose-invert mt-2 max-w-none"
                                            dangerouslySetInnerHTML={{ __html: selectedDetail.isi }}
                                        />
                                    </div>
                                </div>
                            </ScrollArea>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog Konfirmasi Hapus */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus Berita</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus berita &quot;{selectedBerita?.judul_berita}&quot;?
                            Aksi ini tidak dapat dibatalkan.
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
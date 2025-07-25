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
import { ArrowUpDown, MoreHorizontal, Eye, Loader2, ExternalLink, Plus } from "lucide-react"
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
import { deleteHeroSectionAction } from "./actions"
import { HeroSection } from '@/types'
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export function DataTableHero({ data }: { data: HeroSection[] }) {
    const router = useRouter()
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        subheading: false,
        background_image: false,
        createdAt: false,
        updatedAt: false,
    })
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
    const [selectedHero, setSelectedHero] = React.useState<HeroSection | null>(null)
    const [isDeleting, setIsDeleting] = React.useState(false)
    const [openDetail, setOpenDetail] = React.useState(false)
    const [selectedDetail, setSelectedDetail] = React.useState<HeroSection | null>(null)

    const handleDelete = async () => {
        if (!selectedHero) return

        setIsDeleting(true)
        try {
            await deleteHeroSectionAction(selectedHero.id.toString())
            toast.success("Hero section berhasil dihapus")
            router.refresh()
        } catch (error: any) {
            toast.error("Gagal menghapus hero section", {
                description: error.message || "Silakan coba lagi"
            })
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
            setSelectedHero(null)
        }
    }

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    const columns: ColumnDef<HeroSection>[] = [
        {
            accessorKey: "id",
            header: "ID",
            enableSorting: true,
            enableHiding: false,
            size: 80,
            cell: ({ row }) => (
                <div className="font-mono text-xs">
                    {row.original.id}
                </div>
            ),
        },
        {
            accessorKey: "headline",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-8 p-0 font-medium"
                    >
                        Headline
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            enableSorting: true,
            enableHiding: false,
            size: 250,
            cell: ({ row }) => (
                <div className="font-medium min-w-[200px]">
                    <div className="truncate" title={row.original.headline}>
                        {truncateText(row.original.headline, 50)}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "subheading",
            header: "Subheading",
            enableSorting: true,
            size: 200,
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate text-muted-foreground text-sm" title={row.original.subheading ?? undefined}>
                    {row.original.subheading ? truncateText(row.original.subheading, 40) : '-'}
                </div>
            ),
        },
        {
            accessorKey: "background_image",
            header: "Background",
            size: 120,
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.background_image ? (
                        <div className="flex items-center justify-center">
                            <Image
                                src={row.original.background_image}
                                alt="Background"
                                width={48}
                                height={32}
                                className="h-8 w-12 object-cover rounded border"
                            />
                        </div>
                    ) : (
                        <span className="text-muted-foreground text-xs">No image</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "cta_button_text_1",
            header: "CTA 1",
            size: 120,
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.cta_button_text_1 ? (
                        <Badge variant="outline" className="text-xs">
                            {truncateText(row.original.cta_button_text_1, 15)}
                        </Badge>
                    ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "cta_button_text_2",
            header: "CTA 2",
            size: 120,
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.cta_button_text_2 ? (
                        <Badge variant="outline" className="text-xs">
                            {truncateText(row.original.cta_button_text_2, 15)}
                        </Badge>
                    ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-8 p-0 font-medium"
                    >
                        Dibuat
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            enableSorting: true,
            size: 120,
            cell: ({ row }) => (
                <div className="text-xs text-muted-foreground">
                    {row.original.createdAt?.toLocaleDateString('id-ID')}
                </div>
            ),
        },
        {
            accessorKey: "updatedAt",
            header: "Update",
            enableSorting: true,
            size: 120,
            cell: ({ row }) => (
                <div className="text-xs text-muted-foreground">
                    {row.original.updatedAt?.toLocaleDateString('id-ID')}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Aksi",
            enableHiding: false,
            size: 80,
            cell: ({ row }) => {
                const hero = row.original
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
                                    setSelectedDetail(hero)
                                    setOpenDetail(true)
                                }}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat detail
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    router.push(`/admin/hero-section/edit/${hero.id}`)
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedHero(hero)
                                    setShowDeleteDialog(true)
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
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Hero Section</h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola konten hero section untuk halaman utama
                    </p>
                </div>
                <Button onClick={() => router.push('/admin/hero-section-or-banner/create')} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah Hero Section
                </Button>
            </div>

            {/* Filter and Column Visibility Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="w-full sm:w-auto">
                    <Input
                        placeholder="Cari headline..."
                        value={(table.getColumn("headline")?.getFilterValue() as string) ?? ""}
                        onChange={e =>
                            table.getColumn("headline")?.setFilterValue(e.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>

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
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Table Container */}
            <div className="rounded-lg border shadow-sm">
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider"
                                                style={{ width: header.getSize() }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
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
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.push('/admin/hero-section-or-banner/create')}
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Tambah Hero Section
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                table.getRowModel().rows.map(row => (
                                    <ContextMenu key={row.id}>
                                        <ContextMenuTrigger asChild>
                                            <TableRow className="hover:bg-muted/50 cursor-pointer transition-colors">
                                                {row.getVisibleCells().map(cell => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="px-4 py-3 text-sm"
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
                                                onClick={() => {
                                                    setSelectedDetail(row.original)
                                                    setOpenDetail(true)
                                                }}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                Lihat detail
                                            </ContextMenuItem>
                                            <ContextMenuSeparator />
                                            <ContextMenuItem
                                                onClick={() => {
                                                    router.push(`/admin/hero-section-or-banner/edit/${row.original.id}`)
                                                }}
                                            >
                                                Edit
                                            </ContextMenuItem>
                                            <ContextMenuItem
                                                onClick={() => {
                                                    setSelectedHero(row.original)
                                                    setShowDeleteDialog(true)
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
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 30, 50].map(pageSize => (
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

            {/* Detail Dialog */}
            <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent className="!max-w-4xl max-h-[90vh]">
                    {selectedDetail && (
                        <>
                            <DialogHeader className="pb-4">
                                <DialogTitle className="flex items-center gap-2">
                                    Detail Hero Section
                                    <Badge variant="outline">{selectedDetail.id}</Badge>
                                </DialogTitle>
                                <DialogDescription>
                                    Informasi lengkap hero section
                                </DialogDescription>
                            </DialogHeader>

                            <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Konten Utama</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Headline</label>
                                                <p className="text-sm font-semibold mt-1">{selectedDetail.headline}</p>
                                            </div>

                                            {selectedDetail.subheading && (
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Subheading</label>
                                                    <p className="text-sm mt-1">{selectedDetail.subheading}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {selectedDetail.background_image && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Background Image</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center gap-4">
                                                    <div className="aspect-video w-32 h-20 relative rounded border overflow-hidden">
                                                        <Image
                                                            src={selectedDetail.background_image}
                                                            alt="Background"
                                                            fill
                                                            className="object-cover rounded"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-mono text-muted-foreground break-all">
                                                            {selectedDetail.background_image}
                                                        </p>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="mt-2"
                                                            onClick={() => {
                                                                if (selectedDetail.background_image) {
                                                                    window.open(selectedDetail.background_image, '_blank');
                                                                }
                                                            }}
                                                        >
                                                            <ExternalLink className="mr-2 h-4 w-4" />
                                                            Buka gambar
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Call to Action Buttons</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">CTA Button 1</label>
                                                    <div className="mt-2 space-y-2">
                                                        <div>
                                                            <span className="text-xs text-muted-foreground">Text:</span>
                                                            <p className="text-sm">{selectedDetail.cta_button_text_1 || '-'}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs text-muted-foreground">Link:</span>
                                                            <p className="text-sm font-mono text-blue-600">
                                                                {selectedDetail.cta_button_link_1 || '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">CTA Button 2</label>
                                                    <div className="mt-2 space-y-2">
                                                        <div>
                                                            <span className="text-xs text-muted-foreground">Text:</span>
                                                            <p className="text-sm">{selectedDetail.cta_button_text_2 || '-'}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs text-muted-foreground">Link:</span>
                                                            <p className="text-sm font-mono text-blue-600">
                                                                {selectedDetail.cta_button_link_2 || '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Informasi Sistem</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Tanggal Dibuat</label>
                                                    <p className="text-sm mt-1">
                                                        {selectedDetail.createdAt?.toLocaleString('id-ID') || '-'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Terakhir Diupdate</label>
                                                    <p className="text-sm mt-1">
                                                        {selectedDetail.updatedAt?.toLocaleString('id-ID') || '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </ScrollArea>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Hero section &quot;{selectedHero?.headline}&quot;
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
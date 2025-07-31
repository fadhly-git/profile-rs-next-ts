"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Eye, Pen, Trash, MoreHorizontal } from "lucide-react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { type Beritas } from '@/types'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Import molecules
import { SearchFilter } from "@/components/molecules/SearchFilter"
import { TablePagination } from "@/components/molecules/TablePagination"
import { DeleteConfirmDialog } from "@/components/molecules/delete-confirm-dialog"

// Import atoms
import { BadgeStatus } from "@/components/ui/badge-status"
import { formatDate } from "@/lib/utils"

interface BeritaDataTableProps {
    data: Beritas[]
    onDelete: (id: string) => Promise<void>
    onViewDetail: (berita: Beritas) => void
}

export function BeritaDataTable({ data, onDelete, onViewDetail }: BeritaDataTableProps) {
    const router = useRouter()
    const [searchValue, setSearchValue] = React.useState("")
    const [currentPage, setCurrentPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(10)
    const [selectedBerita, setSelectedBerita] = React.useState<Beritas | null>(null)
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
    const [isDeleting, setIsDeleting] = React.useState(false)

    // Column visibility state
    const [columnVisibility, setColumnVisibility] = React.useState({
        id_berita: true,
        judul_berita: true,
        kategori: true,
        user: true,
        status_berita: true,
        jenis_berita: false,
        bahasa: false,
        tanggal_post: true,
    })

    // Filter data berdasarkan pencarian
    const filteredData = React.useMemo(() => {
        if (!searchValue) return data
        return data.filter(item =>
            item.judul_berita.toLowerCase().includes(searchValue.toLowerCase())
        )
    }, [data, searchValue])

    // Pagination
    const totalItems = filteredData.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize)

    const handleDelete = async () => {
        if (!selectedBerita) return

        setIsDeleting(true)
        try {
            await onDelete(selectedBerita.id_berita.toString())
            toast.success("Berita berhasil dihapus")
        } catch (error: unknown) {
            toast.error("Gagal menghapus berita", {
                description: error instanceof Error ? error.message : "Silakan coba lagi"
            })
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
            setSelectedBerita(null)
        }
    }

    const visibilityColumns = [
        { id: "id_berita", label: "ID", isVisible: columnVisibility.id_berita, canHide: true },
        { id: "judul_berita", label: "Judul", isVisible: columnVisibility.judul_berita, canHide: false },
        { id: "kategori", label: "Kategori", isVisible: columnVisibility.kategori, canHide: true },
        { id: "user", label: "Penulis", isVisible: columnVisibility.user, canHide: true },
        { id: "status_berita", label: "Status", isVisible: columnVisibility.status_berita, canHide: true },
        { id: "jenis_berita", label: "Jenis Berita", isVisible: columnVisibility.jenis_berita, canHide: true },
        { id: "bahasa", label: "Bahasa", isVisible: columnVisibility.bahasa, canHide: true },
        { id: "tanggal_post", label: "Tanggal Post", isVisible: columnVisibility.tanggal_post, canHide: true },
    ]

    const handleVisibilityChange = (columnId: string, isVisible: boolean) => {
        setColumnVisibility(prev => ({
            ...prev,
            [columnId]: isVisible
        }))
    }

    return (
        <div className="w-full space-y-4">
            {/* Filter dan Kontrol */}
            <SearchFilter
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                visibilityColumns={visibilityColumns}
                onVisibilityChange={handleVisibilityChange}
            />

            {/* Detail Modal */}
            <div className="rounded-md border shadow-sm">
                {/* Mobile Card View untuk layar kecil */}
                <div className="block md:hidden">
                    {paginatedData.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="text-sm text-muted-foreground">
                                {searchValue ? "Tidak ada berita yang sesuai dengan pencarian" : "Tidak ada data berita"}
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {paginatedData.map((berita) => (
                                <div key={berita.id_berita.toString()} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-sm truncate">{berita.judul_berita}</h3>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {berita.kategori?.nama_kategori || '-'} • {berita.user?.name || '-'}
                                            </p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => onViewDetail(berita)}>
                                                    <Eye className="mr-2 h-4 w-4" /> Lihat detail
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => router.push(`/admin/berita/edit/${berita.id_berita}`)}
                                                >
                                                    <Pen className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedBerita(berita)
                                                        setShowDeleteDialog(true)
                                                    }}
                                                    className="text-destructive"
                                                >
                                                    <Trash className="mr-2 h-4 w-4" /> Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <BadgeStatus status={berita.status_berita ? "success" : "info"}>
                                                {berita.status_berita}
                                            </BadgeStatus>
                                            <Badge variant="outline" className="text-xs">
                                                {berita.bahasa}
                                            </Badge>
                                        </div>
                                        <span className="text-muted-foreground">
                                            {formatDate(berita.tanggal_post)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop Table View untuk layar besar */}
                <div className="hidden md:block overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                {columnVisibility.id_berita && (
                                    <TableHead className="w-20">ID</TableHead>
                                )}
                                {columnVisibility.judul_berita && (
                                    <TableHead className="min-w-[200px]">Judul</TableHead>
                                )}
                                {columnVisibility.kategori && (
                                    <TableHead>Kategori</TableHead>
                                )}
                                {columnVisibility.user && (
                                    <TableHead>Penulis</TableHead>
                                )}
                                {columnVisibility.status_berita && (
                                    <TableHead>Status</TableHead>
                                )}
                                {columnVisibility.jenis_berita && (
                                    <TableHead>Jenis Berita</TableHead>
                                )}
                                {columnVisibility.bahasa && (
                                    <TableHead>Bahasa</TableHead>
                                )}
                                {columnVisibility.tanggal_post && (
                                    <TableHead>Tanggal Post</TableHead>
                                )}
                                <TableHead className="w-20">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={Object.values(columnVisibility).filter(Boolean).length + 1}
                                        className="h-24 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <div className="text-sm">
                                                {searchValue ? "Tidak ada berita yang sesuai dengan pencarian" : "Tidak ada data berita"}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedData.map((berita) => (
                                    <ContextMenu key={berita.id_berita.toString()}>
                                        <ContextMenuTrigger asChild>
                                            <TableRow>
                                                {columnVisibility.id_berita && (
                                                    <TableCell className="font-mono text-xs">
                                                        {berita.id_berita.toString()}
                                                    </TableCell>
                                                )}
                                                {columnVisibility.judul_berita && (
                                                    <TableCell className="font-medium">
                                                        {berita.judul_berita}
                                                    </TableCell>
                                                )}
                                                {columnVisibility.kategori && (
                                                    <TableCell>
                                                        {berita.kategori?.nama_kategori || '-'}
                                                    </TableCell>
                                                )}
                                                {columnVisibility.user && (
                                                    <TableCell>
                                                        {berita.user?.name || '-'}
                                                    </TableCell>
                                                )}
                                                {columnVisibility.status_berita && (
                                                    <TableCell>
                                                        <BadgeStatus status={berita.status_berita != "draft"? "success" : "warning"}>
                                                            {berita.status_berita}
                                                        </BadgeStatus>
                                                    </TableCell>
                                                )}
                                                {columnVisibility.jenis_berita && (
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-xs">
                                                            {berita.jenis_berita || '-'}
                                                        </Badge>
                                                    </TableCell>
                                                )}
                                                {columnVisibility.bahasa && (
                                                    <TableCell>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {berita.bahasa}
                                                        </Badge>
                                                    </TableCell>
                                                )}
                                                {columnVisibility.tanggal_post && (
                                                    <TableCell className="text-xs text-muted-foreground">
                                                        {formatDate(berita.tanggal_post)}
                                                    </TableCell>
                                                )}
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => onViewDetail(berita)}>
                                                                <Eye className="mr-2 h-4 w-4" /> Lihat detail
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => router.push(`/admin/berita/edit/${berita.id_berita}`)}
                                                            >
                                                                <Pen className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setSelectedBerita(berita)
                                                                    setShowDeleteDialog(true)
                                                                }}
                                                                className="text-destructive"
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" /> Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuItem onClick={() => onViewDetail(berita)}>
                                                <Eye className="mr-2 h-4 w-4" /> Lihat detail
                                            </ContextMenuItem>
                                            <ContextMenuItem
                                                onClick={() => router.push(`/admin/berita/edit/${berita.id_berita}`)}
                                            >
                                                <Pen className="mr-2 h-4 w-4" /> Edit
                                            </ContextMenuItem>
                                            <ContextMenuItem
                                                onClick={() => {
                                                    setSelectedBerita(berita)
                                                    setShowDeleteDialog(true)
                                                }}
                                                className="text-destructive"
                                            >
                                                <Trash className="mr-2 h-4 w-4" /> Hapus
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
            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                    setPageSize(size)
                    setCurrentPage(1)
                }}
                canPreviousPage={currentPage > 1}
                canNextPage={currentPage < totalPages}
            />

            {/* Dialog Konfirmasi Hapus */}
            <DeleteConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleDelete}
                title="Konfirmasi Hapus Berita"
                description={`Apakah Anda yakin ingin menghapus berita "${selectedBerita?.judul_berita}"? Aksi ini tidak dapat dibatalkan.`}
                loading={isDeleting}
            />
        </div>
    )
}
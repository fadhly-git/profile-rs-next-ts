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
import { ArrowUpDown, Plus } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { SearchInput } from "@/components/molecules/search-input"
import { ColumnVisibilityDropdown } from "@/components/molecules/column-visibility-dropdown"
import { TablePagination } from "@/components/molecules/TablePagination"
import { TableActionsMenu } from "@/components/molecules/table-actions-menu"
import { HeroDetailDialog } from "@/components/hero-section/hero-detail-dialog"
import { DeleteConfirmDialog } from "@/components/molecules/delete-confirm-dialog"
import { TextTruncate } from "@/components/atoms/text-truncate"
import { StatusBadge } from "../ui/badge-status" 

import { deleteHeroSectionAction } from "@/lib/actions/hero-section"
import type { HeroSection } from '@/types'

interface HeroDataTableProps {
  data: HeroSection[]
}

export function HeroDataTable({ data }: HeroDataTableProps) {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          <TextTruncate 
            text={row.original.headline} 
            maxLength={50}
            className="block"
          />
        </div>
      ),
    },
    {
      accessorKey: "subheading",
      header: "Subheading",
      enableSorting: true,
      size: 200,
      cell: ({ row }) => (
        <div className="max-w-[200px] text-muted-foreground text-sm">
          {row.original.subheading ? (
            <TextTruncate text={row.original.subheading} maxLength={40} />
          ) : (
            '-'
          )}
        </div>
      ),
    },
    {
      accessorKey: "background_image",
      header: "Latar",
      size: 120,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.background_image ? (
            <div className="flex items-center justify-center">
              <Image
                src={row.original.background_image}
                alt="Latar belakang"
                width={48}
                height={32}
                className="h-8 w-12 object-cover rounded border"
              />
            </div>
          ) : (
            <span className="text-muted-foreground text-xs">Tidak ada gambar</span>
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
          <StatusBadge text={row.original.cta_button_text_1 ? row.original.cta_button_text_1 : '-'} />
        </div>
      ),
    },
    {
      accessorKey: "cta_button_text_2",
      header: "CTA 2",
      size: 120,
      cell: ({ row }) => (
        <div className="text-center">
          <StatusBadge text={row.original.cta_button_text_2 ? row.original.cta_button_text_2 : '-'} />
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
      header: "Diperbarui",
      enableSorting: true,
      size: 120,
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground">
          {row.original.updatedAt?.toLocaleDateString('id-ID')}
        </div>
      ),
    },
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
        <Button 
          onClick={() => router.push('/admin/hero-section-or-banner/create')} 
          className="gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span className="sm:inline">Tambah Hero Section</span>
        </Button>
      </div>

      {/* Filter and Column Visibility Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchInput
          placeholder="Cari headline..."
          value={(table.getColumn("headline")?.getFilterValue() as string) ?? ""}
          onChange={(value) => table.getColumn("headline")?.setFilterValue(value)}
        />
        <ColumnVisibilityDropdown table={table} />
      </div>

      {/* Table Container */}
      <div className="rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap px-2 sm:px-4 py-3 text-xs font-medium uppercase tracking-wider"
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
                  <TableActionsMenu
                    key={row.id}
                    onView={() => {
                      setSelectedDetail(row.original)
                      setOpenDetail(true)
                    }}
                    onEdit={() => {
                      router.push(`/admin/hero-section-or-banner/edit/${row.original.id}`)
                    }}
                    onDelete={() => {
                      setSelectedHero(row.original)
                      setShowDeleteDialog(true)
                    }}
                  >
                    <TableRow className="hover:bg-muted/50 cursor-pointer transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <TableCell
                          key={cell.id}
                          className="px-2 sm:px-4 py-3 text-sm"
                          style={{ width: cell.column.getSize() }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableActionsMenu>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

    {/* Pagination */}
    <TablePagination 
      currentPage={table.getState().pagination.pageIndex + 1}
      totalPages={table.getPageCount()}
      pageSize={table.getState().pagination.pageSize}
      totalItems={table.getFilteredRowModel().rows.length}
      onPageChange={(page) => table.setPageIndex(page - 1)}
      onPageSizeChange={(size) => table.setPageSize(size)}
      canPreviousPage={table.getCanPreviousPage()}
      canNextPage={table.getCanNextPage()}
    />

    {/* Detail Dialog */}
      <HeroDetailDialog
        hero={selectedDetail}
        open={openDetail}
        onOpenChange={setOpenDetail}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Hapus Hero Section"
        description={`Tindakan ini tidak dapat dibatalkan. Hero section "${selectedHero?.headline}" akan dihapus secara permanen dari sistem.`}
        loading={isDeleting}
      />
    </div>
  )
}
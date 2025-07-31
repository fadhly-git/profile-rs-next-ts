"use client"

import * as React from "react";
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
} from "@tanstack/react-table";
import {
    ArrowUpDown,
    MoreHorizontal,
    Eye,
    Mail,
    Calendar,
    Copy,
    FileText,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ExternalLink,
    SortAsc,
    SortDesc
} from "lucide-react";

import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { type KritikSaran } from '@/types';

// Import komponen terpisah
import { StatsCards } from './stats-card';
import { TableFilters } from './TableFilters';
import { DetailDialog } from './DetailDialog';
import { ExportDialog } from './export-dialog';

// Import utility functions
import { exportToCSV, exportToJSON, exportToExcel } from '@/utils/exportUtils';
import { MoreVertical } from "lucide-react";

// Mobile Table Component
const MobileTableCard = ({ item, onViewDetail }: { item: KritikSaran, onViewDetail: () => void }) => {
    const hasKritik = item.kritik && item.kritik.trim().length > 0;
    const hasSaran = item.saran && item.saran.trim().length > 0;

    return (
        <Card className="mb-4 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm truncate">{item.nama}</h3>
                            <div className="flex gap-1 flex-shrink-0">
                                {hasKritik && (
                                    <Badge variant="destructive" className="text-xs px-1.5 py-0.5 h-5">
                                        K
                                    </Badge>
                                )}
                                {hasSaran && (
                                    <Badge variant="default" className="text-xs px-1.5 py-0.5 h-5 bg-green-600">
                                        S
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                            {item.email || "No email"}
                        </p>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={onViewDetail}>
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Detail
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                            {item.perawatan_terakait}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {item.nama_poli}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            {new Date(item.createdAt).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onViewDetail}
                            className="h-6 px-2 text-xs"
                        >
                            Lihat Detail
                        </Button>
                    </div>

                    {/* Preview kritik/saran di mobile */}
                    {(item.kritik || item.saran) && (
                        <div className="pt-2 border-t">
                            {item.kritik && (
                                <p className="text-xs text-red-600 line-clamp-2 mb-1">
                                    <span className="font-medium">Kritik: </span>
                                    {item.kritik}
                                </p>
                            )}
                            {item.saran && (
                                <p className="text-xs text-green-600 line-clamp-2">
                                    <span className="font-medium">Saran: </span>
                                    {item.saran}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

interface DataTableProps {
    data: KritikSaran[];
    onRefresh?: () => void;
    onExport?: (selectedIds: string[]) => void;
    onDelete?: (selectedIds: string[]) => void;
    onReply?: (email: string, subject: string, message: string) => void;
}

export function DataTable({
    data,
    onRefresh,
    onExport,
    onDelete,
}: DataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: "createdAt", desc: true }
    ]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        alamat: false,
        telepon: false,
        nama_kmr_no_kmr: false,
        kritik: false,
        saran: false,
    });
    const [rowSelection, setRowSelection] = React.useState({});
    const [openDetail, setOpenDetail] = React.useState(false);
    const [selectedDetail, setSelectedDetail] = React.useState<KritikSaran | null>(null);
    const [filterByDate, setFilterByDate] = React.useState<string>("all");
    const [filterByService, setFilterByService] = React.useState<string>("all");
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [showExportDialog, setShowExportDialog] = React.useState(false);

    // Get unique services for filter
    const uniqueServices = React.useMemo(() => {
        const services = Array.from(new Set(data.map(item => item.perawatan_terakait)));
        return services.filter(Boolean);
    }, [data]);

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
                    aria-label="Pilih semua"
                    className="border-2"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Pilih baris"
                    className="border-2"
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
                    className="h-8 px-2 font-semibold text-xs uppercase tracking-wider "
                >
                    Pengirim
                    {column.getIsSorted() === "asc" ? (
                        <SortAsc className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <SortDesc className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                    )}
                </Button>
            ),
            cell: ({ row }) => {
                const hasKritik = row.original.kritik && row.original.kritik.trim().length > 0;
                const hasSaran = row.original.saran && row.original.saran.trim().length > 0;

                return (
                    <div className="flex flex-col min-w-[180px] space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                                {row.getValue("nama")}
                            </span>
                            <div className="flex gap-1">
                                {hasKritik && (
                                    <Badge variant="destructive" className="text-xs px-1.5 py-0.5 h-5">
                                        K
                                    </Badge>
                                )}
                                {hasSaran && (
                                    <Badge variant="default" className="text-xs px-1.5 py-0.5 h-5 bg-green-600">
                                        S
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[140px]">
                                {row.original.email || "-"}
                            </span>
                        </div>
                    </div>
                );
            },
            enableHiding: false,
            size: 200,
        },
        {
            accessorKey: "perawatan_terakait",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2 font-semibold text-xs uppercase tracking-wider hover:bg-neutral-100"
                >
                    Layanan
                    {column.getIsSorted() === "asc" ? (
                        <SortAsc className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <SortDesc className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                    )}
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex flex-col gap-1 min-w-[120px]">
                    <Badge variant="secondary" className="text-xs px-2 py-1 font-medium">
                        {row.getValue("perawatan_terakait")}
                    </Badge>
                    <Badge variant="outline" className="text-xs px-2 py-0.5 text-muted-foreground">
                        {row.original.nama_poli}
                    </Badge>
                </div>
            ),
            size: 140,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2 font-semibold text-xs uppercase tracking-wider"
                >
                    <Calendar className="mr-1 h-4 w-4" />
                    Tanggal
                    {column.getIsSorted() === "asc" ? (
                        <SortAsc className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <SortDesc className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                    )}
                </Button>
            ),
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt") as Date | string);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - date.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                return (
                    <div className="flex flex-col gap-1 min-w-[100px]">
                        <span className="text-sm font-medium">
                            {date.toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short'
                            })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {diffDays === 1 ? 'Hari ini' :
                                diffDays === 2 ? 'Kemarin' :
                                    `${diffDays - 1} hari lalu`}
                        </span>
                    </div>
                );
            },
            filterFn: (row, columnId, filterValue) => {
                if (!filterValue) return true;
                const rowDate = new Date(row.getValue(columnId) as Date | string);
                const startDate = filterValue as Date;
                return rowDate >= startDate;
            },
            size: 120,
        },
        {
            id: "actions",
            header: () => (
                <div className="text-center font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                    Aksi
                </div>
            ),
            enableHiding: false,
            cell: ({ row }) => {
                const kritik = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 data-[state=open]:bg-muted"
                            >
                                <span className="sr-only">Buka menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="font-semibold">Opsi Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedDetail(kritik);
                                    setOpenDetail(true);
                                }}
                                className="cursor-pointer"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Detail Lengkap
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        JSON.stringify(kritik, (key, value) =>
                                            typeof value === 'bigint' ? value.toString() : value, 2
                                        )
                                    );
                                    toast("Data kritik & saran telah disalin ke clipboard");
                                }}
                                className="cursor-pointer"
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Salin Data
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            size: 70,
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
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 15,
            },
        },
        globalFilterFn: (row, columnId, filterValue) => {
            const searchValue = filterValue.toLowerCase();
            const nama = row.original.nama?.toLowerCase() || '';
            const email = row.original.email?.toLowerCase() || '';
            const kritik = row.original.kritik?.toLowerCase() || '';
            const saran = row.original.saran?.toLowerCase() || '';

            return nama.includes(searchValue) ||
                email.includes(searchValue) ||
                kritik.includes(searchValue) ||
                saran.includes(searchValue);
        },
    });

    // Filter functions
    React.useEffect(() => {
        const filters: ColumnFiltersState = [];

        if (filterByService !== "all") {
            filters.push({
                id: "perawatan_terakait",
                value: filterByService,
            });
        }

        if (filterByDate !== "all") {
            const now = new Date();
            let startDate: Date;

            switch (filterByDate) {
                case "today":
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case "week":
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case "month":
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startDate = new Date(0);
            }

            filters.push({
                id: "createdAt",
                value: startDate,
            });
        }

        setColumnFilters(filters);
    }, [filterByDate, filterByService]);

    // Update handleExport function
    const handleExport = async (format: 'csv' | 'json' | 'excel') => {
        try {
            const selectedRows = table.getFilteredSelectedRowModel().rows;
            const selectedData = selectedRows.map(row => row.original);

            switch (format) {
                case 'csv':
                    exportToCSV(selectedData.length > 0 ? selectedData : data);
                    break;
                case 'json':
                    exportToJSON(selectedData.length > 0 ? selectedData : data);
                    break;
                case 'excel':
                    await exportToExcel(selectedData.length > 0 ? selectedData : data);
                    break;
            }

            if (onExport) {
                const selectedIds = selectedData.map(item => String(item.id));
                onExport(selectedIds);
            }

            toast.success(
                <>
                    <span className="font-semibold">Export berhasil</span>
                    <br />
                    {selectedData.length || data.length} data kritik & saran telah diekspor
                </>
            );
        } catch (error) {
            toast.error(
                <>
                    <span className="font-semibold">Export gagal</span>
                    <br />
                    {error instanceof Error ? error.message : 'Terjadi kesalahan saat mengekspor data'}
                </>
            );
        }
    };

    const handleDelete = () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const selectedIds = selectedRows.map(row => String(row.original.id));
        if (onDelete) {
            onDelete(selectedIds);
        }
        setRowSelection({});
        toast(
            <>
                <span className="font-semibold">Data dihapus</span>
                <br />
                {selectedIds.length} data kritik & saran telah dihapus
            </>
        );
    };

    return (
        <div className="w-full space-y-4 sm:space-y-6 min-h-screen p-3 sm:p-6">
            {/* Stats Cards */}
            <StatsCards data={data} />

            {/* Filters and Controls */}
            <TableFilters
                table={table}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                filterByDate={filterByDate}
                setFilterByDate={setFilterByDate}
                filterByService={filterByService}
                setFilterByService={setFilterByService}
                uniqueServices={uniqueServices}
                onRefresh={onRefresh}
                onExport={() => setShowExportDialog(true)} // Update ini
                onDelete={handleDelete}
            />

            <div className="block sm:hidden">
                <Card className="shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-sm">
                                Data Kritik & Saran ({table.getFilteredRowModel().rows.length})
                            </h3>
                            <Select
                                value={String(table.getState().pagination.pageSize)}
                                onValueChange={value => table.setPageSize(Number(value))}
                            >
                                <SelectTrigger className="w-20 h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 15, 20, 30].map(pageSize => (
                                        <SelectItem key={pageSize} value={String(pageSize)}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {table.getRowModel().rows?.length ? (
                            <div className="space-y-3">
                                {table.getRowModel().rows.map((row) => (
                                    <MobileTableCard
                                        key={row.id}
                                        item={row.original}
                                        onViewDetail={() => {
                                            setSelectedDetail(row.original);
                                            setOpenDetail(true);
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                                <div className="rounded-full bg-gray-100 p-4">
                                    <FileText className="h-12 w-12 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Belum Ada Data</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Belum ada kritik atau saran yang masuk.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Mobile Pagination */}
                        <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>
                                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                                    {Math.min(
                                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                        table.getFilteredRowModel().rows.length
                                    )} dari {table.getFilteredRowModel().rows.length}
                                </span>
                                <span>
                                    Hal {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
                                </span>
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="px-3 h-8"
                                >
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="px-3 h-8"
                                >
                                    Selanjutnya
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                    disabled={!table.getCanNextPage()}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Desktop Table - Hidden on mobile */}
            <div className="hidden sm:block">
                <Card className="shadow-sm">
                    <div className="overflow-hidden">
                        <Card className="shadow-sm">
                            <div className="overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id} className="border-b-2">
                                                {headerGroup.headers.map((header) => (
                                                    <TableHead
                                                        key={header.id}
                                                        className="px-4 py-4 text-left font-bold"
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
                                    <TableBody className="">
                                        {table.getRowModel().rows?.length ? (
                                            table.getRowModel().rows.map((row, index) => (
                                                <ContextMenu key={row.id + index}>
                                                    <ContextMenuTrigger asChild>
                                                        <TableRow
                                                            data-state={row.getIsSelected() && "selected"}
                                                            className={`
                                                    cursor-pointer transition-all duration-200 
                                                    hover:shadow-sm
                                                `}
                                                        >
                                                            {row.getVisibleCells().map((cell) => (
                                                                <TableCell
                                                                    key={cell.id}
                                                                    className="px-4 py-4"
                                                                    style={{ width: cell.column.getSize() }}
                                                                >
                                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    </ContextMenuTrigger>
                                                    <ContextMenuContent className="w-64">
                                                        <ContextMenuLabel>Aksi Cepat</ContextMenuLabel>
                                                        <ContextMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigator.clipboard.writeText(String(row.original.id));
                                                                toast(
                                                                    <>
                                                                        <span className="font-semibold">ID disalin</span>
                                                                        <br />
                                                                        ID data telah disalin ke clipboard
                                                                    </>
                                                                );
                                                            }}
                                                        >
                                                            <Copy className="mr-2 h-4 w-4" />
                                                            Salin ID
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
                                                            Lihat Detail
                                                        </ContextMenuItem>
                                                        <ContextMenuSeparator />
                                                        <ContextMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (row.original.email) {
                                                                    window.open(`mailto:${row.original.email}`, '_blank');
                                                                }
                                                            }}
                                                            disabled={!row.original.email}
                                                        >
                                                            <ExternalLink className="mr-2 h-4 w-4" />
                                                            Buka Email Client
                                                        </ContextMenuItem>
                                                    </ContextMenuContent>
                                                </ContextMenu>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={columns.length}
                                                    className="h-32 text-center"
                                                >
                                                    <div className="flex flex-col items-center justify-center gap-4 p-8">
                                                        <div className="rounded-full bg-gray-100 p-4">
                                                            <FileText className="h-12 w-12 text-gray-400" />
                                                        </div>
                                                        <div className="text-center">
                                                            <h3 className="text-lg font-semibold">
                                                                Belum Ada Data
                                                            </h3>
                                                            <p className="text-sm mt-1">
                                                                Belum ada kritik atau saran yang masuk. Data akan muncul di sini setelah ada yang mengirim.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>
                </Card>

                {/* Desktop Pagination */}
                <Card className="shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <span>Tampilkan</span>
                                    <Select
                                        value={String(table.getState().pagination.pageSize)}
                                        onValueChange={value => table.setPageSize(Number(value))}
                                    >
                                        <SelectTrigger className="w-[70px] h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[10, 15, 20, 30, 50].map(pageSize => (
                                                <SelectItem key={pageSize} value={String(pageSize)}>
                                                    {pageSize}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <span>dari {table.getFilteredRowModel().rows.length} entri</span>
                                </div>
                                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Separator orientation="vertical" className="h-4" />
                                        <Badge variant="outline" className="text-xs">
                                            {table.getFilteredSelectedRowModel().rows.length} dipilih
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-sm text-muted-foreground">
                                    Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => table.setPageIndex(0)}
                                        disabled={!table.getCanPreviousPage()}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                        disabled={!table.getCanNextPage()}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detail Dialog */}
            <DetailDialog
                open={openDetail}
                onOpenChange={setOpenDetail}
                selectedDetail={selectedDetail}
            />

            <ExportDialog
                open={showExportDialog}
                onOpenChange={setShowExportDialog}
                selectedData={table.getFilteredSelectedRowModel().rows.map(row => row.original)}
                allData={data}
                onExport={handleExport}
            />
        </div>
    );
}
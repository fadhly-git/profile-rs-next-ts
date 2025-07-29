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
    ChevronDown,
    MoreHorizontal,
    Eye,
    Mail,
    Phone,
    Calendar,
    Search,
    Download,
    Trash,
    Copy,
    User,
    Building,
    MessageCircle,
    Lightbulb,
    CalendarClock,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    RefreshCw,
    FileText,
    AlertCircle,
    CheckCircle2,
    ExternalLink,
    Settings,
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
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { type KritikSaran } from '@/types';

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
        { id: "createdAt", desc: true } // Default sort by newest
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

    // Stats calculations
    const stats = React.useMemo(() => {
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        return {
            total: data.length,
            thisWeek: data.filter(item => new Date(item.createdAt) >= oneWeekAgo).length,
            thisMonth: data.filter(item => new Date(item.createdAt) >= oneMonthAgo).length,
            withCritik: data.filter(item => item.kritik && item.kritik.trim().length > 0).length,
            withSaran: data.filter(item => item.saran && item.saran.trim().length > 0).length,
        };
    }, [data]);

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
            // Tambahkan filterFn khusus untuk tanggal
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
                                        JSON.stringify(selectedDetail, (key, value) =>
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

        // Perbaikan untuk filter tanggal
        if (filterByDate !== "all") {
            const now = new Date();
            let startDate: Date;

            switch (filterByDate) {
                case "today":
                    // Set ke awal hari ini (00:00:00)
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case "week":
                    // 7 hari terakhir
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case "month":
                    // 30 hari terakhir
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startDate = new Date(0);
            }

            // Gunakan filterFn yang benar untuk tanggal
            filters.push({
                id: "createdAt",
                value: startDate,
            });
        }

        setColumnFilters(filters);
    }, [filterByDate, filterByService]);

    const handleExport = () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const selectedIds = selectedRows.map(row => String(row.original.id));
        if (onExport) {
            onExport(selectedIds);
        }
        toast(
            <>
                <span className="font-semibold">Export dimulai</span>
                <br />
                Mengekspor {selectedIds.length} data kritik & saran
            </>
        );
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
        <div className="w-full space-y-6 min-h-screen p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                            </div>
                            <FileText className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Minggu Ini</p>
                                <p className="text-2xl font-bold text-green-600">{stats.thisWeek}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Bulan Ini</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.thisMonth}</p>
                            </div>
                            <CalendarClock className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Ada Kritik</p>
                                <p className="text-2xl font-bold text-red-600">{stats.withCritik}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Ada Saran</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.withSaran}</p>
                            </div>
                            <Lightbulb className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Controls */}
            <Card className="shadow-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama, email, kritik, atau saran..."
                                    value={globalFilter ?? ""}
                                    onChange={(event) => setGlobalFilter(event.target.value)}
                                    className="pl-10 w-full sm:w-[300px] h-10"
                                />
                            </div>

                            <Select value={filterByDate} onValueChange={setFilterByDate}>
                                <SelectTrigger className="w-[140px] h-10">
                                    <SelectValue placeholder="Periode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Periode</SelectItem>
                                    <SelectItem value="today">Hari Ini</SelectItem>
                                    <SelectItem value="week">7 Hari Terakhir</SelectItem>
                                    <SelectItem value="month">30 Hari Terakhir</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filterByService} onValueChange={setFilterByService}>
                                <SelectTrigger className="w-[160px] h-10">
                                    <SelectValue placeholder="Layanan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Layanan</SelectItem>
                                    {uniqueServices.map((service) => (
                                        <SelectItem key={service} value={service}>
                                            {service}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2 w-full lg:w-auto justify-between lg:justify-normal">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setGlobalFilter("");
                                    setFilterByDate("all");
                                    setFilterByService("all");
                                    setRowSelection({});
                                }}
                                className="h-10"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reset
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-10">
                                        <Settings className="h-4 w-4 mr-2" />
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
                                                nama: "Pengirim",
                                                email: "Email",
                                                alamat: "Alamat",
                                                telepon: "Telepon",
                                                perawatan_terakait: "Layanan",
                                                nama_poli: "Unit/Poli",
                                                nama_kmr_no_kmr: "Kamar",
                                                kritik: "Isi Kritik",
                                                saran: "Isi Saran",
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

                            {onRefresh && (
                                <Button
                                    variant="outline"
                                    onClick={onRefresh}
                                    className="h-10"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Selected Actions */}
                    {table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <div className="flex items-center gap-3 mt-4 p-3 border rounded-lg">
                            <Badge variant="secondary" className="font-medium">
                                {table.getFilteredSelectedRowModel().rows.length} item dipilih
                            </Badge>
                            <Separator orientation="vertical" className="h-5" />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExport}
                                className="h-8"
                            >
                                <Download className="h-4 w-4 mr-1" />
                                Ekspor
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDelete}
                                className="h-8"
                            >
                                <Trash className="h-4 w-4 mr-1" />
                                Hapus
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Table */}
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
                                                onClick={() => {
                                                    setSelectedDetail(row.original);
                                                    setOpenDetail(true);
                                                }}
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

            {/* Enhanced Pagination */}
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

            {/* Enhanced Detail Dialog */}
            <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent className="!max-w-6xl w-[95%] min-h-0 p-0">
                    {selectedDetail && (
                        <>
                            <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r">
                                <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                                    <div className="p-2 bg-accent rounded-lg">
                                        <MessageCircle className="h-6 w-6 text-blue-600" />
                                    </div>
                                    Detail Kritik & Saran
                                </DialogTitle>
                                <DialogDescription className="mt-2">
                                    Masukan dari <strong>{selectedDetail.nama}</strong> • {new Date(selectedDetail.createdAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </DialogDescription>
                            </DialogHeader>

                            <ScrollArea className="h-[calc(90vh-12rem)] px-6 py-4">
                                <div className="space-y-4">
                                    {/* Contact & Service Info Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {/* Contact Information */}
                                        <Card className="border-l-4 border-l-blue-500">
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <User className="h-5 w-5 text-blue-600" />
                                                    Informasi Kontak
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <div className="grid grid-cols-1 gap-1">
                                                    <div className="flex items-center gap-2 p-2 rounded-lg">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        <div>
                                                            <Label className="text-xs uppercase tracking-wider">Nama Lengkap</Label>
                                                            <p className="font-semibold">{selectedDetail.nama}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 p-2 rounded-lg">
                                                        <Mail className="h-4 w-4" />
                                                        <div className="flex-1">
                                                            <Label className="text-xs uppercase tracking-wider">Email</Label>
                                                            <p className="font-mono text-sm break-all">{selectedDetail.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 p-2 rounded-lg">
                                                        <Phone className="h-4 w-4" />
                                                        <div>
                                                            <Label className="text-xs uppercase tracking-wider">Telepon</Label>
                                                            <p className="font-mono text-sm">
                                                                {selectedDetail.telepon || '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2 p-2 rounded-lg">
                                                        <Building className="h-4 w-4 mt-0.5" />
                                                        <div>
                                                            <Label className="text-xs uppercase tracking-wider">Alamat</Label>
                                                            <p className="text-sm leading-relaxed">
                                                                {selectedDetail.alamat || '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Service Information */}
                                        <Card className="border-l-4 border-l-green-500">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Building className="h-5 w-5 text-green-600" />
                                                    Informasi Layanan
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <div className="grid grid-cols-1 gap-1">
                                                    <div className="p-2 rounded-lg">
                                                        <Label className="text-xs uppercase tracking-wider">Jenis Perawatan</Label>
                                                        <div className="mt-2">
                                                            <Badge className="bg-green-100 text-green-800 border-green-300">
                                                                {selectedDetail.perawatan_terakait}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="p-2 rounded-lg">
                                                        <Label className="text-xs uppercase tracking-wider">Unit/Poli</Label>
                                                        <div className="mt-2">
                                                            <Badge variant="outline" className="border-gray-300">
                                                                {selectedDetail.nama_poli}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="p-2 rounded-lg">
                                                        <Label className="text-xs uppercase tracking-wider">Ruang/Kamar</Label>
                                                        <div className="mt-2">
                                                            {selectedDetail.nama_kmr_no_kmr ? (
                                                                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                                                                    {selectedDetail.nama_kmr_no_kmr}
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-sm">Tidak disebutkan</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="p-2 rounded-lg">
                                                        <Label className="text-xs uppercase tracking-wider">Waktu Pengiriman</Label>
                                                        <div className="mt-1 flex items-center gap-2">
                                                            <CalendarClock className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm">
                                                                {new Date(selectedDetail.createdAt).toLocaleDateString('id-ID', {
                                                                    weekday: 'long',
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Feedback Content */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Kritik */}
                                        <Card className="border-l-4 border-l-red-500">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                                                    <AlertCircle className="h-5 w-5" />
                                                    Kritik & Keluhan
                                                </CardTitle>
                                                <CardDescription className="text-red-600">
                                                    Masukan negatif yang perlu ditindaklanjuti
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="pt-4">
                                                <div className="border border-accent rounded-lg p-4">
                                                    <div className="prose prose-red max-w-none">
                                                        <p className="text-sm text-red-800 whitespace-pre-line leading-relaxed">
                                                            {selectedDetail.kritik || (
                                                                <span className="text-red-500 italic">
                                                                    Tidak ada kritik yang disampaikan
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Saran */}
                                        <Card className="border-l-4 border-l-green-500">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                                                    <Lightbulb className="h-5 w-5" />
                                                    Saran & Masukan
                                                </CardTitle>
                                                <CardDescription className="text-green-600">
                                                    Usulan perbaikan untuk layanan yang lebih baik
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="pt-4">
                                                <div className="border border-accent rounded-lg p-4">
                                                    <div className="prose prose-green max-w-none">
                                                        <p className="text-sm text-green-800 whitespace-pre-line leading-relaxed">
                                                            {selectedDetail.saran || (
                                                                <span className="text-green-500 italic">
                                                                    Tidak ada saran yang disampaikan
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </ScrollArea>

                            <DialogFooter className="px-6 py-4 border-t">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>ID: {selectedDetail.id}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    JSON.stringify(selectedDetail, (key, value) =>
                                                        typeof value === 'bigint' ? value.toString() : value, 2
                                                    )
                                                );
                                                toast(
                                                    <>
                                                        <span className="font-semibold">Data disalin</span>
                                                        <br />
                                                        Detail lengkap telah disalin ke clipboard
                                                    </>
                                                );
                                            }}
                                        >
                                            <Copy className="h-4 w-4 mr-2" />
                                            Salin Data
                                        </Button>
                                    </div>
                                </div>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Reply Dialog */}

        </div>
    );
}
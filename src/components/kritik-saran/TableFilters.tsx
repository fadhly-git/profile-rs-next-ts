"use client"

import * as React from "react";
import { Search, RefreshCw, Settings, ChevronDown, Download, Trash, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type Table } from "@tanstack/react-table";
import { type KritikSaran } from '@/types';

interface TableFiltersProps {
    table: Table<KritikSaran>;
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    filterByDate: string;
    setFilterByDate: (value: string) => void;
    filterByService: string;
    setFilterByService: (value: string) => void;
    uniqueServices: string[];
    onRefresh?: () => void;
    onExport: () => void;
    onDelete: () => void;
}

export function TableFilters({
    table,
    globalFilter,
    setGlobalFilter,
    filterByDate,
    setFilterByDate,
    filterByService,
    setFilterByService,
    uniqueServices,
    onRefresh,
    onExport,
    onDelete,
}: TableFiltersProps) {
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);

    const handleReset = () => {
        setGlobalFilter("");
        setFilterByDate("all");
        setFilterByService("all");
        table.setRowSelection({});
    };

    // Mobile Filter Component
    const MobileFilters = () => (
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                    <SheetTitle>Filter & Pengaturan</SheetTitle>
                    <SheetDescription>
                        Atur filter dan tampilan data kritik & saran
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 mt-6">
                    {/* Search */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Pencarian</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama, email, kritik, atau saran..."
                                value={globalFilter ?? ""}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Date Filter */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Periode Waktu</label>
                        <Select value={filterByDate} onValueChange={setFilterByDate}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih periode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Periode</SelectItem>
                                <SelectItem value="today">Hari Ini</SelectItem>
                                <SelectItem value="week">7 Hari Terakhir</SelectItem>
                                <SelectItem value="month">30 Hari Terakhir</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Service Filter */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Layanan</label>
                        <Select value={filterByService} onValueChange={setFilterByService}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih layanan" />
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

                    {/* Column Visibility */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Tampilkan Kolom</label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
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
                                        <div key={column.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={column.id}
                                                checked={column.getIsVisible()}
                                                onChange={(e) => column.toggleVisibility(e.target.checked)}
                                                className="rounded"
                                            />
                                            <label htmlFor={column.id} className="text-sm">
                                                {headerLabels[column.id] || column.id}
                                            </label>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            className="w-full"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset Filter
                        </Button>

                        {onRefresh && (
                            <Button
                                variant="outline"
                                onClick={onRefresh}
                                className="w-full"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh Data
                            </Button>
                        )}

                        <Button
                            onClick={() => {
                                setIsFilterOpen(false);
                            }}
                            className="w-full"
                        >
                            Terapkan Filter
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );

    return (
        <Card className="shadow-sm">
            <CardContent className="p-4 sm:p-6">
                {/* Mobile Layout */}
                <div className="lg:hidden space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari..."
                            value={globalFilter ?? ""}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <MobileFilters />

                        <Select value={filterByDate} onValueChange={setFilterByDate}>
                            <SelectTrigger className="w-32 flex-shrink-0">
                                <SelectValue placeholder="Periode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="today">Hari Ini</SelectItem>
                                <SelectItem value="week">7 Hari</SelectItem>
                                <SelectItem value="month">30 Hari</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            className="flex-shrink-0"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Active Filters Display */}
                    {(filterByDate !== "all" || filterByService !== "all" || globalFilter) && (
                        <div className="flex flex-wrap gap-2">
                            {globalFilter && (
                                <Badge variant="secondary" className="text-xs">
                                    Pencarian: {globalFilter}
                                </Badge>
                            )}
                            {filterByDate !== "all" && (
                                <Badge variant="secondary" className="text-xs">
                                    {filterByDate === "today" ? "Hari Ini" :
                                        filterByDate === "week" ? "7 Hari" : "30 Hari"}
                                </Badge>
                            )}
                            {filterByService !== "all" && (
                                <Badge variant="secondary" className="text-xs">
                                    {filterByService}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
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
                            onClick={handleReset}
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

                {/* Selected Actions - Mobile & Desktop */}
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4 p-3 border rounded-lg">
                        <Badge variant="secondary" className="font-medium">
                            {table.getFilteredSelectedRowModel().rows.length} item dipilih
                        </Badge>
                        <Separator orientation="vertical" className="hidden sm:block h-5" />
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onExport}
                                className="flex-1 sm:flex-initial h-8"
                            >
                                <Download className="h-4 w-4 mr-1" />
                                Ekspor
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={onDelete}
                                className="flex-1 sm:flex-initial h-8"
                            >
                                <Trash className="h-4 w-4 mr-1" />
                                Hapus
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
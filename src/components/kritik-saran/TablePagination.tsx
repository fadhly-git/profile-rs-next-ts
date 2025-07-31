import React from "react";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table } from "@tanstack/react-table";

interface TablePaginationProps<T> {
    table: Table<T>;
}

export function TablePagination<T>({ table }: TablePaginationProps<T>) {
    return (
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
    );
}
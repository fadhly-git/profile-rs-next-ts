// components/user-management/data-table.tsx
"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    Plus,
    Eye,
    Edit,
    Trash2,
    RotateCcw,
} from "lucide-react"
import { UserTableData } from "@/types/user"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    showDeleted: boolean
    onShowDeletedChange: (checked: boolean) => void
    onEdit: (user: UserTableData) => void
    onDelete: (userId: string) => void
    onRestore: (userId: string) => void
    onPermanentDelete: (userId: string) => void
    onViewDetails: (user: UserTableData) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    showDeleted,
    onShowDeletedChange,
    onEdit,
    onDelete,
    onRestore,
    onPermanentDelete,
    onViewDetails,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        meta: {
            // Pass the handler functions to be accessible in columns
            onEdit,
            onDelete,
            onRestore,
            onPermanentDelete,
            onViewDetails,
        }
    })

    // Handler untuk tombol Add User
    const handleAddUser = () => {
        // Panggil onEdit dengan user kosong untuk mode create
        onEdit({
            id: '',
            name: '',
            email: '',
            role: 'USER',
            gambar: null,
            status: 'active',
            createdAt: null,
            email_verified_at: null,
            deleted_at: null,
            updatedAt: null,
        } as UserTableData)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 w-full">
                    <Input
                        placeholder="Filter emails..."
                        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("email")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="show-deleted"
                            checked={showDeleted}
                            onCheckedChange={onShowDeletedChange}
                        />
                        <Label htmlFor="show-deleted">Show deleted users</Label>
                    </div>
                </div>
                {!showDeleted && (
                    <Button onClick={handleAddUser}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                )}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const user = row.original as UserTableData
                                const isDeleted = !!user.deleted_at

                                return (
                                    <ContextMenu key={row.id}>
                                        <ContextMenuTrigger asChild>
                                            <TableRow
                                                data-state={row.getIsSelected() && "selected"}
                                                className={
                                                    isDeleted
                                                        ? "opacity-60 bg-muted/20 cursor-context-menu"
                                                        : "cursor-context-menu"
                                                }
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent className="w-48">
                                            <ContextMenuItem
                                                onClick={() => onViewDetails(user)}
                                                className="cursor-pointer"
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </ContextMenuItem>

                                            {!isDeleted ? (
                                                <>
                                                    <ContextMenuItem
                                                        onClick={() => onEdit(user)}
                                                        className="cursor-pointer"
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit User
                                                    </ContextMenuItem>
                                                    <ContextMenuSeparator />
                                                    <ContextMenuItem
                                                        onClick={() => onDelete(user.id)}
                                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete User
                                                    </ContextMenuItem>
                                                </>
                                            ) : (
                                                <>
                                                    <ContextMenuSeparator />
                                                    <ContextMenuItem
                                                        onClick={() => onRestore(user.id)}
                                                        className="cursor-pointer text-green-600 focus:text-green-600"
                                                    >
                                                        <RotateCcw className="mr-2 h-4 w-4" />
                                                        Restore User
                                                    </ContextMenuItem>
                                                    <ContextMenuItem
                                                        onClick={() => onPermanentDelete(user.id)}
                                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Permanent Delete
                                                    </ContextMenuItem>
                                                </>
                                            )}
                                        </ContextMenuContent>
                                    </ContextMenu>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {showDeleted
                                        ? "No deleted users found."
                                        : "No users found."
                                    }
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                    Showing {table.getFilteredRowModel().rows.length} of{" "}
                    {data.length} user(s)
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
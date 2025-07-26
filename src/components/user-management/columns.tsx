// components/user-management/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Edit, Trash2, RotateCcw, UserX } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserTableData } from "@/types/user"
import { formatDate } from "@/lib/utils"

interface ActionsProps {
    user: UserTableData;
    onEdit: (user: UserTableData) => void;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
    onPermanentDelete: (id: string) => void;
}

const ActionsCell = ({ user, onEdit, onDelete, onRestore, onPermanentDelete }: ActionsProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(user)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                {user.status === 'active' ? (
                    <DropdownMenuItem onClick={() => onDelete(user.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                ) : (
                    <>
                        <DropdownMenuItem onClick={() => onRestore(user.id)} className="text-green-600">
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPermanentDelete(user.id)} className="text-red-600">
                            <UserX className="mr-2 h-4 w-4" />
                            Permanent Delete
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const createColumns = (
    onEdit: (user: UserTableData) => void,
    onDelete: (id: string) => void,
    onRestore: (id: string) => void,
    onPermanentDelete: (id: string) => void
): ColumnDef<UserTableData>[] => [
        {
            accessorKey: "gambar",
            header: "Avatar",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.gambar || undefined} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                );
            },
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const role = row.getValue("role") as string;
                const roleColors = {
                    SUPER_ADMIN: "bg-red-500",
                    ADMIN: "bg-blue-500",
                    MODERATOR: "bg-green-500",
                    USER: "bg-gray-500",
                };
                return (
                    <Badge className={roleColors[role as keyof typeof roleColors]}>
                        {role.replace('_', ' ')}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <Badge variant={status === 'active' ? 'default' : 'destructive'}>
                        {status}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => formatDate(row.getValue("createdAt")),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <ActionsCell
                        user={user}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onRestore={onRestore}
                        onPermanentDelete={onPermanentDelete}
                    />
                );
            },
        },
    ];
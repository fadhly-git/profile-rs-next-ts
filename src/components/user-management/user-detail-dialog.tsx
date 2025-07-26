"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserTableData } from "@/types/user"
import { formatDate } from "@/lib/utils"
import { CalendarDays, Mail, Shield, User } from "lucide-react"

interface UserDetailDialogProps {
    user: UserTableData | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UserDetailDialog({ user, open, onOpenChange }: UserDetailDialogProps) {
    if (!user) return null

    const roleColors = {
        SUPER_ADMIN: "bg-red-500",
        ADMIN: "bg-blue-500",
        MODERATOR: "bg-green-500",
        USER: "bg-gray-500",
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Avatar and basic info */}
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.gambar || undefined} alt={user.name} />
                            <AvatarFallback className="text-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold">{user.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                                    {user.role.replace('_', ' ')}
                                </Badge>
                                <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                    {user.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Email</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Role</p>
                                <p className="text-sm text-muted-foreground">
                                    {user.role.replace('_', ' ')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Status</p>
                                <p className="text-sm text-muted-foreground capitalize">
                                    {user.status}
                                </p>
                            </div>
                        </div>

                        {user.createdAt && (
                            <div className="flex items-center space-x-3">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Created At</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(user.createdAt)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {user.email_verified_at && (
                            <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium">Email Verified</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(user.email_verified_at)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
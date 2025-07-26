"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/user-management/data-table"
import { UserForm } from "@/components/user-management/user-form"
import { UserDetailDialog } from "@/components/user-management/user-detail-dialog"
import { createColumns } from "@/components/user-management/columns"
import { UserTableData } from "@/types/user"
import { getUsers, softDeleteUser, restoreUser, permanentDeleteUser } from "@/lib/actions/user-actions"
import { toast } from "sonner"

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

export default function UserManagementPage() {
    const [users, setUsers] = React.useState<UserTableData[]>([])
    const [loading, setLoading] = React.useState(true)
    const [showDeleted, setShowDeleted] = React.useState(false)
    const [selectedUser, setSelectedUser] = React.useState<UserTableData | null>(null)
    const [detailUser, setDetailUser] = React.useState<UserTableData | null>(null)
    const [showForm, setShowForm] = React.useState(false)
    const [showDetail, setShowDetail] = React.useState(false)
    const [deleteDialog, setDeleteDialog] = React.useState<{
        open: boolean
        userId: string
        type: 'soft' | 'permanent'
    }>({ open: false, userId: '', type: 'soft' })

    const loadUsers = React.useCallback(async () => {
        try {
            setLoading(true)
            const userData = await getUsers(showDeleted)
            setUsers(userData)
        } catch (error) {
            console.error('Load users error:', error)
            toast.error("Failed to load users")
        } finally {
            setLoading(false)
        }
    }, [showDeleted])

    React.useEffect(() => {
        loadUsers()
    }, [loadUsers])

    // Check if user can access this page - moved after hooks

    const handleEdit = (user: UserTableData) => {
        setSelectedUser(user)
        setShowForm(true)
    }

    const handleViewDetails = (user: UserTableData) => {
        setDetailUser(user)
        setShowDetail(true)
    }

    const handleDelete = (userId: string) => {
        setDeleteDialog({ open: true, userId, type: 'soft' })
    }

    const handleRestore = async (userId: string) => {
        try {
            await restoreUser(userId)
            await loadUsers()
            toast.success("User restored successfully")
        } catch (error) {
            console.error('Restore user error:', error)
            toast.error("Failed to restore user")
        }
    }

    const handlePermanentDelete = (userId: string) => {
        setDeleteDialog({ open: true, userId, type: 'permanent' })
    }

    const confirmDelete = async () => {
        try {
            if (deleteDialog.type === 'soft') {
                await softDeleteUser(deleteDialog.userId)
                toast.success("User deleted successfully")
            } else {
                await permanentDeleteUser(deleteDialog.userId)
                toast.success("User permanently deleted")
            }
            await loadUsers()
            setDeleteDialog({ open: false, userId: '', type: 'soft' })
        } catch (error) {
            console.error('Delete user error:', error)
            toast.error("Failed to delete user")
        }
    }

    const handleFormSuccess = () => {
        loadUsers()
        setSelectedUser(null)
    }

    const columns = createColumns(
        handleEdit,
        handleDelete,
        handleRestore,
        handlePermanentDelete,
    )

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>
    }



    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
                    <p className="text-muted-foreground">
                        Kelola pengguna aplikasi, tambahkan, edit, hapus, atau pulihkan pengguna sesuai kebutuhan.
                    </p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={users}
                showDeleted={showDeleted}
                onShowDeletedChange={setShowDeleted}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
                onViewDetails={handleViewDetails}
            />

            <UserForm
                user={selectedUser}
                open={showForm}
                onOpenChange={(open) => {
                    setShowForm(open)
                    if (!open) setSelectedUser(null)
                }}
                onSuccess={handleFormSuccess}
            />

            <UserDetailDialog
                user={detailUser}
                open={showDetail}
                onOpenChange={(open) => {
                    setShowDetail(open)
                    if (!open) setDetailUser(null)
                }}
            />

            <AlertDialog open={deleteDialog.open} onOpenChange={(open) =>
                setDeleteDialog({ ...deleteDialog, open })
            }>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {deleteDialog.type === 'soft' ? 'Delete User' : 'Permanently Delete User'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteDialog.type === 'soft'
                                ? 'This user will be moved to deleted users. You can restore them later.'
                                : 'This action cannot be undone. This will permanently delete the user and remove their data from our servers.'
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            {deleteDialog.type === 'soft' ? 'Delete' : 'Permanently Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
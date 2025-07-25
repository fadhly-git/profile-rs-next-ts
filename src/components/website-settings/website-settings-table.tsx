// components/organisms/website-settings-table.tsx
'use client'

import { WebsiteSettings } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MoreHorizontal, Eye, Edit, Trash2, Globe } from 'lucide-react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { deleteWebsiteSettings } from '@/lib/actions/website-settings'
import { toast } from 'sonner'

interface WebsiteSettingsTableProps {
    data: WebsiteSettings[]
}

export function WebsiteSettingsTable({ data }: WebsiteSettingsTableProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this website setting?')) {
            return
        }

        startTransition(async () => {
            try {
                await deleteWebsiteSettings(id)
                toast.success('Website settings deleted successfully!')
                router.refresh()
            } catch (error) {
                console.error('Error deleting website settings:', error)
                toast.error('Failed to delete website settings')
            }
        })
    }

    const DetailModal = ({ setting }: { setting: WebsiteSettings }) => {
        return (
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Website Settings Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Basic Info */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Website Name:</span>
                                <p className="mt-1">{setting.website_name || '-'}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Email:</span>
                                <p className="mt-1">{setting.email || '-'}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Phone:</span>
                                <p className="mt-1">{setting.phone || '-'}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Akreditasi:</span>
                                <p className="mt-1">{setting.nama_akreditasi || '-'}</p>
                            </div>
                            <div className="col-span-2">
                                <span className="font-medium text-gray-700">Address:</span>
                                <p className="mt-1">{setting.address || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Images</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {setting.logo_url && (
                                <div>
                                    <span className="font-medium text-gray-700 block mb-2">Logo:</span>
                                    <div className="relative w-full h-20 border rounded">
                                        <Image
                                            src={setting.logo_url}
                                            alt="Logo"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            )}
                            {setting.favicon_url && (
                                <div>
                                    <span className="font-medium text-gray-700 block mb-2">Favicon:</span>
                                    <div className="relative w-full h-20 border rounded">
                                        <Image
                                            src={setting.favicon_url}
                                            alt="Favicon"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            )}
                            {setting.logo_akreditasi_url && (
                                <div>
                                    <span className="font-medium text-gray-700 block mb-2">Logo Akreditasi:</span>
                                    <div className="relative w-full h-20 border rounded">
                                        <Image
                                            src={setting.logo_akreditasi_url}
                                            alt="Logo Akreditasi"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Social Media</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Facebook:</span>
                                <p className="mt-1 break-all">{setting.facebook_url || '-'}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Twitter:</span>
                                <p className="mt-1 break-all">{setting.twitter_url || '-'}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Instagram:</span>
                                <p className="mt-1 break-all">{setting.instagram_url || '-'}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">YouTube:</span>
                                <p className="mt-1 break-all">{setting.youtube_url || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Content */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Footer Content</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Footer Text:</span>
                                <p className="mt-1 whitespace-pre-wrap">{setting.footer_text || '-'}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Copyright:</span>
                                <p className="mt-1">{setting.copyright_text || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Metadata</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Created:</span>
                                <p className="mt-1">
                                    {setting.createdAt
                                        ? new Date(setting.createdAt).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })
                                        : '-'
                                    }
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Last Updated:</span>
                                <p className="mt-1">
                                    {setting.updatedAt
                                        ? new Date(setting.updatedAt).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })
                                        : '-'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        )
    }

    const columns: ColumnDef<WebsiteSettings>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <Badge variant="secondary">#{row.original.id}</Badge>
        },
        {
            accessorKey: "website_name",
            header: "Website Name",
            cell: ({ row }) => (
                <div className="max-w-[200px]">
                    <p className="font-medium truncate">{row.original.website_name || '-'}</p>
                </div>
            )
        },
        {
            accessorKey: "logo_url",
            header: "Logo",
            cell: ({ row }) => (
                <div className="w-12 h-12">
                    {row.original.logo_url ? (
                        <div className="relative w-full h-full border rounded overflow-hidden">
                            <Image
                                src={row.original.logo_url}
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gray-100 border rounded flex items-center justify-center">
                            <span className="text-xs text-gray-400">No Logo</span>
                        </div>
                    )}
                </div>
            )
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <div className="max-w-[150px]">
                    <p className="text-sm truncate">{row.original.email || '-'}</p>
                </div>
            )
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => (
                <div className="text-sm text-gray-500">
                    {row.original.createdAt
                        ? new Date(row.original.createdAt).toLocaleDateString('id-ID')
                        : '-'
                    }
                </div>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DetailModal setting={row.original} />
                    </Dialog>

                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/website-settings/edit/${row.original.id}`}>
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(row.original.id)}
                        disabled={isPending}
                        className="text-red-600 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    <ContextMenu>
                        <ContextMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                    </ContextMenuItem>
                                </DialogTrigger>
                                <DetailModal setting={row.original} />
                            </Dialog>

                            <ContextMenuItem asChild>
                                <Link href={`/admin/website-settings/edit/${row.original.id}`}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Link>
                            </ContextMenuItem>

                            <ContextMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleDelete(row.original.id)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                </div>
            )
        }
    ]

    return (
        <DataTable
            columns={columns}
            data={data}
            searchColumn="website_name"
            searchPlaceholder="Search by website name..."
        />
    )
}
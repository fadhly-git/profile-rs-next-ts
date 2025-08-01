// components/organisms/website-settings-table.tsx
'use client'

import { WebsiteSettings } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Eye, Edit, Trash2, Globe, MapPin, Mail, Phone } from 'lucide-react'
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
      <DialogContent className="max-w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Globe className="h-5 w-5" />
            Website Settings Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6 mt-4">
          {/* Basic Info */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Website Name:</span>
                <p className="mt-1 break-words">{setting.website_name || '-'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email:
                </span>
                <p className="mt-1 break-all">{setting.email || '-'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Phone:
                </span>
                <p className="mt-1">{setting.phone || '-'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Akreditasi:</span>
                <p className="mt-1">{setting.nama_akreditasi || '-'}</p>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <span className="font-medium text-gray-700">Address:</span>
                <p className="mt-1 whitespace-pre-wrap">{setting.address || '-'}</p>
              </div>
              {setting.url_maps && (
                <div className="col-span-1 sm:col-span-2">
                  <span className="font-medium text-gray-700 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Google Maps:
                  </span>
                  <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono max-h-32 overflow-y-auto">
                    {setting.url_maps}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          {(setting.logo_url || setting.favicon_url || setting.logo_akreditasi_url) && (
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3">Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {setting.logo_url && (
                  <div>
                    <span className="font-medium text-gray-700 block mb-2 text-sm">Logo:</span>
                    <div className="relative w-full h-16 sm:h-20 border rounded">
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
                    <span className="font-medium text-gray-700 block mb-2 text-sm">Favicon:</span>
                    <div className="relative w-full h-16 sm:h-20 border rounded">
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
                    <span className="font-medium text-gray-700 block mb-2 text-sm">Logo Akreditasi:</span>
                    <div className="relative w-full h-16 sm:h-20 border rounded">
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
          )}

          {/* Social Media */}
          {(setting.facebook_url || setting.twitter_url || setting.instagram_url || setting.youtube_url) && (
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3">Social Media</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                {setting.facebook_url && (
                  <div>
                    <span className="font-medium text-gray-700">Facebook:</span>
                    <p className="mt-1 break-all text-blue-600">
                      <a href={setting.facebook_url} target="_blank" rel="noopener noreferrer">
                        {setting.facebook_url}
                      </a>
                    </p>
                  </div>
                )}
                {setting.twitter_url && (
                  <div>
                    <span className="font-medium text-gray-700">Twitter:</span>
                    <p className="mt-1 break-all text-blue-600">
                      <a href={setting.twitter_url} target="_blank" rel="noopener noreferrer">
                        {setting.twitter_url}
                      </a>
                    </p>
                  </div>
                )}
                {setting.instagram_url && (
                  <div>
                    <span className="font-medium text-gray-700">Instagram:</span>
                    <p className="mt-1 break-all text-blue-600">
                      <a href={setting.instagram_url} target="_blank" rel="noopener noreferrer">
                        {setting.instagram_url}
                      </a>
                    </p>
                  </div>
                )}
                {setting.youtube_url && (
                  <div>
                    <span className="font-medium text-gray-700">YouTube:</span>
                    <p className="mt-1 break-all text-blue-600">
                      <a href={setting.youtube_url} target="_blank" rel="noopener noreferrer">
                        {setting.youtube_url}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Content */}
          {(setting.footer_text || setting.copyright_text) && (
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3">Footer Content</h3>
              <div className="space-y-3 sm:space-y-4 text-sm">
                {setting.footer_text && (
                  <div>
                    <span className="font-medium text-gray-700">Footer Text:</span>
                    <p className="mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                      {setting.footer_text}
                    </p>
                  </div>
                )}
                {setting.copyright_text && (
                  <div>
                    <span className="font-medium text-gray-700">Copyright:</span>
                    <p className="mt-1">{setting.copyright_text}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3">Metadata</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
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
                        // components/organisms/website-settings-table.tsx (lanjutan)
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

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowWrapper = (row: any, children: React.ReactNode) => (
        <ContextMenu key={row.id}>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>
                    <Dialog>
                <DialogTrigger asChild>
                  <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </ContextMenuItem>
                </DialogTrigger>
                <DetailModal setting={row.original} />
              </Dialog>
                </ContextMenuItem>
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
    )

  const columns: ColumnDef<WebsiteSettings>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <Badge variant="secondary" className="text-xs">#{row.original.id}</Badge>
    },
    {
      accessorKey: "website_name",
      header: "Website Name",
      cell: ({ row }) => (
        <div className="min-w-[120px] max-w-[200px]">
          <p className="font-medium truncate text-sm" title={row.original.website_name || ''}>
            {row.original.website_name || '-'}
          </p>
          {row.original.email && (
            <p className="text-xs text-gray-500 truncate" title={row.original.email}>
              {row.original.email}
            </p>
          )}
        </div>
      )
    },
    {
      accessorKey: "logo_url",
      header: () => <span className="hidden sm:block">Logo</span>,
      cell: ({ row }) => (
        <div className="w-8 h-8 sm:w-12 sm:h-12 hidden sm:block">
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
              <span className="text-xs text-gray-400">-</span>
            </div>
          )}
        </div>
      )
    },
    {
      accessorKey: "phone",
      header: () => <span className="hidden lg:block">Contact</span>,
      cell: ({ row }) => (
        <div className="hidden lg:block min-w-[120px] max-w-[150px]">
          {row.original.phone && (
            <p className="text-sm truncate flex items-center gap-1" title={row.original.phone}>
              <Phone className="h-3 w-3" />
              {row.original.phone}
            </p>
          )}
          {row.original.address && (
            <p className="text-xs text-gray-500 truncate mt-1" title={row.original.address}>
              {row.original.address}
            </p>
          )}
        </div>
      )
    },
    {
      accessorKey: "url_maps",
      header: () => <span className="hidden md:block">Maps</span>,
      cell: ({ row }) => (
        <div className="hidden md:block">
          {row.original.url_maps ? (
            <Badge variant="outline" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              Available
            </Badge>
          ) : (
            <span className="text-xs text-gray-400">-</span>
          )}
        </div>
      )
    },
    {
      accessorKey: "createdAt",
      header: () => <span className="hidden xl:block">Created</span>,
      cell: ({ row }) => (
        <div className="text-xs text-gray-500 hidden xl:block min-w-[80px]">
          {row.original.createdAt 
            ? new Date(row.original.createdAt).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
              })
            : '-'
          }
        </div>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {/* Quick Actions for Mobile */}
          <div className="flex sm:hidden">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DetailModal setting={row.original} />
            </Dialog>

            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <Link href={`/admin/website-settings/edit/${row.original.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-1">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DetailModal setting={row.original} />
            </Dialog>

            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <Link href={`/admin/website-settings/edit/${row.original.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              onClick={() => handleDelete(row.original.id)}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={data}
        searchColumn="website_name"
        searchPlaceholder="Search by website name..."
        rowWrapper={rowWrapper}
      />
    </div>
  )
}
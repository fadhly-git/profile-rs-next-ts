import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus } from 'lucide-react'

interface BeritaPageTemplateProps {
    title: string
    description?: string
    showBackButton?: boolean
    backHref?: string
    showCreateButton?: boolean
    createHref?: string
    headerActions?: ReactNode
    children: ReactNode
}

export function BeritaPageTemplate({
    title,
    description,
    showBackButton = false,
    backHref = '/admin/berita',
    showCreateButton = false,
    createHref = '/admin/berita/create',
    headerActions,
    children
}: BeritaPageTemplateProps) {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            {showBackButton && (
                                <Link href={backHref}>
                                    <Button variant="ghost" size="sm">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Kembali
                                    </Button>
                                </Link>
                            )}
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                                {description && (
                                    <p className="text-muted-foreground text-sm mt-1">{description}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {headerActions}
                            {showCreateButton && (
                                <Link href={createHref}>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Buat Berita Baru
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                {children}
            </div>
        </div>
    )
}
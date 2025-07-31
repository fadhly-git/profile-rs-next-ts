import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface BeritaFormTemplateProps {
    title: string
    description?: string
    backHref?: string
    headerActions?: ReactNode
    children: ReactNode
}

export function BeritaFormTemplate({
    title,
    description,
    backHref = '/admin/berita',
    headerActions,
    children
}: BeritaFormTemplateProps) {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Link href={backHref}>
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Kembali
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                                {description && (
                                    <p className="text-muted-foreground text-sm mt-1">{description}</p>
                                )}
                            </div>
                        </div>

                        {headerActions && (
                            <div className="flex items-center gap-2">
                                {headerActions}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                {children}
            </div>
        </div>
    )
}
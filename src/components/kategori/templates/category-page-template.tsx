import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

interface CategoryPageTemplateProps {
    title: string
    children: React.ReactNode
    createUrl: string
    createButtonText?: string
}

export function CategoryPageTemplate({
    title,
    children,
    createUrl,
    createButtonText = "Tambah Kategori"
}: CategoryPageTemplateProps) {
    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
                <Link href={createUrl}>
                    <Button className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="sm:hidden">Tambah</span>
                        <span className="hidden sm:inline">{createButtonText}</span>
                    </Button>
                </Link>
            </div>

            {/* Content */}
            {children}
        </div>
    )
}
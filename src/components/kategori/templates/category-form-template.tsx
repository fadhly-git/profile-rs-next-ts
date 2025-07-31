import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import { forwardRef } from "react"

interface CategoryFormTemplateProps {
    title: string
    subtitle?: string
    categoryId?: string
    onBack: () => void
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    onDelete?: () => void
    isSubmitting: boolean
    submitText?: string
    children: React.ReactNode
    showTip?: boolean
    showDeleteButton?: boolean
}

export const CategoryFormTemplate = forwardRef<HTMLFormElement, CategoryFormTemplateProps>(({
    title,
    subtitle,
    categoryId,
    onBack,
    onSubmit,
    onDelete,
    isSubmitting,
    submitText = "Simpan",
    children,
    showTip = true,
    showDeleteButton = false
}, ref) => {
    return (
        <div className="container max-w-4xl py-4 sm:py-8 px-4">
            {/* Mobile-friendly Header */}
            <div className="mb-6 sm:mb-8">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                                {title}
                            </h1>
                            {categoryId && (
                                <Badge variant="outline" className="self-start">
                                    ID: {categoryId}
                                </Badge>
                            )}
                        </div>
                        {subtitle && (
                            <p className="text-sm sm:text-base text-muted-foreground">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {showDeleteButton && onDelete && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={onDelete}
                            className="w-full sm:w-auto"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    )}
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6" ref={ref}>
                {children}

                {/* Info Alert */}
                {showTip && (
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                            <strong>Tips:</strong> Kategori dapat memiliki sub-kategori untuk membentuk
                            hierarki konten. Kategori yang ditandai sebagai menu utama akan muncul
                            di navigasi website.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span className="sm:hidden">Menyimpan...</span>
                                <span className="hidden sm:inline">Menyimpan...</span>
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {submitText}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
})

CategoryFormTemplate.displayName = "CategoryFormTemplate"
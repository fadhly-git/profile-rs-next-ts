import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"
import { DependencyStats } from "../molecules/DependencyStats"
import { DependencyList } from "../molecules/DependencyList"
import { DependencyOptions } from "../molecules/DependencyOptions"

interface DependencyData {
    affectedCategories: number
    totalBerita: number
    totalHalaman: number
    hasAnyDependencies: boolean
    dependencies: Array<{
        categoryId: string
        categoryName: string
        beritaCount: number
        halamanCount: number
    }>
}

interface KategoriOption {
    id_kategori: string
    nama_kategori: string
}

interface DependencyDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    dependencies: DependencyData | null
    handleOption: string
    onOptionChange: (value: string) => void
    migrateToCategory: string
    onMigrateCategoryChange: (value: string) => void
    kategoriesList: KategoriOption[]
    currentKategoriId: string
    isPending: boolean
    onCancel: () => void
}

export function DependencyDialog({
    isOpen,
    onClose,
    onConfirm,
    dependencies,
    handleOption,
    onOptionChange,
    migrateToCategory,
    onMigrateCategoryChange,
    kategoriesList,
    currentKategoriId,
    isPending,
    onCancel
}: DependencyDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xs sm:max-w-2xl max-h-[90vh] overflow-hidden">
                <DialogHeader className="pb-4">
                    <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                        <span className="min-w-0">
                            Peringatan: Kategori Memiliki Konten Terkait
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Menonaktifkan kategori ini akan mempengaruhi konten yang ada.
                        Pilih tindakan yang ingin Anda lakukan.
                    </DialogDescription>
                </DialogHeader>

                {dependencies && (
                    <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-12rem)]">
                        <DependencyStats
                            affectedCategories={dependencies.affectedCategories}
                            totalBerita={dependencies.totalBerita}
                            totalHalaman={dependencies.totalHalaman}
                        />

                        <DependencyList dependencies={dependencies.dependencies} />

                        <DependencyOptions
                            handleOption={handleOption}
                            onOptionChange={onOptionChange}
                            migrateToCategory={migrateToCategory}
                            onMigrateCategoryChange={onMigrateCategoryChange}
                            kategoriesList={kategoriesList}
                            currentKategoriId={currentKategoriId}
                        />
                    </div>
                )}

                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="w-full sm:w-auto order-2 sm:order-1"
                        disabled={isPending}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={
                            isPending ||
                            (handleOption === "migrate" && !migrateToCategory)
                        }
                        className="w-full sm:w-auto order-1 sm:order-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            "Lanjutkan"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
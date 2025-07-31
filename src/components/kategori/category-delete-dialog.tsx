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
import { Loader2 } from "lucide-react"
import { type Kategori } from '@/types'

interface CategoryDeleteDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    kategori: Kategori | null
    isDeleting: boolean
}

export function CategoryDeleteDialog({
    isOpen,
    onClose,
    onConfirm,
    kategori,
    isDeleting
}: CategoryDeleteDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-md sm:max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg">Apakah Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                        Tindakan ini tidak dapat dibatalkan. Kategori &quot;{kategori?.nama_kategori}&quot;
                        akan dihapus secara permanen dari sistem.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-4">
                    <AlertDialogCancel
                        disabled={isDeleting}
                        className="w-full sm:w-auto"
                    >
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menghapus...
                            </>
                        ) : (
                            "Hapus"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
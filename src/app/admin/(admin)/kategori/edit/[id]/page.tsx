/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { use, useState, useEffect, useTransition, useCallback } from "react"
import { useRouter } from "next/navigation"
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
import { Loader2 } from "lucide-react"
import { CategoryFormTemplate } from "@/components/kategori/templates/category-form-template"
import { CategoryForm } from "@/components/molecules/category-form"
import { DependencyDialog } from "@/components/kategori/DependencyDialog"
import { useDependencyManager } from "@/hooks/use-dependency-manager"
import {
    getKategoriById,
    updateKategoriActionWithOptions,
    getKategoriListExcept,
    deleteKategoriAction
} from "@/lib/actions/kategori"

interface KategoriData {
    id_kategori: string
    nama_kategori: string
    slug_kategori: string
    keterangan: string | null
    parent_id: string | null
    urutan: number | null
    gambar: string | null
    is_main_menu: boolean
    is_active: boolean
}

interface KategoriOption {
    id_kategori: string
    nama_kategori: string
    parent_id: string | null
}

interface PageProps {
    params: Promise<{ id: string }>
}

// Transform data to match CategoryForm interface
const transformKategoriData = (data: KategoriData): Partial<{
    nama_kategori: string
    slug_kategori: string
    keterangan: string | undefined // Change to undefined
    parent_id: string | null
    urutan: number | null
    is_main_menu: boolean
    is_active: boolean
}> => ({
    nama_kategori: data.nama_kategori,
    slug_kategori: data.slug_kategori,
    keterangan: data.keterangan || undefined, // Transform null to undefined
    parent_id: data.parent_id,
    urutan: data.urutan,
    is_main_menu: data.is_main_menu,
    is_active: data.is_active
})

export default function EditKategoriPage({ params }: PageProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [kategoriData, setKategoriData] = useState<KategoriData | null>(null)
    const [kategoriList, setKategoriList] = useState<KategoriOption[]>([])
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [currentActiveState, setCurrentActiveState] = useState(true)
    const [isProcessingDependency, setIsProcessingDependency] = useState(false) // ✅ Add this

    const {
        showDependencyDialog,
        setShowDependencyDialog,
        dependencies,
        handleOption,
        setHandleOption,
        migrateToCategory,
        setMigrateToCategory,
        isCheckingDependencies,
        checkDependencies,
        resetDependencyState
    } = useDependencyManager()

    const { id } = use(params)

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true)
            try {
                const [data, list] = await Promise.all([
                    getKategoriById(id),
                    getKategoriListExcept(id)
                ])

                if (!data) {
                    toast.error("Kategori tidak ditemukan")
                    router.push("/admin/kategori")
                    return
                }

                setKategoriData(data as KategoriData)
                setCurrentActiveState(data.is_active) // ✅ Set initial active state
                setKategoriList(list)
            } catch {
                toast.error("Gagal memuat data kategori")
                router.push("/admin/kategori")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [id, router])

    // ✅ PERBAIKAN UTAMA: handleActiveToggle yang benar
    const handleActiveToggle = async (checked: boolean): Promise<boolean> => {
        console.log("Toggle aktif:", checked) // Debug log

        if (!checked) {
            // Menonaktifkan - check dependencies
            console.log("Checking dependencies...") // Debug log
            const hasDependencies = await checkDependencies(id)
            console.log("Has dependencies:", hasDependencies) // Debug log

            if (hasDependencies) {
                // Ada dependencies, dialog akan muncul dari useDependencyManager
                // Jangan update state currentActiveState dulu
                return true // Indicate ada dependencies
            } else {
                // Tidak ada dependencies, boleh langsung nonaktif
                setCurrentActiveState(false)
                return false // Indicate tidak ada dependencies
            }
        } else {
            // Mengaktifkan - langsung update state
            setCurrentActiveState(true)
            return false // Indicate tidak ada dependencies
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log("Submit with active state:", currentActiveState) // Debug log

        const formData = new FormData(e.currentTarget)

        // ✅ Set active state berdasarkan currentActiveState
        if (currentActiveState) {
            formData.set("is_active", "on")
        } else {
            formData.delete("is_active")
        }

        startTransition(async () => {
            try {
                const result = await updateKategoriActionWithOptions(id, formData)

                if (result.success) {
                    toast.success("Kategori berhasil diperbarui!")
                    setTimeout(() => {
                        router.push("/admin/kategori")
                    }, 1500)
                } else {
                    toast.error("Gagal memperbarui kategori", {
                        description: result.message
                    })
                }
            } catch (error: any) {
                toast.error("Gagal memperbarui kategori", {
                    description: error.message || "Silakan coba lagi."
                })
            }
        })
    }

    const handleDependencyCancel = () => {
        console.log("Dependency canceled") // Debug log
        setShowDependencyDialog(false)
        // ✅ Reset currentActiveState ke true karena user cancel nonaktif
        setCurrentActiveState(true)
        resetDependencyState()
    }

    const handleDependencyConfirm = () => {

        // ✅ Set ke nonaktif karena user konfirmasi
        setCurrentActiveState(false)

        // ✅ Buat FormData manual, jangan ambil dari form ref
        const formData = new FormData()

        // ✅ Set data kategori dari state yang ada
        if (kategoriData) {
            formData.set("nama_kategori", kategoriData.nama_kategori)
            formData.set("slug_kategori", kategoriData.slug_kategori)
            formData.set("keterangan", kategoriData.keterangan || "")
            formData.set("parent_id", kategoriData.parent_id || "none")
            formData.set("urutan", kategoriData.urutan?.toString() || "")

            // Set checkboxes
            if (kategoriData.is_main_menu) {
                formData.set("is_main_menu", "on")
            }
            // ✅ Jangan set is_active karena kita ingin nonaktifkan
        }

        // Set dependency handling options
        formData.set("handle_dependencies", handleOption)
        if (handleOption === "migrate" && migrateToCategory) {
            formData.set("migrate_to_category", migrateToCategory)
        }

        startTransition(async () => {
            try {
                const result = await updateKategoriActionWithOptions(id, formData)

                if (result.success) {
                    toast.success("Kategori berhasil diperbarui dengan penanganan dependencies!")
                    setShowDependencyDialog(false)
                    setIsProcessingDependency(false)
                    resetDependencyState()
                    setTimeout(() => {
                        router.push("/admin/kategori")
                    }, 1500)
                } else {
                    toast.error("Gagal memperbarui kategori", {
                        description: result.message
                    })
                    setCurrentActiveState(true)
                    setIsProcessingDependency(false)
                }
            } catch (error: any) {
                console.error("Error updating kategori:", error)
                toast.error("Gagal memperbarui kategori", {
                    description: error.message || "Silakan coba lagi."
                })
                setCurrentActiveState(true)
                setIsProcessingDependency(false)
            }
        })
    }

    const handleDelete = useCallback(async () => {
        setIsDeleting(true)
        try {
            await deleteKategoriAction(id)
            toast.success("Kategori berhasil dihapus")
            router.push("/admin/kategori")
        } catch (error: any) {
            toast.error("Gagal menghapus kategori", {
                description: error.message || "Silakan coba lagi."
            })
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
        }
    }, [id, router])

    const handleBack = useCallback(() => {
        router.push("/admin/kategori")
    }, [router])

    if (isLoading) {
        return <LoadingSkeleton />
    }

    if (!kategoriData) {
        return null
    }

    return (
        <>
            <CategoryFormTemplate
                title="Edit Kategori"
                subtitle={`Perbarui informasi kategori ${kategoriData.nama_kategori}`}
                categoryId={kategoriData.id_kategori}
                onBack={handleBack}
                onSubmit={handleSubmit}
                onDelete={() => setShowDeleteDialog(true)}
                isSubmitting={isPending}
                submitText="Simpan Perubahan"
                showDeleteButton={true}
            >
                <CategoryForm
                    // ref={formRef}
                    initialData={transformKategoriData(kategoriData)}
                    kategoriesList={kategoriList}
                    onActiveToggle={handleActiveToggle}
                    isCheckingDependencies={isCheckingDependencies}
                    isEditMode={true}
                />
            </CategoryFormTemplate>

            {/* Dependency Dialog */}
            <DependencyDialog
                isOpen={showDependencyDialog}
                onClose={() => {
                    console.log("Dialog closed via X button")
                    setShowDependencyDialog(false)
                    // ✅ Don't call handleDependencyCancel here to avoid loop
                }}
                onConfirm={handleDependencyConfirm}
                dependencies={dependencies}
                handleOption={handleOption}
                onOptionChange={setHandleOption}
                migrateToCategory={migrateToCategory}
                onMigrateCategoryChange={setMigrateToCategory}
                kategoriesList={kategoriList}
                currentKategoriId={kategoriData.id_kategori}
                isPending={isPending}
                onCancel={handleDependencyCancel}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="max-w-md sm:max-w-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg">Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                            Tindakan ini tidak dapat dibatalkan. Kategori &quot;{kategoriData.nama_kategori}&quot;
                            akan dihapus secara permanen dari sistem beserta semua data terkait.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                        <AlertDialogCancel disabled={isDeleting} className="w-full sm:w-auto">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                "Hapus Kategori"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

function LoadingSkeleton() {
    return (
        <div className="container max-w-4xl py-4 sm:py-8 px-4">
            <div className="animate-pulse space-y-6">
                <div className="h-10 w-24 bg-gray-200 rounded mb-4"></div>
                <div className="mb-8">
                    <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-96 bg-gray-200 rounded"></div>
                </div>

                {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-6">
                        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="h-10 w-full bg-gray-200 rounded"></div>
                                <div className="h-10 w-full bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-20 w-full bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
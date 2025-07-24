/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/kategori/edit/[id]/page.tsx
"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useTransition, useRef, useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
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
import {
    getKategoriById,
    updateKategoriAction,
    getKategoriListExcept,
    deleteKategoriAction
} from "./editKategoriAction"
import {
    FolderTree,
    Image,
    Info,
    ListOrdered,
    Menu,
    ToggleLeft,
    ArrowLeft,
    Save,
    Loader2,
    Trash2
} from "lucide-react"

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
    params: Promise<{ id: string }> // Params sekarang adalah Promise
}

export default function EditKategoriPage({ params }: PageProps) {
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)
    const [isPending, startTransition] = useTransition()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [kategoriData, setKategoriData] = useState<KategoriData | null>(null)
    const [kategoriList, setKategoriList] = useState<KategoriOption[]>([])
    const [slug, setSlug] = useState("")
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const { id } = use(params)

    // Fetch kategori data dan list
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
                setSlug(data.slug_kategori)
                setKategoriList(list)
            } catch (error) {
                toast.error("Gagal memuat data kategori")
                router.push("/admin/kategori")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [id, router])

    const handleNamaChange = (value: string) => {
        const generatedSlug = value
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim()
        setSlug(generatedSlug)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        startTransition(async () => {
            try {
                await updateKategoriAction(id, formData)
                toast.success("Kategori berhasil diperbarui!", {
                    description: "Perubahan telah disimpan."
                })
                setTimeout(() => {
                    router.push("/admin/kategori")
                }, 1500)
            } catch (error) {
                toast.error("Gagal memperbarui kategori", {
                    description: "Silakan coba lagi atau hubungi administrator."
                })
            }
        })
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteKategoriAction(id)
            toast.success("Kategori berhasil dihapus", {
                description: "Kategori telah dihapus dari sistem."
            })
            router.push("/admin/kategori")
        } catch (error: any) {
            toast.error("Gagal menghapus kategori", {
                description: error.message || "Silakan coba lagi."
            })
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
        }
    }

    if (isLoading) {
        return <LoadingSkeleton />
    }

    if (!kategoriData) {
        return null
    }

    return (
        <div className="container max-w-4xl py-8">
            {/* Header */}
            <div className="mb-8">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/admin/kategori")}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>

                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold">Edit Kategori</h1>
                            <Badge variant="outline">ID: {kategoriData.id_kategori}</Badge>
                        </div>
                        <p className="text-muted-foreground mt-2">
                            Perbarui informasi kategori {kategoriData.nama_kategori}
                        </p>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                    </Button>
                </div>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Informasi Dasar */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Dasar</CardTitle>
                        <CardDescription>
                            Perbarui informasi dasar kategori
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nama_kategori">
                                    Nama Kategori <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="nama_kategori"
                                    name="nama_kategori"
                                    placeholder="Contoh: Layanan Kesehatan"
                                    defaultValue={kategoriData.nama_kategori}
                                    required
                                    onChange={(e) => handleNamaChange(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug_kategori">
                                    Slug URL <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="slug_kategori"
                                    name="slug_kategori"
                                    placeholder="layanan-kesehatan"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    URL: /kategori/{slug || "slug-kategori"}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="keterangan">Deskripsi</Label>
                            <Textarea
                                id="keterangan"
                                name="keterangan"
                                placeholder="Deskripsi singkat tentang kategori ini..."
                                defaultValue={kategoriData.keterangan || ""}
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Hierarki & Pengaturan */}
                <Card>
                    <CardHeader>
                        <CardTitle>Hierarki & Pengaturan</CardTitle>
                        <CardDescription>
                            Atur posisi dan hierarki kategori
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="parent_id">
                                    <FolderTree className="inline mr-2 h-4 w-4" />
                                    Kategori Induk
                                </Label>
                                <Select
                                    name="parent_id"
                                    defaultValue={kategoriData.parent_id || "none"}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori induk (opsional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Tidak ada (Kategori Utama)</SelectItem>
                                        {kategoriList.map((kategori) => (
                                            <SelectItem
                                                key={kategori.id_kategori}
                                                value={kategori.id_kategori}
                                            >
                                                {kategori.nama_kategori}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Biarkan kosong untuk membuat kategori utama
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="urutan">
                                    <ListOrdered className="inline mr-2 h-4 w-4" />
                                    Urutan Tampil
                                </Label>
                                <Input
                                    id="urutan"
                                    name="urutan"
                                    type="number"
                                    placeholder="1"
                                    defaultValue={kategoriData.urutan || ""}
                                    min="1"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Urutan tampil dalam daftar kategori
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status & Visibilitas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Status & Visibilitas</CardTitle>
                        <CardDescription>
                            Kontrol visibilitas kategori di website
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="is_main_menu"
                                name="is_main_menu"
                                defaultChecked={kategoriData.is_main_menu}
                            />
                            <div className="space-y-1">
                                <Label
                                    htmlFor="is_main_menu"
                                    className="flex items-center cursor-pointer"
                                >
                                    <Menu className="mr-2 h-4 w-4" />
                                    Tampilkan di Menu Utama
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Kategori akan muncul di navigasi utama website
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="is_active"
                                name="is_active"
                                defaultChecked={kategoriData.is_active}
                            />
                            <div className="space-y-1">
                                <Label
                                    htmlFor="is_active"
                                    className="flex items-center cursor-pointer"
                                >
                                    <ToggleLeft className="mr-2 h-4 w-4" />
                                    Status Aktif
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Nonaktifkan untuk menyembunyikan kategori dari publik
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Alert */}
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Tips:</strong> Kategori dapat memiliki sub-kategori untuk membentuk
                        hierarki konten. Kategori yang ditandai sebagai menu utama akan muncul
                        di navigasi website.
                    </AlertDescription>
                </Alert>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/kategori")}
                        disabled={isPending}
                    >
                        Batal
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Perubahan
                            </>
                        )}
                    </Button>
                </div>
            </form>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Kategori &quot;{kategoriData.nama_kategori}&quot;
                            akan dihapus secara permanen dari sistem beserta semua data terkait.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
        </div>
    )
}

// Loading Skeleton Component
function LoadingSkeleton() {
    return (
        <div className="container max-w-4xl py-8">
            <Skeleton className="h-10 w-24 mb-4" />
            <div className="mb-8">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-56" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
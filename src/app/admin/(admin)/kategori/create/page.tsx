// app/admin/kategori/create/page.tsx
"use client"

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
import { Separator } from "@/components/ui/separator"
import { createKategoriAction, getKategoriList } from "./createKategoriAction"
import {
    FolderTree,
    Image,
    Info,
    ListOrdered,
    Menu,
    ToggleLeft,
    ArrowLeft,
    Save
} from "lucide-react"

interface KategoriOption {
    id_kategori: bigint
    nama_kategori: string
    parent_id: bigint | null
}

export default function CreateKategoriPage() {
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)
    const [isPending, startTransition] = useTransition()
    const [kategoriList, setKategoriList] = useState<KategoriOption[]>([])
    const [slug, setSlug] = useState("")

    // Fetch kategori list untuk parent selection
    useEffect(() => {
        async function fetchKategori() {
            const data = await getKategoriList()
            setKategoriList(data)
        }
        fetchKategori()
    }, [])

    // Auto generate slug dari nama kategori
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
                await createKategoriAction(formData)
                toast.success("Kategori berhasil dibuat!", {
                    description: "Kategori baru telah ditambahkan ke sistem."
                })
                setTimeout(() => {
                    router.push("/admin/kategori")
                }, 1500)
            } catch (error) {
                toast.error("Gagal membuat kategori", {
                    description: "Silakan coba lagi atau hubungi administrator."
                })
            }
        })
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

                <h1 className="text-3xl font-bold">Tambah Kategori Baru</h1>
                <p className="text-muted-foreground mt-2">
                    Buat kategori untuk mengorganisasi konten dan struktur navigasi website
                </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Informasi Dasar */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Dasar</CardTitle>
                        <CardDescription>
                            Masukkan informasi dasar kategori
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
                                <Select name="parent_id">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori induk (opsional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Tidak ada (Kategori Utama)</SelectItem>
                                        {kategoriList.map((kategori) => (
                                            <SelectItem
                                                key={kategori.id_kategori.toString()}
                                                value={kategori.id_kategori.toString()}
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
                                defaultChecked
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
                                <span className="animate-spin mr-2">⏳</span>
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Kategori
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
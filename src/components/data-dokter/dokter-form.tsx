// app/admin/dokter/_components/dokter-form.tsx
"use client"

import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/atoms/input"
import { ImageSelector } from "@/components/molecules/image-selector"
import { MultiSelect } from "@/components/atoms/multi-select"
import { SpesialisManagement } from "./spesialis-management"
import {
    createDokter,
    updateDokter,
    type DokterFormData
} from "@/lib/actions/data-dokter"
import { getAllSpesialis } from "@/lib/actions/kategori-spesialis"
import { toast } from "sonner"
import { ArrowLeft, Save, User, Camera, Stethoscope, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"

interface SpesialisData {
    id_spesialis: string
    nama_spesialis: string
    deskripsi?: string | null
}

interface DokterFormProps {
    initialData?: {
        id_dokter: string
        nama_dokter: string
        photo: string
        userId: string | null
        dokter_spesialis: Array<{
            id_dokter: string
            id_spesialis: string
            spesialis?: SpesialisData
        }>
    }
    isEdit?: boolean
}

export function DokterForm({ initialData, isEdit = false }: DokterFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [spesialisList, setSpesialisList] = useState<SpesialisData[]>([])

    const [formData, setFormData] = useState<DokterFormData>({
        nama_dokter: initialData?.nama_dokter || "",
        photo: initialData?.photo || "",
        userId: initialData?.userId || "",
        spesialis_ids: initialData?.dokter_spesialis.map(ds => ds.id_spesialis) || []
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        loadSpesialis()
    }, [])

    const loadSpesialis = async () => {
        try {
            const data = await getAllSpesialis()
            setSpesialisList(data)
        } catch {
            toast.error("Gagal memuat data spesialis")
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.nama_dokter.trim()) {
            newErrors.nama_dokter = "Nama dokter harus diisi"
        }

        if (!formData.photo.trim()) {
            newErrors.photo = "Foto dokter harus diisi"
        }

        if (formData.spesialis_ids.length === 0) {
            newErrors.spesialis_ids = "Pilih minimal satu spesialis"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error("Mohon periksa kembali data yang diisi")
            return
        }

        startTransition(async () => {
            try {
                if (isEdit && initialData) {
                    await updateDokter(initialData.id_dokter, formData)
                    toast.success("Data dokter berhasil diperbarui")
                } else {
                    await createDokter(formData)
                    toast.success("Data dokter berhasil ditambahkan")
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Terjadi kesalahan")
            }
        })
    }

    const handleInputChange = (field: keyof DokterFormData, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    const selectedSpesialis = spesialisList.filter(s =>
        formData.spesialis_ids.includes(s.id_spesialis)
    )

    // Transform spesialis data untuk MultiSelect
    const spesialisOptions = spesialisList.map(s => ({
        id: s.id_spesialis,
        label: s.nama_spesialis,
        description: s.deskripsi || undefined
    }))

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/admin/data-dokter")}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                        <div className="h-8 w-px bg-border" />
                        <div>
                            <h1 className="text-3xl font-bold">
                                {isEdit ? "Edit Dokter" : "Tambah Dokter Baru"}
                            </h1>
                            <p>
                                {isEdit
                                    ? "Perbarui informasi dokter dan spesialisnya"
                                    : "Lengkapi form di bawah untuk menambahkan dokter baru"
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Form Utama */}
                    <div className="xl:col-span-3">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Informasi Dasar */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">Informasi Dasar</CardTitle>
                                            <CardDescription>
                                                Data personal dan identitas dokter
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <Input
                                                label="Nama Lengkap Dokter"
                                                value={formData.nama_dokter}
                                                onChange={(e) => handleInputChange("nama_dokter", e.target.value)}
                                                error={errors.nama_dokter}
                                                placeholder="Dr. John Doe"
                                                required
                                            />
                                        </div>

                                        <Input
                                            label="User ID (Opsional)"
                                            value={formData.userId}
                                            onChange={(e) => handleInputChange("userId", e.target.value)}
                                            error={errors.userId}
                                            placeholder="12345"
                                            type="number"
                                            helperText="ID pengguna sistem jika dokter memiliki akun"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Foto Profil */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Camera className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">Foto Profil</CardTitle>
                                            <CardDescription>
                                                Upload atau pilih foto profil dokter dari media library
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ImageSelector
                                        label="Foto Dokter"
                                        value={formData.photo}
                                        onChange={(url) => handleInputChange("photo", url)}
                                        helperText="Foto akan ditampilkan pada profil dokter. Ukuran maksimal 5MB."
                                        required
                                    />
                                </CardContent>
                            </Card>

                            {/* Spesialisasi */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Stethoscope className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">Spesialisasi</CardTitle>
                                            <CardDescription>
                                                Pilih spesialisasi yang dimiliki dokter
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <MultiSelect
                                        options={spesialisOptions}
                                        value={formData.spesialis_ids}
                                        onChange={(ids) => handleInputChange("spesialis_ids", ids)}
                                        error={errors.spesialis_ids}
                                        placeholder="Pilih spesialisasi dokter..."
                                        searchPlaceholder="Cari spesialisasi..."
                                        emptyMessage="Spesialisasi tidak ditemukan."
                                        helperText="Pilih minimal satu spesialisasi. Jika tidak ada, tambahkan di panel sebelah kanan."
                                    />

                                    {/* Preview Spesialis yang Dipilih */}
                                    {selectedSpesialis.length > 0 && (
                                        <div className="space-y-3">
                                            <Separator />
                                            <div>
                                                <h4 className="text-sm font-medium mb-3">Spesialisasi Terpilih:</h4>
                                                <div className="grid gap-3">
                                                    {selectedSpesialis.map((spesialis) => (
                                                        <div
                                                            key={spesialis.id_spesialis}
                                                            className="flex items-start gap-3 p-3 rounded-lg"
                                                        >
                                                            <div className="p-1 bg-purple-100 rounded">
                                                                <Stethoscope className="h-3 w-3 text-purple-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0 w-full">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium text-purple-900">
                                                                        {spesialis.nama_spesialis}
                                                                    </span>
                                                                    <Badge variant="outline" className="text-xs">
                                                                        #{spesialis.id_spesialis}
                                                                    </Badge>
                                                                </div>
                                                                {spesialis.deskripsi && (
                                                                    <p className="text-xs text-purple-500 mt-1">
                                                                        {spesialis.deskripsi}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Submit Button */}
                            <Card className="shadow-sm">
                                <CardContent className="pt-6">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push("/admin/dokter")}
                                            disabled={isPending}
                                            className="order-2 sm:order-1"
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isPending}
                                            className="flex-1 order-1 sm:order-2"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {isPending
                                                ? (isEdit ? "Menyimpan..." : "Menambahkan...")
                                                : (isEdit ? "Simpan Perubahan" : "Tambah Dokter")
                                            }
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </div>

                    {/* Sidebar */}
                    <div className="xl:col-span-1">
                        <div className="space-y-6 sticky top-8">
                            {/* Manajemen Spesialis */}
                            <SpesialisManagement
                                spesialisList={spesialisList}
                                onUpdate={loadSpesialis}
                            />

                            {/* Tips Penggunaan */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-yellow-100 rounded-lg">
                                            <HelpCircle className="h-5 w-5 text-yellow-600" />
                                        </div>
                                        <CardTitle className="text-base">Tips Penggunaan</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3 text-sm">
                                        <div className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
                                            <div>
                                                <strong className="text-blue-900">Media Library:</strong>
                                                <p className="text-gray-600 mt-1">
                                                    Klik &quot;Pilih dari Media&quot; untuk menggunakan gambar yang sudah ada
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0" />
                                            <div>
                                                <strong className="text-green-900">Upload Baru:</strong>
                                                <p className="text-gray-600 mt-1">
                                                    Upload gambar baru langsung ke /public/upload/
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0" />
                                            <div>
                                                <strong className="text-purple-900">Spesialisasi:</strong>
                                                <p className="text-gray-600 mt-1">
                                                    Kelola spesialis di panel samping lalu pilih untuk dokter
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 shrink-0" />
                                            <div>
                                                <strong className="text-orange-900">Format URL:</strong>
                                                <p className="text-gray-600 mt-1">
                                                    Support URL relatif dan absolut untuk gambar
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Progress Indicator */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base">Progress Form</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${formData.nama_dokter ? 'bg-green-500' : 'bg-gray-300'
                                                }`} />
                                            <span className="text-sm">Informasi Dasar</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${formData.photo ? 'bg-green-500' : 'bg-gray-300'
                                                }`} />
                                            <span className="text-sm">Foto Profil</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${formData.spesialis_ids.length > 0 ? 'bg-green-500' : 'bg-gray-300'
                                                }`} />
                                            <span className="text-sm">Spesialisasi</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
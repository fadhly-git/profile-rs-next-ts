/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/hero-section/edit/[id]/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { useTransition, useRef, useState, useEffect, use } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { editHeroSectionAction } from "./editHeroSectionAction"
import {
    ArrowLeft,
    Save,
    Type,
    Image as ImageIcon,
    MousePointer,
    Eye,
    Upload,
    ExternalLink,
    Info,
    Lightbulb,
    CheckCircle2,
    AlertCircle,
    X,
    Loader2,
    SaveIcon,
    Clock
} from "lucide-react"
import Image from "next/image"

interface HeroSectionData {
    id: number
    headline: string
    subheading: string | null
    background_image: string | null
    cta_button_text_1: string | null
    cta_button_link_1: string | null
    cta_button_text_2: string | null
    cta_button_link_2: string | null
    created_at: Date
    updated_at: Date
}

interface HeroSectionFormProps {
    params: Promise<{ id: string }>
}

export default function EditHeroSectionPage({ params }: HeroSectionFormProps) {
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)
    const [isPending, startTransition] = useTransition()
    const [isLoading, setIsLoading] = useState(true)
    const [imagePreview, setImagePreview] = useState<string>("")
    const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url')
    const [isDragOver, setIsDragOver] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [showExitDialog, setShowExitDialog] = useState(false)
    const [isAutoSaving, setIsAutoSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { id } = use(params)

    const [formData, setFormData] = useState({
        headline: "",
        subheading: "",
        background_image: "",
        cta_button_text_1: "",
        cta_button_link_1: "",
        cta_button_text_2: "",
        cta_button_link_2: ""
    })

    const [originalData, setOriginalData] = useState(formData)

    // Load hero section data
    useEffect(() => {
        const loadHeroSection = async () => {
            try {
                setIsLoading(true)
                const response = await fetch(`/api/admin/hero-section/${id}`)
                if (!response.ok) {
                    throw new Error('Hero section tidak ditemukan')
                }

                const heroSection: HeroSectionData = await response.json()

                const data = {
                    headline: heroSection.headline || "",
                    subheading: heroSection.subheading || "",
                    background_image: heroSection.background_image || "",
                    cta_button_text_1: heroSection.cta_button_text_1 || "",
                    cta_button_link_1: heroSection.cta_button_link_1 || "",
                    cta_button_text_2: heroSection.cta_button_text_2 || "",
                    cta_button_link_2: heroSection.cta_button_link_2 || ""
                }

                setFormData(data)
                setOriginalData(data)
                setImagePreview(data.background_image)
                setLastSaved(new Date(heroSection.updated_at))
            } catch (error) {
                console.error('Error loading hero section:', error)
                toast.error('Gagal memuat data hero section')
                router.push('/admin/hero-section-or-banner')
            } finally {
                setIsLoading(false)
            }
        }

        loadHeroSection()
    }, [id, router])

    // Auto-save functionality
    useEffect(() => {
        if (!hasUnsavedChanges || isLoading) return

        const autoSaveTimer = setTimeout(async () => {
            await handleAutoSave()
        }, 3000) // Auto-save after 3 seconds of inactivity

        return () => clearTimeout(autoSaveTimer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData, hasUnsavedChanges, isLoading])

    // Check for unsaved changes
    useEffect(() => {
        const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData)
        setHasUnsavedChanges(hasChanges)
    }, [formData, originalData])

    // Prevent navigation with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault()
                e.returnValue = 'Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?'
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [hasUnsavedChanges])

    const handleAutoSave = async () => {
        if (!hasUnsavedChanges || isAutoSaving) return

        try {
            setIsAutoSaving(true)
            const data = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value || '')
            })

            await editHeroSectionAction(id, data)
            setOriginalData({ ...formData })
            setLastSaved(new Date())
            setHasUnsavedChanges(false)

            // Show subtle success indicator
            toast.success("Perubahan tersimpan otomatis", {
                duration: 2000,
                className: "bg-green-50 border-green-200"
            })
        } catch (error) {
            console.error('Auto-save error:', error)
            // Don't show error toast for auto-save failures to avoid spam
        } finally {
            setIsAutoSaving(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        if (field === 'background_image') {
            setImagePreview(value)
        }
    }

    const handleFileUpload = async (file: File) => {
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('File harus berupa gambar')
            return
        }

        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            toast.error('Ukuran file terlalu besar. Maksimal 5MB')
            return
        }

        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/admin/upload/image/hero-section', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            })

            const result = await response.json()

            if (result.success) {
                const imageUrl = result.url
                handleInputChange('background_image', imageUrl)
                setImagePreview(imageUrl)
                toast.success('Gambar berhasil diupload')
            } else {
                toast.error(result.error || 'Gagal mengupload gambar')
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Terjadi kesalahan saat mengupload')
        } finally {
            setIsUploading(false)
        }
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            handleFileUpload(file)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)

        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFileUpload(files[0])
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)

        startTransition(async () => {
            try {
                await editHeroSectionAction(id, data)
                setOriginalData({ ...formData })
                setHasUnsavedChanges(false)
                setLastSaved(new Date())

                toast.success("Hero section berhasil diperbarui!", {
                    description: "Perubahan telah disimpan ke sistem."
                })

                setTimeout(() => {
                    router.push("/admin/hero-section-or-banner")
                }, 1500)
            } catch (error: any) {
                toast.error("Gagal memperbarui hero section", {
                    description: error.message || "Silakan coba lagi atau hubungi administrator."
                })
            }
        })
    }

    const handleBack = () => {
        if (hasUnsavedChanges) {
            setShowExitDialog(true)
        } else {
            router.push("/admin/hero-section-or-banner")
        }
    }

    const handleExitWithSave = async () => {
        if (hasUnsavedChanges) {
            await handleAutoSave()
        }
        setShowExitDialog(false)
        router.push("/admin/hero-section-or-banner")
    }

    const handleExitWithoutSave = () => {
        setShowExitDialog(false)
        router.push("/admin/hero-section-or-banner")
    }

    const isValidUrl = (url: string) => {
        if (!url) return true
        if (url.startsWith('/') || url.startsWith('#')) return true
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    if (isLoading) {
        return (
            <div className="container max-w-5xl py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p className="text-muted-foreground">Memuat data hero section...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="container max-w-5xl py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Edit Hero Section</h1>
                                <p className="text-muted-foreground">
                                    Perbarui konten hero section untuk halaman utama website
                                </p>
                            </div>
                        </div>

                        {/* Auto-save Status */}
                        <div className="flex items-center gap-2">
                            {isAutoSaving && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Menyimpan...
                                </div>
                            )}

                            {hasUnsavedChanges && !isAutoSaving && (
                                <div className="flex items-center gap-2 text-sm text-amber-600">
                                    <Clock className="h-3 w-3" />
                                    Perubahan belum tersimpan
                                </div>
                            )}

                            {!hasUnsavedChanges && lastSaved && (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Tersimpan {new Date(lastSaved).toLocaleTimeString('id-ID', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Auto-save Info */}
                    <Alert className="mb-6">
                        <SaveIcon className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Auto-save aktif:</strong> Perubahan akan tersimpan otomatis setelah 3 detik tidak ada aktivitas.
                            Anda juga dapat menyimpan manual dengan tombol &quot;Simpan Perubahan&quot;.
                        </AlertDescription>
                    </Alert>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                            {/* Konten Utama */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Type className="h-5 w-5" />
                                        Konten Utama
                                    </CardTitle>
                                    <CardDescription>
                                        Headline dan subheading yang akan menarik perhatian pengunjung
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="headline">
                                            Headline <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="headline"
                                            name="headline"
                                            placeholder="Selamat Datang di RS Terbaik"
                                            value={formData.headline}
                                            onChange={(e) => handleInputChange('headline', e.target.value)}
                                            required
                                            className="text-lg font-semibold"
                                        />
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Karakter: {formData.headline.length}/100 (optimal: 40-60)
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subheading">Subheading</Label>
                                        <Textarea
                                            id="subheading"
                                            name="subheading"
                                            placeholder="Pelayanan kesehatan terpercaya dengan teknologi modern dan tenaga medis berpengalaman"
                                            value={formData.subheading}
                                            onChange={(e) => handleInputChange('subheading', e.target.value)}
                                            rows={3}
                                            className="resize-none"
                                        />
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Info className="h-3 w-3" />
                                            Karakter: {formData.subheading.length}/200 (optimal: 100-150)
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Background Image */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ImageIcon className="h-5 w-5" />
                                        Background Image
                                    </CardTitle>
                                    <CardDescription>
                                        Gambar latar belakang untuk hero section
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="background_image">Background Image</Label>

                                        {/* Tab Selection */}
                                        <div className="flex border-b">
                                            <button
                                                type="button"
                                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${uploadMethod === 'url'
                                                    ? 'border-primary text-primary'
                                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                                                    }`}
                                                onClick={() => setUploadMethod('url')}
                                            >
                                                URL Gambar
                                            </button>
                                            <button
                                                type="button"
                                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${uploadMethod === 'upload'
                                                    ? 'border-primary text-primary'
                                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                                                    }`}
                                                onClick={() => setUploadMethod('upload')}
                                            >
                                                Upload File
                                            </button>
                                        </div>

                                        {/* URL Input Method */}
                                        {uploadMethod === 'url' && (
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <Input
                                                        id="background_image"
                                                        name="background_image"
                                                        placeholder="https://example.com/hero-image.jpg atau /images/hero.jpg"
                                                        value={formData.background_image}
                                                        onChange={(e) => handleInputChange('background_image', e.target.value)}
                                                        type="url"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => window.open('/admin/media', '_blank')}
                                                        title="Buka Media Library"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Masukkan URL gambar dari internet atau path gambar yang sudah ada
                                                </p>
                                            </div>
                                        )}

                                        {/* File Upload Method */}
                                        {uploadMethod === 'upload' && (
                                            <div className="space-y-4">
                                                {/* Hidden input untuk menyimpan URL hasil upload */}
                                                <input
                                                    type="hidden"
                                                    name="background_image"
                                                    value={formData.background_image}
                                                />

                                                {/* Upload Area */}
                                                <div
                                                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragOver
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                                                        }`}
                                                    onDrop={handleDrop}
                                                    onDragOver={handleDragOver}
                                                    onDragLeave={handleDragLeave}
                                                >
                                                    {isUploading ? (
                                                        <div className="space-y-2">
                                                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                                            <p className="text-sm text-muted-foreground">Mengupload gambar...</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                                                <Upload className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <p className="text-sm font-medium">
                                                                    Drag & drop gambar di sini, atau
                                                                    <Button
                                                                        type="button"
                                                                        variant="link"
                                                                        className="p-0 h-auto font-medium text-primary"
                                                                        onClick={() => fileInputRef.current?.click()}
                                                                    >
                                                                        pilih file
                                                                    </Button>
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    PNG, JPG, WebP hingga 5MB. Rekomendasi: 1920x1080px
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Hidden File Input */}
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileSelect}
                                                    className="hidden"
                                                />

                                                {/* Quick Upload Button */}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={isUploading}
                                                >
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    Pilih File dari Komputer
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label>Preview Gambar</Label>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setImagePreview("")
                                                        handleInputChange('background_image', '')
                                                    }}
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    Hapus
                                                </Button>
                                            </div>
                                            <div className="relative rounded-lg border overflow-hidden group">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    width={800}
                                                    height={300}
                                                    className="w-full h-48 object-cover"
                                                    onError={() => {
                                                        setImagePreview("")
                                                        toast.error("Gagal memuat gambar")
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => window.open(imagePreview, '_blank')}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Lihat
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => {
                                                            setImagePreview("")
                                                            handleInputChange('background_image', '')
                                                            if (uploadMethod === 'upload') {
                                                                setUploadMethod('url')
                                                            }
                                                        }}
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Hapus
                                                    </Button>
                                                </div>
                                                <div className="absolute top-2 right-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        Preview
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Image Info */}
                                            <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                                                <span className="font-mono break-all">{formData.background_image}</span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Call to Action Buttons */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MousePointer className="h-5 w-5" />
                                        Call to Action Buttons
                                    </CardTitle>
                                    <CardDescription>
                                        Tombol aksi yang akan mengarahkan pengunjung
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* CTA Button 1 */}
                                    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">CTA 1 (Primary)</Badge>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="cta_button_text_1">Text Button</Label>
                                                <Input
                                                    id="cta_button_text_1"
                                                    name="cta_button_text_1"
                                                    placeholder="Jadwalkan Konsultasi"
                                                    value={formData.cta_button_text_1}
                                                    onChange={(e) => handleInputChange('cta_button_text_1', e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="cta_button_link_1">Link Tujuan</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="cta_button_link_1"
                                                        name="cta_button_link_1"
                                                        placeholder="/konsultasi atau https://wa.me/..."
                                                        value={formData.cta_button_link_1}
                                                        onChange={(e) => handleInputChange('cta_button_link_1', e.target.value)}
                                                    />
                                                    {formData.cta_button_link_1 && (
                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                            {isValidUrl(formData.cta_button_link_1) ? (
                                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                            ) : (
                                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {formData.cta_button_text_1 && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">Preview:</span>
                                                <Button size="sm" className="pointer-events-none">
                                                    {formData.cta_button_text_1}
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <Separator />

                                    {/* CTA Button 2 */}
                                    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">CTA 2 (Secondary)</Badge>
                                            <span className="text-xs text-muted-foreground">- Opsional</span>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="cta_button_text_2">Text Button</Label>
                                                <Input
                                                    id="cta_button_text_2"
                                                    name="cta_button_text_2"
                                                    placeholder="Lihat Layanan"
                                                    value={formData.cta_button_text_2}
                                                    onChange={(e) => handleInputChange('cta_button_text_2', e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="cta_button_link_2">Link Tujuan</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="cta_button_link_2"
                                                        name="cta_button_link_2"
                                                        placeholder="/layanan atau #section"
                                                        value={formData.cta_button_link_2}
                                                        onChange={(e) => handleInputChange('cta_button_link_2', e.target.value)}
                                                    />
                                                    {formData.cta_button_link_2 && (
                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                            {isValidUrl(formData.cta_button_link_2) ? (
                                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                            ) : (
                                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {formData.cta_button_text_2 && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">Preview:</span>
                                                <Button variant="outline" size="sm" className="pointer-events-none">
                                                    {formData.cta_button_text_2}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={isPending}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={isPending || !formData.headline}>
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
                    </div>

                    {/* Sidebar - Preview & Tips */}
                    <div className="space-y-6">
                        {/* Live Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="h-5 w-5" />
                                    Live Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative rounded-lg border overflow-hidden bg-gradient-to-br from-slate-900 to-slate-700 text-white min-h-[200px]">
                                    {imagePreview ? (
                                        <div className="absolute inset-0">
                                            <Image
                                                src={imagePreview}
                                                alt="Background"
                                                fill
                                                className="object-cover opacity-60"
                                                sizes="(max-width: 768px) 100vw, 300px"
                                                priority
                                                onError={() => {
                                                    setImagePreview("")
                                                    toast.error("Gagal memuat gambar")
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-80" />
                                    )}

                                    <div className="relative p-6 flex flex-col justify-center min-h-[200px] z-10">
                                        <h2 className="text-xl font-bold mb-2">
                                            {formData.headline || "Headline akan muncul di sini"}
                                        </h2>

                                        {formData.subheading && (
                                            <p className="text-sm text-gray-200 mb-4">
                                                {formData.subheading}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-2">
                                            {formData.cta_button_text_1 && (
                                                <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                                                    {formData.cta_button_text_1}
                                                </Button>
                                            )}
                                            {formData.cta_button_text_2 && (
                                                <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-black">
                                                    {formData.cta_button_text_2}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tips & Guidelines */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5" />
                                    Tips & Guidelines
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="space-y-2">
                                    <h4 className="font-medium">Headline yang Efektif:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                        <li>Maksimal 60 karakter</li>
                                        <li>Gunakan kata-kata yang kuat</li>
                                        <li>Fokus pada manfaat utama</li>
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium">Gambar Background:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                        <li>Resolusi minimal 1920x1080px</li>
                                        <li>Hindari gambar terlalu ramai</li>
                                        <li>Pastikan kontras dengan teks</li>
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium">Call to Action:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                        <li>Gunakan kata kerja aktif</li>
                                        <li>Maksimal 3-4 kata</li>
                                        <li>CTA pertama untuk aksi utama</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ExternalLink className="h-5 w-5" />
                                    Quick Links
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => window.open('/admin/media', '_blank')}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Media Library
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => router.push('/admin/hero-section-or-banner')}
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Lihat Semua Hero
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Exit Confirmation Dialog */}
            <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Keluar</DialogTitle>
                        <DialogDescription>
                            Anda memiliki perubahan yang belum disimpan. Apa yang ingin Anda lakukan?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Perubahan yang belum disimpan akan hilang jika Anda keluar tanpa menyimpan.
                            </AlertDescription>
                        </Alert>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowExitDialog(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleExitWithoutSave}
                        >
                            Keluar Tanpa Menyimpan
                        </Button>
                        <Button
                            onClick={handleExitWithSave}
                            disabled={isAutoSaving}
                        >
                            {isAutoSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan & Keluar
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
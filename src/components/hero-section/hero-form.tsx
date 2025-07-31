"use client"

import { useState, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    ArrowLeft,
    Save,
    Type,
    Image as ImageIcon,
    MousePointer,
    Info,
    Lightbulb,
    CheckCircle2,
    ExternalLink,
    Upload,
    Eye,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CtaButtonSection } from "@/components/hero-section/cta-button-section"
import { FormPreview } from "@/components/hero-section/form-preview"
import { LoadingSpinner } from "@/components/atoms/loading-spinner"
import { ImageUploadSection } from "../molecules/image-upload-section"
import { createHeroSectionAction, editHeroSectionAction } from "@/lib/actions/hero-section"

interface HeroFormProps {
    initialData?: {
        id?: number
        headline: string
        subheading: string
        background_image: string
        cta_button_text_1: string
        cta_button_link_1: string
        cta_button_text_2: string
        cta_button_link_2: string
    }
    mode: "create" | "edit"
}

export function HeroForm({ initialData, mode }: HeroFormProps) {
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)
    const [isPending, startTransition] = useTransition()
    const [imagePreview, setImagePreview] = useState<string>(initialData?.background_image || "")

    const [formData, setFormData] = useState({
        id: initialData?.id || undefined,
        headline: initialData?.headline || "",
        subheading: initialData?.subheading || "",
        background_image: initialData?.background_image || "",
        cta_button_text_1: initialData?.cta_button_text_1 || "",
        cta_button_link_1: initialData?.cta_button_link_1 || "",
        cta_button_text_2: initialData?.cta_button_text_2 || "",
        cta_button_link_2: initialData?.cta_button_link_2 || ""
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        if (field === 'background_image') {
            setImagePreview(value)
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)

        startTransition(async () => {
            try {
                if (mode === "create") {
                    await createHeroSectionAction(data)
                } else {
                    await editHeroSectionAction(initialData?.id?.toString() || "", data)
                }
                const successMessage = mode === "create"
                    ? "Hero section berhasil dibuat!"
                    : "Hero section berhasil diperbarui!"

                toast.success(successMessage, {
                    description: `Hero section telah ${mode === "create" ? "ditambahkan ke" : "diperbarui dalam"} sistem.`
                })

                setTimeout(() => {
                    router.push("/admin/hero-section-or-banner")
                }, 1500)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                const errorMessage = mode === "create"
                    ? "Gagal membuat hero section"
                    : "Gagal memperbarui hero section"

                toast.error(errorMessage, {
                    description: error.message || "Silakan coba lagi atau hubungi administrator."
                })
            }
        })
    }

    const pageTitle = mode === "create" ? "Buat Hero Section Baru" : "Edit Hero Section"
    const pageDescription = mode === "create"
        ? "Buat konten hero section yang menarik untuk halaman utama website"
        : "Perbarui konten hero section untuk halaman utama website"

    return (
        <div className="container max-w-5xl py-4 sm:py-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/admin/hero-section-or-banner")}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold break-words">{pageTitle}</h1>
                        <p className="text-muted-foreground text-sm sm:text-base break-words">
                            {pageDescription}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                        {/* Konten Utama */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
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
                                        className="text-base sm:text-lg font-semibold"
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
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <ImageIcon className="h-5 w-5" />
                                    Gambar Latar Belakang
                                </CardTitle>
                                <CardDescription>
                                    Gambar latar belakang untuk hero section
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ImageUploadSection
                                    value={formData.background_image}
                                    onChange={(value) => handleInputChange('background_image', value)}
                                    onPreviewChange={setImagePreview}
                                    disabled={isPending}
                                />
                            </CardContent>
                        </Card>

                        {/* Call to Action Buttons */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <MousePointer className="h-5 w-5" />
                                    Tombol Call to Action
                                </CardTitle>
                                <CardDescription>
                                    Tombol aksi yang akan mengarahkan pengunjung
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <CtaButtonSection
                                    number={1}
                                    textValue={formData.cta_button_text_1}
                                    linkValue={formData.cta_button_link_1}
                                    onTextChange={(value) => handleInputChange('cta_button_text_1', value)}
                                    onLinkChange={(value) => handleInputChange('cta_button_link_1', value)}
                                />

                                <Separator />

                                <CtaButtonSection
                                    number={2}
                                    textValue={formData.cta_button_text_2}
                                    linkValue={formData.cta_button_link_2}
                                    onTextChange={(value) => handleInputChange('cta_button_text_2', value)}
                                    onLinkChange={(value) => handleInputChange('cta_button_link_2', value)}
                                />
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/admin/hero-section-or-banner")}
                                disabled={isPending}
                                className="w-full sm:w-auto"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending || !formData.headline}
                                className="w-full sm:w-auto"
                            >
                                {isPending ? (
                                    <>
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        {mode === "create" ? "Menyimpan..." : "Memperbarui..."}
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        {mode === "create" ? "Simpan Hero Section" : "Perbarui Hero Section"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Sidebar - Preview & Tips */}
                <div className="space-y-6">
                    {/* Live Preview */}
                    <FormPreview
                        headline={formData.headline}
                        subheading={formData.subheading}
                        backgroundImage={imagePreview}
                        ctaText1={formData.cta_button_text_1}
                        ctaText2={formData.cta_button_text_2}
                    />

                    {/* Tips & Guidelines */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Lightbulb className="h-5 w-5" />
                                Tips & Panduan
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
                                <h4 className="font-medium">Gambar Latar:</h4>
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
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ExternalLink className="h-5 w-5" />
                                Tautan Cepat
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
                                Pustaka Media
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

            {/* Bottom Alert */}
            <Alert className="mt-8">
                <Info className="h-4 w-4" />
                <AlertDescription>
                    <strong>Catatan:</strong> Hero section akan langsung aktif setelah disimpan.
                    Pastikan semua konten sudah sesuai sebelum menyimpan.
                </AlertDescription>
            </Alert>
        </div>
    )
}
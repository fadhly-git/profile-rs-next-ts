"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/ui/image-upload'
import { ImageUploadSection } from '@/components//molecules/image-upload-section'
import { RichTextEditor } from '@/components/editor/TiptapEditor'
import { toast } from 'sonner'
import {
    FileText,
    Save,
    Eye,
    Tag,
    Globe,
    Image as ImageIcon,
    Settings,
    Calendar
} from 'lucide-react'

// Import molecules
import { SeoPreview } from '@/components/molecules/SeoPreview'
import { QuickTips } from '@/components/molecules/QuickTips'

// Import atoms
import { ActionButton } from '@/components/atoms/action-button'

interface Kategori {
    id_kategori: string
    nama_kategori: string
    slug_kategori: string
}

interface BeritaFormData {
    judul_berita: string
    slug_berita: string
    isi: string
    id_kategori: string
    status_berita: string
    jenis_berita: string
    bahasa: string
    keywords: string
    thumbnail: string
    gambar: string
    icon: string
    tanggal_post: string
}

interface BeritaFormProps {
    initialData?: Partial<BeritaFormData>
    onSubmit: (data: BeritaFormData) => Promise<void>
    onSaveDraft?: (data: BeritaFormData) => Promise<void>
    onPreview?: (data: BeritaFormData) => void
    isLoading?: boolean
    mode?: 'create' | 'edit'
}

const DEFAULT_FORM_DATA: BeritaFormData = {
    judul_berita: "",
    slug_berita: "",
    isi: "",
    id_kategori: "",
    status_berita: "draft",
    jenis_berita: "artikel",
    bahasa: "ID",
    keywords: "",
    thumbnail: "",
    gambar: "",
    icon: "",
    tanggal_post: new Date().toISOString().slice(0, 16),
}

export function BeritaForm({
    initialData = {},
    onSubmit,
    onSaveDraft,
    onPreview,
    isLoading = false,
    mode = 'create'
}: BeritaFormProps) {
    const [kategoris, setKategoris] = useState<Kategori[]>([])
    const [isLoadingKategoris, setIsLoadingKategoris] = useState(true)
    const [formData, setFormData] = useState<BeritaFormData>({
        ...DEFAULT_FORM_DATA,
        ...initialData
    })

    // Tambahkan state untuk preview
    const [thumbnailPreview, setThumbnailPreview] = useState('')
    const [gambarPreview, setGambarPreview] = useState('')

    // Inisialisasi preview saat component mount atau data berubah
    useEffect(() => {
        setThumbnailPreview(formData.thumbnail)
        setGambarPreview(formData.gambar)
    }, [formData.thumbnail, formData.gambar])

    // Load kategoris
    useEffect(() => {
        const fetchKategoris = async () => {
            setIsLoadingKategoris(true)
            try {
                const response = await fetch('/api/kategori')
                const result = await response.json()

                if (result.success) {
                    setKategoris(result.data)
                } else {
                    throw new Error(result.error || 'Failed to load categories')
                }
            } catch (error) {
                console.error('Failed to load categories:', error)
                toast.error("Gagal memuat kategori. Silakan refresh halaman.")
            } finally {
                setIsLoadingKategoris(false)
            }
        }
        fetchKategoris()
    }, [])

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim()
    }

    const handleJudulChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            judul_berita: value,
            slug_berita: generateSlug(value)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSubmit(formData)
    }

    const handlePreview = () => {
        if (!formData.judul_berita || !formData.isi) {
            toast.error("Judul dan konten wajib diisi untuk pratinjau")
            return
        }
        onPreview?.(formData)
    }

    const handleSaveDraft = async () => {
        if (!formData.judul_berita) {
            toast.error("Judul berita wajib diisi")
            return
        }
        if (onSaveDraft) {
            await onSaveDraft({ ...formData, status_berita: "draft" })
        }
    }

    const wordCount = formData.isi.replace(/<[^>]*>/g, '').length
    const estimatedReadTime = Math.ceil(wordCount / 200)

    const writingTips = mode === 'create' ? [
        "Gunakan judul yang menarik dan informatif",
        "Tambahkan gambar untuk menarik perhatian",
        "Isi kata kunci SEO untuk optimasi pencarian",
        "Pratinjau sebelum publikasi"
    ] : [
        "Simpan sebagai draft untuk melihat perubahan tanpa terbit",
        "Gunakan pratinjau untuk melihat tampilan final",
        "Ubah slug URL jika diperlukan untuk SEO",
        "Perbarui kata kunci untuk optimasi pencarian"
    ]

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                <ActionButton
                    icon={Eye}
                    label="Pratinjau"
                    onClick={handlePreview}
                    disabled={isLoading}
                />
                {onSaveDraft && (
                    <ActionButton
                        icon={Save}
                        label="Simpan Draft"
                        onClick={handleSaveDraft}
                        disabled={isLoading || !formData.judul_berita}
                    />
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content - 3 columns */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Informasi Dasar */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Informasi Dasar
                                </CardTitle>
                                <CardDescription>
                                    {mode === 'create' ? 'Masukkan' : 'Edit'} informasi dasar berita Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="judul_berita">
                                        Judul Berita <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="judul_berita"
                                        placeholder="Masukkan judul berita yang menarik..."
                                        value={formData.judul_berita}
                                        onChange={(e) => handleJudulChange(e.target.value)}
                                        className="text-lg h-12"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug_berita">URL Slug</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">/berita/</span>
                                        <Input
                                            id="slug_berita"
                                            value={formData.slug_berita}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                slug_berita: e.target.value
                                            }))}
                                            placeholder="url-berita"
                                            className="flex-1"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        URL otomatis dibuat dari judul. Anda dapat mengubahnya secara manual.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Editor Konten */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Konten Berita</CardTitle>
                                <CardDescription>
                                    {mode === 'create' ? 'Tulis' : 'Edit'} konten berita menggunakan editor lengkap dengan fitur pemformatan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RichTextEditor
                                    content={formData.isi}
                                    onChange={(content) => setFormData(prev => ({
                                        ...prev,
                                        isi: content
                                    }))}
                                    placeholder="Mulai tulis berita Anda di sini..."
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>{wordCount} karakter</span>
                                    <span>Estimasi waktu baca: {estimatedReadTime} menit</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Media */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5" />
                                    Media
                                </CardTitle>
                                <CardDescription>
                                    Upload {mode === 'create' ? '' : 'atau ganti '}gambar thumbnail dan gambar utama untuk berita
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ImageUploadSection
                                        label="Thumbnail"
                                        value={formData.thumbnail}
                                        onChange={(url) => setFormData(prev => ({
                                            ...prev,
                                            thumbnail: url
                                        }))}
                                        onPreviewChange={setThumbnailPreview}
                                        disabled={isLoading}
                                    />
                                    <ImageUploadSection
                                        label="Gambar Utama"
                                        value={formData.gambar}
                                        onChange={(url) => setFormData(prev => ({
                                            ...prev,
                                            gambar: url
                                        }))}
                                        onPreviewChange={setGambarPreview}
                                        disabled={isLoading}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - 1 column */}
                    <div className="space-y-6">
                        {/* Pengaturan Publikasi */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    Pengaturan Publikasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={formData.status_berita}
                                        onValueChange={(value) => setFormData(prev => ({
                                            ...prev,
                                            status_berita: value
                                        }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                                    Draft
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="publish">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                    Terbit
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_post">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Tanggal Publikasi
                                    </Label>
                                    <Input
                                        id="tanggal_post"
                                        type="datetime-local"
                                        value={formData.tanggal_post}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            tanggal_post: e.target.value
                                        }))}
                                    />
                                </div>

                                <Separator />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading || !formData.judul_berita || !formData.isi}
                                >
                                    {isLoading
                                        ? (mode === 'create' ? "Menyimpan..." : "Memperbarui...")
                                        : (mode === 'create' ? "Publikasikan" : "Perbarui Berita")
                                    }
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Kategori & Klasifikasi */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Tag className="w-5 h-5" />
                                    Kategori & Klasifikasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Kategori <span className="text-destructive">*</span></Label>
                                    <Select
                                        value={formData.id_kategori}
                                        onValueChange={(value) => setFormData(prev => ({
                                            ...prev,
                                            id_kategori: value
                                        }))}
                                        required
                                        disabled={isLoadingKategoris}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={
                                                isLoadingKategoris ? "Memuat kategori..." :
                                                    kategoris.length === 0 ? "Tidak ada kategori tersedia" :
                                                        "Pilih kategori"
                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kategoris.map((kategori) => (
                                                <SelectItem
                                                    key={kategori.id_kategori}
                                                    value={kategori.id_kategori}
                                                >
                                                    {kategori.nama_kategori}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {kategoris.length === 0 && !isLoadingKategoris && (
                                        <p className="text-xs text-destructive">
                                            Tidak ada kategori aktif. Pastikan ada kategori yang aktif di basis data.
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Jenis Berita</Label>
                                    <Select
                                        value={formData.jenis_berita}
                                        onValueChange={(value) => setFormData(prev => ({
                                            ...prev,
                                            jenis_berita: value
                                        }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="artikel">Artikel</SelectItem>
                                            <SelectItem value="berita">Berita</SelectItem>
                                            <SelectItem value="pengumuman">Pengumuman</SelectItem>
                                            <SelectItem value="event">Acara</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        <Globe className="w-4 h-4 inline mr-1" />
                                        Bahasa
                                    </Label>
                                    <Select
                                        value={formData.bahasa}
                                        onValueChange={(value) => setFormData(prev => ({
                                            ...prev,
                                            bahasa: value
                                        }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ID">
                                                <div className="flex items-center gap-2">
                                                    🇮🇩 Indonesia
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="EN">
                                                <div className="flex items-center gap-2">
                                                    🇺🇸 English
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Kata Kunci SEO</Label>
                                    <Textarea
                                        placeholder="kata kunci, seo, berita, rumah sakit"
                                        value={formData.keywords}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            keywords: e.target.value
                                        }))}
                                        className="min-h-[80px]"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Pisahkan dengan koma untuk beberapa kata kunci
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pratinjau SEO */}
                        <SeoPreview
                            title={formData.judul_berita}
                            slug={formData.slug_berita}
                            content={formData.isi}
                        />

                        {/* Tips */}
                        <QuickTips
                            tips={writingTips}
                            title={mode === 'create' ? "Tips Menulis" : "Tips Edit"}
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}
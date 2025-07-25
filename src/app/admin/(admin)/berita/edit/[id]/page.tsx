// app/admin/berita/[id]/edit/page.tsx
// app/admin/berita/[id]/edit/page.tsx
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { RichTextEditor } from '@/components/editor/TiptapEditor';
import { toast } from 'sonner';
import { updateBeritaAction } from './updateBeritaAction';
import { getBeritaByIdAction } from './getBeritaAction';
import { Beritas, EnumStatusBerita, EnumBeritasBahasa } from '@/types';
import { Kategori } from '@/types';
import {
    ArrowLeft,
    FileText,
    Save,
    Eye,
    Tag,
    Globe,
    Image as ImageIcon,
    Settings,
    Lightbulb,
    Calendar,
    Loader2
} from 'lucide-react';

export default function EditBeritaPage() {
    const router = useRouter();
    const params = useParams();
    const beritaId = params.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [kategoris, setKategoris] = useState<Kategori[]>([]);
    const [isLoadingKategoris, setIsLoadingKategoris] = useState(true);
    const [beritaData, setBeritaData] = useState<Beritas | null>(null);

    const [formData, setFormData] = useState({
        judul_berita: "",
        slug_berita: "",
        isi: "",
        id_kategori: "",
        status_berita: "draft" as EnumStatusBerita,
        jenis_berita: "artikel",
        bahasa: "ID" as EnumBeritasBahasa,
        keywords: "",
        thumbnail: "",
        gambar: "",
        icon: "",
        tanggal_post: new Date().toISOString().slice(0, 16),
    });

    // Load berita data
    useEffect(() => {
        const loadBeritaData = async () => {
            setIsLoadingData(true);
            try {
                const result = await getBeritaByIdAction(beritaId);

                if (result.success && result.data) {
                    setBeritaData(result.data);

                    // Set form data dari data berita yang dimuat
                    setFormData({
                        judul_berita: result.data.judul_berita,
                        slug_berita: result.data.slug_berita,
                        isi: result.data.isi,
                        id_kategori: result.data.id_kategori.toString(),
                        status_berita: result.data.status_berita,
                        jenis_berita: result.data.jenis_berita,
                        bahasa: result.data.bahasa,
                        keywords: result.data.keywords || "",
                        thumbnail: result.data.thumbnail || "",
                        gambar: result.data.gambar || "",
                        icon: result.data.icon || "",
                        tanggal_post: result.data.tanggal_post ?
                            new Date(result.data.tanggal_post).toISOString().slice(0, 16) :
                            new Date().toISOString().slice(0, 16),
                    });
                } else {
                    toast.error(result.error || "Berita tidak ditemukan");
                }
            } catch (error) {
                console.error('Error loading berita:', error);
                toast.error("Gagal memuat data berita");
            } finally {
                setIsLoadingData(false);
            }
        };

        if (beritaId) {
            loadBeritaData();
        }
    }, [beritaId]);

    // Load kategoris
    useEffect(() => {
        const fetchKategoris = async () => {
            setIsLoadingKategoris(true);
            try {
                const response = await fetch('/api/kategori');
                const result = await response.json();

                if (result.success) {
                    setKategoris(result.data);
                } else {
                    throw new Error(result.error || 'Failed to load categories');
                }
            } catch (error) {
                console.error('Failed to load categories:', error);
                toast.error("Gagal memuat kategori. Silakan refresh halaman.");
            } finally {
                setIsLoadingKategoris(false);
            }
        };
        fetchKategoris();
    }, []);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleJudulChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            judul_berita: value,
            slug_berita: generateSlug(value)
        }));
    };

    const handleDeleteImage = async (type: 'gambar' | 'thumbnail') => {
        const imageUrl = formData[type];

        if (!imageUrl) return;

        try {
            const response = await fetch('/api/admin/upload/image/berita/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: imageUrl }),
            });

            const result = await response.json();

            if (result.success) {
                setFormData(prev => ({ ...prev, [type]: '' }));
                toast.success('Gambar berhasil dihapus');
            } else {
                toast.error(result.error || 'Gagal menghapus gambar');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Terjadi kesalahan saat menghapus gambar');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const form = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                form.append(key, value);
            });

            await updateBeritaAction(beritaId, form);
            console.log('Berita updated successfully');
            toast.success("Berita berhasil diperbarui");
        } catch (error: unknown) {
            const isRedirectError = error &&
                typeof error === 'object' &&
                error !== null &&
                'digest' in error &&
                typeof (error as { digest: unknown }).digest === 'string' &&
                (error as { digest: string }).digest.includes('NEXT_REDIRECT');

            if (isRedirectError) {
                toast.success("Berita berhasil diperbarui");
                router.push('/admin/berita');
            } else {
                toast.error("Gagal mengupdate berita", {
                    description: error instanceof Error ? error.message : "Terjadi kesalahan",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreview = () => {
        if (!formData.judul_berita || !formData.isi) {
            toast.error("Judul dan konten wajib diisi untuk preview");
            return;
        }

        const previewData = {
            ...formData,
            id_berita: beritaId,
            status_berita: "draft" as EnumStatusBerita
        };

        localStorage.setItem('preview_berita', JSON.stringify(previewData));
        window.open('/admin/berita/preview', '_blank');
    };

    const handleSaveDraft = async () => {
        if (!formData.judul_berita) {
            toast.error("Judul berita wajib diisi");
            return;
        }

        setIsLoading(true);
        try {
            const form = new FormData();
            Object.entries({ ...formData, status_berita: "draft" }).forEach(([key, value]) => {
                form.append(key, value);
            });

            await updateBeritaAction(beritaId, form);
        } catch (error: unknown) {
            const isRedirectError = error &&
                typeof error === 'object' &&
                error !== null &&
                'digest' in error &&
                typeof (error as { digest: unknown }).digest === 'string' &&
                (error as { digest: string }).digest.includes('NEXT_REDIRECT');

            if (isRedirectError) {
                toast.success("Berita berhasil diperbarui");
                router.push('/admin/berita');
            } else {
                toast.error("Gagal mengupdate berita", {
                    description: error instanceof Error ? error.message : "Terjadi kesalahan",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const wordCount = formData.isi.replace(/<[^>]*>/g, '').length;
    const estimatedReadTime = Math.ceil(wordCount / 200);

    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Memuat data berita...</p>
                </div>
            </div>
        );
    }

    if (!beritaData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive mb-4">Berita tidak ditemukan</p>
                    <Link href="/admin/berita">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Daftar Berita
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/berita">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Kembali
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">Edit Berita</h1>
                                <p className="text-muted-foreground text-sm mt-1">
                                    Edit dan update berita: {beritaData.judul_berita}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePreview}
                                disabled={isLoading}
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSaveDraft}
                                disabled={isLoading || !formData.judul_berita}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Simpan Draft
                            </Button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Main Content - 3 columns */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Informasi Dasar
                                    </CardTitle>
                                    <CardDescription>
                                        Edit informasi dasar berita Anda
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
                                                onChange={(e) => setFormData(prev => ({ ...prev, slug_berita: e.target.value }))}
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

                            {/* Content Editor */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Konten Berita</CardTitle>
                                    <CardDescription>
                                        Edit konten berita menggunakan editor lengkap dengan fitur formatting
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RichTextEditor
                                        content={formData.isi}
                                        onChange={(content) => setFormData(prev => ({ ...prev, isi: content }))}
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
                                        Upload atau ganti gambar thumbnail dan gambar utama untuk berita
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ImageUpload
                                            label="Thumbnail"
                                            currentImage={formData.thumbnail}
                                            onImageUpload={(url) => setFormData(prev => ({ ...prev, thumbnail: url }))}
                                            onImageRemove={() => handleDeleteImage('thumbnail')}
                                            url='/api/admin/upload/image/berita-thumb'
                                        />
                                        <ImageUpload
                                            label="Gambar Utama"
                                            currentImage={formData.gambar}
                                            onImageUpload={(url) => setFormData(prev => ({ ...prev, gambar: url }))}
                                            onImageRemove={() => handleDeleteImage('gambar')}
                                            url='/api/admin/upload/image/berita-thumb'
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar - 1 column */}
                        <div className="space-y-6">
                            {/* Publish Settings */}
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
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, status_berita: value as EnumStatusBerita }))}
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
                                                        Publish
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
                                            onChange={(e) => setFormData(prev => ({ ...prev, tanggal_post: e.target.value }))}
                                        />
                                    </div>

                                    <Separator />

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isLoading || !formData.judul_berita || !formData.isi}
                                    >
                                        {isLoading ? "Mengupdate..." : "Update Berita"}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Category & Classification */}
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
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, id_kategori: value }))}
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
                                                    <SelectItem key={kategori.id_kategori.toString()} value={kategori.id_kategori.toString()}>
                                                        {kategori.nama_kategori}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Jenis Berita</Label>
                                        <Select
                                            value={formData.jenis_berita}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, jenis_berita: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="artikel">Artikel</SelectItem>
                                                <SelectItem value="berita">Berita</SelectItem>
                                                <SelectItem value="pengumuman">Pengumuman</SelectItem>
                                                <SelectItem value="event">Event</SelectItem>
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
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, bahasa: value as EnumBeritasBahasa }))}
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
                                        <Label>Keywords SEO</Label>
                                        <Textarea
                                            placeholder="kata kunci, seo, berita, rumah sakit"
                                            value={formData.keywords}
                                            onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                                            className="min-h-[80px]"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Pisahkan dengan koma untuk multiple keywords
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* SEO Preview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Preview SEO</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                                            {formData.judul_berita || "Judul Berita Anda"}
                                        </div>
                                        <div className="text-xs text-green-600">
                                            example.com/berita/{formData.slug_berita || "url-berita"}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {formData.isi ?
                                                formData.isi.replace(/<[^>]*>/g, '').substring(0, 160) + '...' :
                                                "Deskripsi berita akan muncul di sini..."
                                            }
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Article Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Info Artikel</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Dibuat:</span>
                                            <span>{beritaData.createdAt ? new Date(beritaData.createdAt).toLocaleDateString('id-ID') : '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Diupdate:</span>
                                            <span>{beritaData.updatedAt ? new Date(beritaData.updatedAt).toLocaleDateString('id-ID') : '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Penulis:</span>
                                            <span>{beritaData.user?.name ?? '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Hits:</span>
                                            <span>{beritaData.hits || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Status:</span>
                                            <span className={`px-2 py-1 rounded text-xs ${beritaData.status_berita === 'publish'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {beritaData.status_berita === 'publish' ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Tips */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5" />
                                        Tips Edit
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                                            <p>Simpan sebagai draft untuk melihat perubahan tanpa publish</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                                            <p>Gunakan preview untuk melihat tampilan final</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                                            <p>Ubah slug URL jika diperlukan untuk SEO</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                                            <p>Update keywords untuk optimasi pencarian</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
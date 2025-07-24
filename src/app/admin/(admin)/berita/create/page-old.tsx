"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RichTextEditor } from "@/components/editor/TiptapEditor";
import { createBeritaAction } from "../createBeritaAction";
import { getKategoriOptions } from "./_data";
import { toast } from "sonner";
import {
    ArrowLeft,
    Save,
    Eye,
    Calendar,
    Tag,
    Image,
    Globe,
    FileText,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface Kategori {
    id_kategori: bigint;
    nama_kategori: string;
    slug_kategori: string;
}

export default function CreateBeritaPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [kategoris, setKategoris] = useState<Kategori[]>([]);
    const [formData, setFormData] = useState({
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
    });

    useEffect(() => {
        const fetchKategoris = async () => {
            try {
                const data = await getKategoriOptions();
                setKategoris(data);
            } catch (error) {
                toast.error("Gagal memuat kategori");
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const form = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                form.append(key, value);
            });

            await createBeritaAction(form);
            toast.success("Berita berhasil dibuat!");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error("Gagal membuat berita", {
                description: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreview = () => {
        toast.info("Fitur preview akan segera tersedia");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/admin/berita">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">Buat Berita Baru</h1>
                            <p className="text-gray-600 mt-1">Buat dan publikasikan berita dengan editor yang lengkap</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Informasi Dasar
                                    </CardTitle>
                                    <CardDescription>
                                        Masukkan informasi dasar berita Anda
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="judul_berita">Judul Berita *</Label>
                                        <Input
                                            id="judul_berita"
                                            placeholder="Masukkan judul berita yang menarik..."
                                            value={formData.judul_berita}
                                            onChange={(e) => handleJudulChange(e.target.value)}
                                            className="text-lg"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="slug_berita">Slug URL *</Label>
                                        <Input
                                            id="slug_berita"
                                            placeholder="url-slug-berita"
                                            value={formData.slug_berita}
                                            onChange={(e) => setFormData(prev => ({ ...prev, slug_berita: e.target.value }))}
                                            className="font-mono text-sm"
                                            required
                                        />
                                        <p className="text-sm text-gray-500">
                                            URL: /berita/{formData.slug_berita}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="keywords">Keywords SEO</Label>
                                        <Input
                                            id="keywords"
                                            placeholder="berita, teknologi, update, dll"
                                            value={formData.keywords}
                                            onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                                        />
                                        <p className="text-sm text-gray-500">
                                            Pisahkan dengan koma untuk SEO yang lebih baik
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Content Editor */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Konten Berita
                                    </CardTitle>
                                    <CardDescription>
                                        Tulis konten berita menggunakan editor rich text
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RichTextEditor
                                        content={formData.isi}
                                        onChange={(content) => setFormData(prev => ({ ...prev, isi: content }))}
                                        placeholder="Mulai tulis berita Anda di sini..."
                                    />
                                </CardContent>
                            </Card>

                            {/* Media */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Image className="w-5 h-5" />
                                        Media
                                    </CardTitle>
                                    <CardDescription>
                                        Tambahkan gambar dan media pendukung
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="thumbnail">Thumbnail URL</Label>
                                            <Input
                                                id="thumbnail"
                                                placeholder="https://example.com/thumbnail.jpg"
                                                value={formData.thumbnail}
                                                onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="gambar">Gambar Utama URL</Label>
                                            <Input
                                                id="gambar"
                                                placeholder="https://example.com/image.jpg"
                                                value={formData.gambar}
                                                onChange={(e) => setFormData(prev => ({ ...prev, gambar: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="icon">Icon URL</Label>
                                        <Input
                                            id="icon"
                                            placeholder="https://example.com/icon.png"
                                            value={formData.icon}
                                            onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Publish Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="w-5 h-5" />
                                        Publikasi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="status_berita">Status</Label>
                                        <Select
                                            value={formData.status_berita}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, status_berita: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary">Draft</Badge>
                                                        <span>Simpan sebagai draft</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="publish">
                                                    <div className="flex items-center gap-2">                                                        <Badge variant="default">Publish</Badge>
                                                        <span>Publikasikan sekarang</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_post">Tanggal Publikasi</Label>
                                        <Input
                                            id="tanggal_post"
                                            type="datetime-local"
                                            value={formData.tanggal_post}
                                            onChange={(e) => setFormData(prev => ({ ...prev, tanggal_post: e.target.value }))}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handlePreview}
                                            className="flex-1"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Preview
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Simpan
                                                </>
                                            )}
                                        </Button>
                                    </div>
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
                                        <Label htmlFor="id_kategori">Kategori *</Label>
                                        <Select
                                            value={formData.id_kategori}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, id_kategori: value }))}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
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
                                        <Label htmlFor="jenis_berita">Jenis Berita</Label>
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
                                                <SelectItem value="opini">Opini</SelectItem>
                                                <SelectItem value="tutorial">Tutorial</SelectItem>
                                                <SelectItem value="review">Review</SelectItem>
                                                <SelectItem value="wawancara">Wawancara</SelectItem>
                                                <SelectItem value="press-release">Press Release</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bahasa">Bahasa</Label>
                                        <Select
                                            value={formData.bahasa}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, bahasa: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ID">
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="w-4 h-4" />
                                                        Bahasa Indonesia
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="EN">
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="w-4 h-4" />
                                                        English
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* SEO Preview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Preview SEO</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                                        <div className="text-blue-600 text-sm hover:underline cursor-pointer">
                                            {formData.judul_berita || "Judul Berita Anda"}
                                        </div>
                                        <div className="text-green-700 text-xs">
                                            https://yoursite.com/berita/{formData.slug_berita || "slug-url"}
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {formData.keywords ?
                                                `${formData.keywords.slice(0, 160)}...` :
                                                "Deskripsi akan muncul berdasarkan konten atau keywords yang Anda masukkan..."
                                            }
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Tips */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        💡 Tips Penulisan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm space-y-2 text-gray-600">
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500">•</span>
                                            Gunakan judul yang menarik dan deskriptif
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500">•</span>
                                            Tambahkan gambar untuk visual yang menarik
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500">•</span>
                                            Gunakan heading untuk struktur yang jelas
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500">•</span>
                                            Isi keywords untuk SEO yang lebih baik
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
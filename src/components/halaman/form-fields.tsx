// components/admin/halaman/form-fields.tsx
'use client'

import { Input } from '@/components/atoms/input'
import { RichTextEditor } from '@/components/editor/TiptapEditor'
import { ImageSelector } from '@/components/molecules/image-selector'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { KategoriType } from '@/types/halaman'

interface FormFieldsProps {
    values: {
        judul: string
        slug: string
        konten: string
        gambar: string
        kategoriId: string
        is_published: boolean
    }
    errors: Record<string, string>
    onChange: (field: string, value: string | boolean) => void
    kategoriOptions: KategoriType[]
}

export function FormFields({ values, errors, onChange, kategoriOptions }: FormFieldsProps) {
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    const handleJudulChange = (value: string) => {
        onChange('judul', value)
        if (!values.slug || values.slug === generateSlug(values.judul)) {
            onChange('slug', generateSlug(value))
        }
    }

    return (
        <div className="space-y-6">
            <Input
                label="Judul Halaman"
                placeholder="Masukkan judul halaman"
                value={values.judul}
                onChange={(e) => handleJudulChange(e.target.value)}
                error={errors.judul}
                helperText="Judul akan otomatis menghasilkan slug. Tidak boleh sama dengan kategori induk."
                required
            />


            <Input
                label="Slug"
                placeholder="slug-halaman"
                value={values.slug}
                onChange={(e) => onChange('slug', e.target.value)}
                error={errors.slug}
                helperText="URL halaman. Gunakan karakter a-z, 0-9, dan tanda hubung (-)"
                required
            />

            <div className="space-y-2">
                <Label>Kategori</Label>
                <Select
                    value={values.kategoriId}
                    onValueChange={(value) => onChange('kategoriId', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori (opsional)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Tanpa Kategori</SelectItem>
                        {kategoriOptions.map((kategori) => (
                            <SelectItem key={kategori.id_kategori} value={kategori.id_kategori}>
                                {kategori.nama_kategori}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.kategoriId && (
                    <p className="text-sm text-destructive">{errors.kategoriId}</p>
                )}
            </div>

            <ImageSelector
                label="Gambar Halaman"
                value={values.gambar}
                onChange={(url) => onChange('gambar', url)}
                helperText="Klik untuk memilih gambar dari media library atau upload gambar baru. Anda juga bisa memasukkan URL gambar langsung."
            />

            <div className="space-y-2">
                <Label className="text-sm font-medium">
                    Konten <span className="text-destructive">*</span>
                </Label>
                <div className="border rounded-md">
                    <RichTextEditor
                        content={values.konten}
                        onChange={(newContent) => onChange('konten', newContent)}
                        placeholder="Mulai menulis konten halaman di sini..."
                    />
                </div>
                {errors.konten && (
                    <p className="text-sm text-destructive">{errors.konten}</p>
                )}
                <p className="text-sm text-muted-foreground">
                    Gunakan editor untuk memformat teks, menambah gambar, link, dan elemen lainnya.
                    Gambar dapat diunggah langsung melalui editor.
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="is_published"
                    checked={values.is_published}
                    onCheckedChange={(checked) => onChange('is_published', checked)}
                />
                <Label htmlFor="is_published">
                    Publikasikan halaman
                </Label>
            </div>
        </div>
    )
}
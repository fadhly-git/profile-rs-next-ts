// components/admin/halaman/halaman-form.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { HalamanType, KategoriType } from '@/types/halaman'
import { FormFields } from './form-fields'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import { createHalaman, updateHalaman, HalamanFormData } from '@/lib/actions/halaman'
import { toast } from 'sonner'

interface HalamanFormProps {
    kategoriOptions: KategoriType[]
    initialData?: HalamanType
    mode: 'create' | 'edit'
}

export function HalamanForm({ kategoriOptions, initialData, mode }: HalamanFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const [values, setValues] = useState({
        judul: initialData?.judul || '',
        slug: initialData?.slug || '',
        konten: initialData?.konten || '',
        gambar: initialData?.gambar || '',
        kategoriId: initialData?.kategoriId || '',
        is_published: initialData?.is_published ?? true,
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (field: string, value: string | boolean) => {
        setValues(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!values.judul.trim()) {
            newErrors.judul = 'Judul wajib diisi'
        }

        if (!values.slug.trim()) {
            newErrors.slug = 'Slug wajib diisi'
        } else if (!/^[a-z0-9-]+$/.test(values.slug)) {
            newErrors.slug = 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'
        }

        if (!values.konten.trim()) {
            newErrors.konten = 'Konten wajib diisi'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Silakan perbaiki kesalahan pada form')
            return
        }

        const formData: HalamanFormData = {
            judul: values.judul.trim(),
            slug: values.slug.trim(),
            konten: values.konten.trim(),
            gambar: values.gambar.trim() || undefined,
            kategoriId: values.kategoriId || undefined,
            is_published: values.is_published,
        }

        startTransition(async () => {
            try {
                if (mode === 'create') {
                    await createHalaman(formData)
                    toast.success('Halaman berhasil dibuat')
                } else {
                    await updateHalaman(initialData!.id_halaman, formData)
                    toast.success('Halaman berhasil diupdate')
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan')
            }
        })
    }

    const handlePreview = () => {
        // Implementasi preview bisa dibuat sesuai kebutuhan
        toast.info('Fitur preview akan segera tersedia')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {mode === 'create' ? 'Informasi Halaman Baru' : 'Edit Informasi Halaman'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormFields
                            values={values}
                            errors={errors}
                            onChange={handleChange}
                            kategoriOptions={kategoriOptions}
                        />
                    </CardContent>
                </Card>

                <div className="flex items-center gap-4">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="min-w-[120px]"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {isPending
                            ? (mode === 'create' ? 'Menyimpan...' : 'Mengupdate...')
                            : (mode === 'create' ? 'Simpan' : 'Update')
                        }
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePreview}
                        disabled={isPending}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                    </Button>
                </div>
            </form>

            {/* Info Card */}
            <Card className="bg-muted/50">
                <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">💡 Tips Penggunaan</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• <strong>Gambar:</strong> Klik pada field gambar untuk membuka media library di <code>/app/admin/media</code></li>
                        <li>• <strong>Slug:</strong> Akan otomatis dibuat dari judul, tapi bisa diedit manual</li>
                        <li>• <strong>Konten:</strong> Mendukung HTML untuk formatting text</li>
                        <li>• <strong>Kategori:</strong> Opsional, pilih kategori untuk mengelompokkan halaman</li>
                        <li>• <strong>Status:</strong> Draft tidak akan tampil di website, hanya halaman yang dipublikasi</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
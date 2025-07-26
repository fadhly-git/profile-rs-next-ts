// components/admin/about-us/about-us-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '../atoms/input'
import { Textarea } from '../atoms/textarea'
import { ImageSelector } from '../molecules/image-selector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createAboutUs, updateAboutUs } from '@/lib/actions/about-us'
import type { AboutUsSection, AboutUsFormData } from '@/types/about-us'
import { isValidUrl } from '@/lib/validators'
import { toast } from 'sonner'

interface AboutUsFormProps {
    initialData?: AboutUsSection
    mode: 'create' | 'edit'
}

export function AboutUsForm({ initialData, mode }: AboutUsFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState<AboutUsFormData>({
        title: initialData?.title || 'Tentang Kami',
        short_description: initialData?.short_description || '',
        image_url: initialData?.image_url || '',
        read_more_link: initialData?.read_more_link || '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        const newErrors: Record<string, string> = {}
        if (!formData.short_description.trim()) {
            newErrors.short_description = 'Deskripsi singkat wajib diisi'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setLoading(true)
        try {
            if (mode === 'create') {
                const res = await createAboutUs(formData)
                if (!res.success) {
                    throw new Error('Gagal membuat About Us')
                } else {
                    toast.success('About Us berhasil dibuat')
                    setTimeout(() => {
                        router.push('/admin/tentang-kami')
                    }, 1000)
                }
            } else if (initialData) {
                await updateAboutUs(initialData.id, formData)
            }
        } catch {
            setErrors({ general: 'Terjadi kesalahan saat menyimpan data' })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: keyof AboutUsFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    {mode === 'edit' ? 'Edit Tentang Kami' : 'Buat Tentang Kami'}
                </h1>
                <p className="text-gray-600 mt-2">
                    {mode === 'edit'
                        ? 'Perbarui Tentang Kami organisasi Anda.'
                        : 'Atur informasi Tentang Kami organisasi Anda.'
                    }
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {mode === 'create' ? 'Tambah About Us' : 'Edit About Us'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {mode === 'create' && (
                        <Alert className="mb-6">
                            <AlertDescription>
                                <strong>Info:</strong> Data yang terakhir ditambahkan akan ditampilkan di website.
                            </AlertDescription>
                        </Alert>
                    )}

                    {errors.general && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription>{errors.general}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Judul"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Tentang Kami"
                            helperText="Kosongkan untuk menggunakan judul default"
                        />

                        <Textarea
                            label="Deskripsi Singkat"
                            value={formData.short_description}
                            onChange={(e) => handleChange('short_description', e.target.value)}
                            placeholder="Masukkan deskripsi singkat tentang perusahaan..."
                            error={errors.short_description}
                            required
                            rows={6}
                        />

                        <div className="space-y-2">
                            <ImageSelector
                                label="Gambar"
                                value={formData.image_url || ''}
                                onChange={(url) => handleChange('image_url', url)}
                                helperText="Pilih gambar untuk About Us"
                            />
                        </div>

                        <Input
                            label="Link Selengkapnya"
                            value={formData.read_more_link}
                            onChange={(e) => handleChange('read_more_link', e.target.value)}
                            placeholder="https://example.com/about-us atau /about-us"
                            helperText="Link menuju halaman lengkap About Us (opsional)"
                            type="text"
                            error={isValidUrl(formData.read_more_link || '') ? '' : 'Link tidak valid'}
                        />

                        <div className="flex gap-4 pt-6">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? 'Menyimpan...' : mode === 'create' ? 'Simpan' : 'Update'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex-1"
                            >
                                Batal
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
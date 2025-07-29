// components/admin/feature-blocks/feature-block-form.tsx
'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Loader2, Upload, HelpCircle } from 'lucide-react'
import { Input } from '@/components/atoms/input'
import { Textarea } from '@/components/atoms/textarea'
import { ImageSelector } from '@/components/molecules/image-selector'
import { FeatureBlock, FeatureBlockFormData } from '@/types/feature-blocks'
import { createFeatureBlock, updateFeatureBlock } from '@/lib/actions/feature-blocks'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface FeatureBlockFormProps {
    initialData?: FeatureBlock
    mode: 'create' | 'edit'
}

export function FeatureBlockForm({ initialData, mode }: FeatureBlockFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState<FeatureBlockFormData>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        icon: initialData?.icon || '',
        image_url: initialData?.image_url || '',
        display_order: initialData?.display_order || 0,
        is_active: initialData?.is_active ?? true,
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Judul harus diisi'
        }

        if (formData.display_order < 0) {
            newErrors.display_order = 'Urutan tampilan harus lebih dari atau sama dengan 0'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Mohon perbaiki kesalahan pada form')
            return
        }

        startTransition(async () => {
            try {
                if (mode === 'create') {
                    await createFeatureBlock(formData)
                    toast.success('Fitur blok berhasil dibuat')
                } else {
                    await updateFeatureBlock(initialData!.id, formData)
                    toast.success('Fitur blok berhasil diperbarui')
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan')
            }
        })
    }

    const handleDisplayOrderChange = (value: string) => {
        const numValue = parseInt(value) || 0
        setFormData({ ...formData, display_order: numValue })
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {mode === 'create' ? 'Tambah' : 'Edit'} Fitur Layanan
                        <Badge variant={mode === 'create' ? 'default' : 'secondary'}>
                            {mode === 'create' ? 'Buat Baru' : 'Edit'}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Informasi Dasar */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Informasi Dasar</h3>
                            <Separator />

                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    label="Judul *"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    error={errors.title}
                                    placeholder="Masukkan judul fitur"
                                    disabled={isPending}
                                />

                                <Input
                                    label="Urutan Tampilan"
                                    type="number"
                                    value={formData.display_order.toString()}
                                    onChange={(e) => handleDisplayOrderChange(e.target.value)}
                                    error={errors.display_order}
                                    placeholder="0"
                                    min="0"
                                    disabled={isPending}
                                    helperText="Semakin kecil angka, semakin depan urutannya"
                                />
                            </div>

                            <Textarea
                                label="Deskripsi *"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Masukkan deskripsi fitur"
                                required
                                disabled={isPending}
                                rows={4}
                            />
                        </div>

                        {/* Media & Icon */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Media &amp; Ikon</h3>
                            <Separator />

                            <div className="grid md:grid-cols-1 gap-6">
                                <div className="space-y-3">
                                    <ImageSelector
                                        label="Ikon"
                                        value={formData.icon}
                                        onChange={(url) => setFormData({ ...formData, icon: url })}
                                        helperText="Pilih ikon untuk fitur ini"
                                    />

                                    <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium mb-1">Cara menggunakan:</p>
                                                <ul className="space-y-1 text-xs">
                                                    <li>• Klik tombol &quot;Pilih Gambar&quot; untuk upload file baru</li>
                                                    <li>• Atau klik &quot;Dari Media&quot; untuk pilih dari galeri</li>
                                                    <li>• Bisa juga input URL langsung</li>
                                                    <li>• Format yang didukung: JPG, PNG, SVG</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <ImageSelector
                                        label="Gambar Utama"
                                        value={formData.image_url}
                                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                                        helperText="Pilih gambar utama untuk fitur ini"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pengaturan */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Pengaturan</h3>
                            <Separator />

                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-1">
                                    <Label htmlFor="is_active" className="text-sm font-medium">
                                        Status Aktif
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Aktifkan untuk menampilkan fitur ini di website
                                    </p>
                                </div>
                                <Switch
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                    disabled={isPending}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="min-w-[120px]"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        {mode === 'create' ? 'Buat' : 'Perbarui'}
                                    </>
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/admin/layanan')}
                                disabled={isPending}
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
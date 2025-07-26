// components/promotions/promotion-form.tsx
"use client"

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { isValid } from 'date-fns' // Hanya import yang digunakan
import { Button } from '@/components/ui/button'
import { Input } from '@/components/atoms/input'
import { Textarea } from '@/components/atoms/textarea'
import { Switch } from '@/components/ui/switch'
import { ImageSelector } from '@/components/molecules/image-selector'
import { DatePicker } from '@/components/ui/date-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createPromotion, updatePromotion } from '@/lib/actions/promotion'
import { toast } from 'sonner'
import type { Promotion, PromotionFormData, PromotionSubmitData } from '@/types/promotion'
import { isValidUrl } from '@/lib/validators'

interface PromotionFormProps {
    promotion?: Promotion
    mode: 'create' | 'edit'
}

// Helper function untuk format tanggal tanpa timezone conversion
const formatDateForInput = (date: string | Date | null | undefined): string => {
    if (!date) return ''

    try {
        const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : date
        if (!isValid(dateObj)) return ''

        // Format ke YYYY-MM-DD tanpa timezone conversion
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, '0')
        const day = String(dateObj.getDate()).padStart(2, '0')

        return `${year}-${month}-${day}`
    } catch (error) {
        console.error('Error formatting date:', error)
        return ''
    }
}

// Helper function untuk convert ke Date object dari input date
const parseDateFromInput = (dateString: string): Date | undefined => {
    if (!dateString) return undefined

    try {
        // Parse sebagai local date, bukan UTC
        const [year, month, day] = dateString.split('-').map(Number)
        const date = new Date(year, month - 1, day) // month - 1 karena JS month 0-indexed
        return isValid(date) ? date : undefined
    } catch (error) {
        console.error('Error parsing date:', error)
        return undefined
    }
}

// Interface untuk data yang akan dikirim ke server


export function PromotionForm({ promotion, mode }: PromotionFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const [formData, setFormData] = useState<PromotionFormData>({
        title: promotion?.title || '',
        description: promotion?.description || '',
        image_url: promotion?.image_url || '',
        link_url: promotion?.link_url || '',
        start_date: formatDateForInput(promotion?.start_date),
        end_date: formatDateForInput(promotion?.end_date),
        is_active: promotion?.is_active ?? true
    })

    const [errors, setErrors] = useState<Partial<Record<keyof PromotionFormData, string>>>({})

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof PromotionFormData, string>> = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required'
        }

        if (formData.start_date && formData.end_date) {
            const startDate = parseDateFromInput(formData.start_date)
            const endDate = parseDateFromInput(formData.end_date)

            if (startDate && endDate && startDate > endDate) {
                newErrors.end_date = 'End date must be after start date'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        startTransition(async () => {
            try {
                // Kirim data dengan format string sesuai PromotionFormData
                const submitData: PromotionFormData = {
                    title: formData.title,
                    description: formData.description,
                    image_url: formData.image_url,
                    link_url: formData.link_url,
                    start_date: formData.start_date,
                    end_date: formData.end_date,
                    is_active: formData.is_active
                }

                const result = mode === 'create'
                    ? await createPromotion(submitData)
                    : await updatePromotion(promotion!.id, submitData)

                if (result.success) {
                    toast.success(`Promotion ${mode === 'create' ? 'created' : 'updated'} successfully`)
                    router.push('/admin/promosi')
                } else {
                    toast.error(result.error || `Failed to ${mode} promotion`)
                }
            } catch (error) {
                toast.error('An unexpected error occurred')
                console.error(error)
            }
        })
    }

    const updateField = <K extends keyof PromotionFormData>(
        field: K,
        value: PromotionFormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    {mode === 'edit' ? 'Edit Promosi' : 'Buat Promosi'}
                </h1>
                <p className="text-gray-600 mt-2">
                    {mode === 'edit'
                        ? 'Perbarui informasi promosi Anda.'
                        : 'Buat promosi baru untuk organisasi Anda.'
                    }
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Dasar</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            label="Judul Promosi"
                            value={formData.title}
                            onChange={(e) => updateField('title', e.target.value)}
                            error={errors.title}
                            required
                            disabled={isPending}
                            placeholder="Masukan judul promosi"
                        />

                        <Textarea
                            label="Deskripsi"
                            value={formData.description}
                            onChange={(e) => updateField('description', e.target.value)}
                            error={errors.description}
                            disabled={isPending}
                            placeholder="Masukan deskripsi promosi"
                            rows={4}
                        />

                        <Input
                            label="Link URL"
                            type="text"
                            value={formData.link_url}
                            onChange={(e) => updateField('link_url', e.target.value)}
                            error={errors.link_url || (formData.link_url && !isValidUrl(formData.link_url)
                                ? 'Link tidak valid'
                                : '')}
                            disabled={isPending}
                            placeholder="https://example.com"
                            helperText="Link ke halaman promosi (opsional)"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Media</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ImageSelector
                            label="Gambar promosi"
                            value={formData.image_url}
                            onChange={(url) => updateField('image_url', url)}
                            helperText="Pilih gambar untuk promosi"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Jadwal & Pengaturan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DatePicker
                                label="Tanggal Mulai"
                                date={parseDateFromInput(formData.start_date)}
                                onDateChange={(date) => {
                                    const dateString = date ? formatDateForInput(date) : ''
                                    updateField('start_date', dateString)
                                }}
                                error={errors.start_date}
                                placeholder="Pilih tanggal mulai"
                                disabled={isPending}
                            />

                            <DatePicker
                                label="Tanggal Berakhir"
                                date={parseDateFromInput(formData.end_date)}
                                onDateChange={(date) => {
                                    const dateString = date ? formatDateForInput(date) : ''
                                    updateField('end_date', dateString)
                                }}
                                error={errors.end_date}
                                placeholder="Pilih tanggal berakhir"
                                disabled={isPending}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Status Aktif
                                </label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {formData.is_active ? 'Promosi ini akan ditampilkan' : 'Promosi ini tidak akan ditampilkan'}
                                </p>
                            </div>
                            <Switch
                                checked={formData.is_active}
                                onCheckedChange={(checked) => updateField('is_active', checked)}
                                disabled={isPending}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : mode === 'create' ? 'Buat Promosi' : 'Update Promosi'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
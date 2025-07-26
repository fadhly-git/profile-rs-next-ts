// components/organisms/website-settings-form.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { WebsiteSettings } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/atoms/input'
import { Textarea } from '@/components/atoms/textarea'
import { ImageSelector } from '@/components/molecules/image-selector'
import { LoadingSpinner } from '@/components/atoms/loading-spinner'
import { createWebsiteSettings, updateWebsiteSettings, WebsiteSettingsInput } from '@/lib/actions/website-settings'
import { toast } from 'sonner'

interface WebsiteSettingsFormProps {
    websiteSettings?: WebsiteSettings
    mode: 'create' | 'edit'
}

export function WebsiteSettingsForm({ websiteSettings, mode }: WebsiteSettingsFormProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const [formData, setFormData] = useState<WebsiteSettingsInput>({
        website_name: websiteSettings?.website_name || 'Nama Rumah Sakit Anda',
        logo_url: websiteSettings?.logo_url || '',
        favicon_url: websiteSettings?.favicon_url || '',
        logo_akreditasi_url: websiteSettings?.logo_akreditasi_url || '',
        nama_akreditasi: websiteSettings?.nama_akreditasi || '',
        email: websiteSettings?.email || '',
        phone: websiteSettings?.phone || '',
        address: websiteSettings?.address || '',
        facebook_url: websiteSettings?.facebook_url || '',
        twitter_url: websiteSettings?.twitter_url || '',
        instagram_url: websiteSettings?.instagram_url || '',
        youtube_url: websiteSettings?.youtube_url || '',
        footer_text: websiteSettings?.footer_text || '',
        copyright_text: websiteSettings?.copyright_text || '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        startTransition(async () => {
            try {
                if (mode === 'edit' && websiteSettings) {
                    await updateWebsiteSettings(websiteSettings.id, formData)
                    toast.success('Website settings updated successfully!')
                } else {
                    await createWebsiteSettings(formData)
                    toast.success('Website settings created successfully!')
                }

                router.push('/admin/website-settings')
                router.refresh()
            } catch (error) {
                console.error('Error saving website settings:', error)
                toast.error(`Failed to ${mode} website settings`)
            }
        })
    }

    const handleInputChange = (field: keyof WebsiteSettingsInput, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="max-w-4xl mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    {mode === 'edit' ? 'Edit Pengaturan Website' : 'Buat Pengaturan Website'}
                </h1>
                <p className="text-gray-600 mt-2">
                    {mode === 'edit'
                        ? 'Perbarui konfigurasi dan pengaturan branding website Anda.'
                        : 'Atur informasi dan branding website Anda.'
                    }
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="h-5 w-5 bg-blue-500 rounded"></div>
                            Infomasi Dasar
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            id="website_name"
                            label="Nama Website"
                            value={formData.website_name || ''}
                            onChange={(e) => handleInputChange('website_name', e.target.value)}
                            placeholder="Masukan nama website Anda"
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                id="email"
                                label="Email Address"
                                type="email"
                                value={formData.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="contact@example.com"
                            />

                            <Input
                                id="phone"
                                label="Nomor Telepon"
                                value={formData.phone || ''}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="+62 123 456 7890"
                            />
                        </div>

                        <Textarea
                            id="address"
                            label="Alamat Lengkap"
                            value={formData.address || ''}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Masukan alamat lengkap rumah sakit Anda"
                            rows={3}
                        />
                    </CardContent>
                </Card>

                {/* Images & Branding */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="h-5 w-5 bg-green-500 rounded"></div>
                            Gambar & Branding
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <ImageSelector
                            label="Website Logo"
                            value={formData.logo_url || ''}
                            onChange={(url) => handleInputChange('logo_url', url)}
                            helperText="Logo Utama Dari Web. Recommended size: 200x60px"
                        />

                        <Separator />

                        <ImageSelector
                            label="Favicon"
                            value={formData.favicon_url || ''}
                            onChange={(url) => handleInputChange('favicon_url', url)}
                            helperText="Icon kecil tampil pada tabs browser. Recommended size: 32x32px"
                        />

                        <Separator />

                        <div className="space-y-4">
                            <ImageSelector
                                label="Logo Akreditasi"
                                value={formData.logo_akreditasi_url || ''}
                                onChange={(url) => handleInputChange('logo_akreditasi_url', url)}
                                helperText="Logo akreditasi. Recommended size: 150x150px"
                            />

                            <Input
                                id="nama_akreditasi"
                                label="Nama Akreditasi"
                                value={formData.nama_akreditasi || ''}
                                onChange={(e) => handleInputChange('nama_akreditasi', e.target.value)}
                                placeholder="Enter accreditation name"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Social Media */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="h-5 w-5 bg-purple-500 rounded"></div>
                            Social Media Links
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                id="facebook_url"
                                label="Facebook URL"
                                value={formData.facebook_url || ''}
                                onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                                placeholder="https://facebook.com/yourpage"
                            />

                            <Input
                                id="twitter_url"
                                label="Twitter URL"
                                value={formData.twitter_url || ''}
                                onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                                placeholder="https://twitter.com/youraccount"
                            />

                            <Input
                                id="instagram_url"
                                label="Instagram URL"
                                value={formData.instagram_url || ''}
                                onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                                placeholder="https://instagram.com/youraccount"
                            />

                            <Input
                                id="youtube_url"
                                label="YouTube URL"
                                value={formData.youtube_url || ''}
                                onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                                placeholder="https://youtube.com/yourchannel"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Content */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="h-5 w-5 bg-orange-500 rounded"></div>
                            Footer Content
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            id="footer_text"
                            label="Footer Text"
                            value={formData.footer_text || ''}
                            onChange={(e) => handleInputChange('footer_text', e.target.value)}
                            placeholder="Enter footer description or additional information"
                            rows={4}
                            helperText="Additional text to display in the website footer"
                        />

                        <Input
                            id="copyright_text"
                            label="Copyright Text"
                            value={formData.copyright_text || ''}
                            onChange={(e) => handleInputChange('copyright_text', e.target.value)}
                            placeholder="© 2024 Your Company. All rights reserved."
                            helperText="Copyright notice displayed at the bottom of your website"
                        />
                    </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/admin/website-settings')}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <LoadingSpinner size="sm" className="mr-2" />}
                                {mode === 'edit' ? 'Update Settings' : 'Create Settings'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>

            {/* Info Notice */}
            <div className="mt-6 bg-card p-4 border border-card-foreground rounded-lg">
                <h3 className="font-semibold mb-2">📝 Catatan Pentiing:</h3>
                <ul className="text-sm-800 space-y-1">
                    <li>• Jika menambahkan beberapa pengaturan, entri terbaru akan digunakan sebagai konfigurasi aktif</li>
                    <li>• Gambar dapat dipilih dari media, diunggah langsung, atau ditentukan melalui URL</li>
                    <li>• Semua kolom bersifat opsional kecuali nama website</li>
                    <li>• Perubahan akan langsung diterapkan ke seluruh website setelah disimpan</li>
                </ul>
            </div>
        </div>
    )
}
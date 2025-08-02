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
import { MapPin, Globe, Users, Share2, FileText } from 'lucide-react'

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
    url_maps: websiteSettings?.url_maps || '',
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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {mode === 'edit' ? 'Edit Website Settings' : 'Create Website Settings'}
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          {mode === 'edit'
            ? 'Update your website configuration and branding settings.'
            : 'Configure your website information and branding settings.'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <div className="h-4 w-4 sm:h-5 sm:w-5 bg-blue-500 rounded"></div>
              <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="website_name"
              label="Website Name"
              value={formData.website_name || ''}
              onChange={(e) => handleInputChange('website_name', e.target.value)}
              placeholder="Enter website name"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                label="Phone Number"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+62 123 456 7890"
              />
            </div>

            <Textarea
              id="address"
              label="Address"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter full address"
              rows={3}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <MapPin className="inline h-4 w-4 mr-1" />
                Google Maps URL
              </label>
              <Textarea
                id="url_maps"
                value={formData.url_maps || ''}
                onChange={(e) => handleInputChange('url_maps', e.target.value)}
                placeholder="Paste your Google Maps embed URL or iframe code here"
                rows={4}
                helperText="You can paste either the embed URL or the complete iframe code from Google Maps"
              />
              {formData.url_maps && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  <div className="text-xs font-mono bg-white p-2 rounded border max-h-20 overflow-y-auto">
                    {formData.url_maps.length > 100
                      ? `${formData.url_maps.substring(0, 100)}...`
                      : formData.url_maps
                    }
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Images & Branding */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <div className="h-4 w-4 sm:h-5 sm:w-5 bg-green-500 rounded"></div>
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Images & Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Logo */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">Website Logo</label>
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <ImageSelector
                  label=""
                  value={formData.logo_url || ''}
                  onChange={(url) => handleInputChange('logo_url', url)}
                  helperText="Main logo for your website. Recommended size: 200x60px"
                />
              </div>
            </div>

            <Separator />

            {/* Favicon */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">Favicon</label>
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <ImageSelector
                  label=""
                  value={formData.favicon_url || ''}
                  onChange={(url) => handleInputChange('favicon_url', url)}
                  helperText="Small icon shown in browser tabs. Recommended size: 32x32px"
                />
              </div>
            </div>

            <Separator />

            {/* Logo Akreditasi */}
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="block text-sm font-medium">Logo Akreditasi</label>
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  <ImageSelector
                    label=""
                    value={formData.logo_akreditasi_url || ''}
                    onChange={(url) => handleInputChange('logo_akreditasi_url', url)}
                    helperText="Accreditation logo. Recommended size: 150x150px"
                  />
                </div>
              </div>

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
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <div className="h-4 w-4 sm:h-5 sm:w-5 bg-purple-500 rounded"></div>
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Social Media Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <div className="h-4 w-4 sm:h-5 sm:w-5 bg-orange-500 rounded"></div>
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
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
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/website-settings')}
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                {isPending && <LoadingSpinner size="sm" className="mr-2" />}
                {mode === 'edit' ? 'Update Settings' : 'Create Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Info Notice */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">📝 Important Notes:</h3>
        <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
          <li>• When adding multiple settings, the latest entry will be used as the active configuration</li>
          <li>• Images can be selected from media library, uploaded directly, or specified via URL</li>
          <li>• All fields are optional except the website name</li>
          <li>• For Google Maps, you can paste either the embed URL or complete iframe code</li>
          <li>• Changes will be reflected across your website immediately after saving</li>
        </ul>
      </div>
    </div>
  )
}
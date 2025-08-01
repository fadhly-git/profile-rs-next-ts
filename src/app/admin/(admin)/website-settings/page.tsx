// app/admin/website-settings/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WebsiteSettingsTable } from '@/components/website-settings/website-settings-table'
import { getWebsiteSettings } from '@/lib/actions/website-settings'
import { Plus, Settings } from 'lucide-react'
import { LoadingSpinner } from '@/components/atoms/loading-spinner'

export default async function WebsiteSettingsPage() {
    const websiteSettings = await getWebsiteSettings()

    return (
        <div className="container mx-auto py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                        <Settings className="h-6 w-6 sm:h-8 sm:w-8" />
                        Website Settings
                    </h1>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">
                        Manage your website configuration and branding settings
                    </p>
                </div>

                <Button asChild className="w-full sm:w-auto">
                    <Link href="/admin/website-settings/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Setting
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Website Settings List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={
                        <div className="flex items-center justify-center py-8">
                            <LoadingSpinner />
                            <span className="ml-2">Memuat konfigurasi website...</span>
                        </div>
                    }>
                        <WebsiteSettingsTable data={websiteSettings} />
                    </Suspense>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="mt-6">
                <CardContent className="pt-6">
                    <div className="border border-foreground-accent rounded-lg p-4">
                        <h3 className="font-semibold  mb-2">💡 How it works:</h3>
                        <ul className="text-sm space-y-1">
                            <li>• Anda dapat membuat beberapa konfigurasi website</li>
                            <li>• Konfigurasi terbaru yang dibuat akan digunakan sebagai konfigurasi aktif</li>
                            <li>• Klik kanan pada baris untuk melihat menu konteks</li>
                            <li>• Klik ikon mata untuk melihat detail informasi</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
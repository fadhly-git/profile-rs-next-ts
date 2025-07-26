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
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Settings className="h-8 w-8" />
                        Website Settings
                    </h1>
                    <p className="mt-2">
                        Mananjemen konfigurasi website Anda di sini. Anda dapat membuat, mengedit, dan menghapus konfigurasi yang ada.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/website-settings/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Konfigurasi
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
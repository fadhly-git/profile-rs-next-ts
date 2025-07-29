// app/admin/website-settings/[id]/edit/page.tsx
import { notFound } from 'next/navigation'
import { WebsiteSettingsForm } from '@/components/website-settings/website-settings-form'
import { getWebsiteSettingsById } from '@/lib/actions/website-settings'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EditWebsiteSettingsPageProps {
    params: Promise<{ id: string }>
}

export default async function EditWebsiteSettingsPage({ params }: EditWebsiteSettingsPageProps) {
    const { id } = await params;
    const websiteSettings = await getWebsiteSettingsById(parseInt(id))

    if (!websiteSettings) {
        notFound()
    }

    return (
        <div className="container mx-auto">
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/admin/website-settings">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Website Settings
                    </Link>
                </Button>
            </div>

            <WebsiteSettingsForm
                websiteSettings={websiteSettings}
                mode="edit"
            />
        </div>
    )
}
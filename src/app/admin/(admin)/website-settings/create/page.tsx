// app/admin/website-settings/create/page.tsx
import { WebsiteSettingsForm } from '@/components/website-settings/website-settings-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CreateWebsiteSettingsPage() {
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

            <WebsiteSettingsForm mode="create" />
        </div>
    )
}
// app/admin/about-us/create/page.tsx
import { AboutUsForm } from '@/components/about-us/about-us-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CreateAboutUsPage() {
    return (
        <div className="container mx-auto">
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/admin/tentang-kami">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Daftar About Us
                    </Link>
                </Button>
            </div>

            <AboutUsForm mode="create" />
        </div>
    )
}
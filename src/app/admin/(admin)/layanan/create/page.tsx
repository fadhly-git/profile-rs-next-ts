// app/admin/feature-blocks/create/page.tsx
import { FeatureBlockForm } from '@/components/feature-blocks/feature-block-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CreateFeatureBlockPage() {
    return (
        <div className="container mx-auto py-6 px-4">
            <div className="space-y-6">
                <div>
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href="/admin/layanan">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Daftar Layanan
                        </Link>
                    </Button>
                </div>

                <FeatureBlockForm mode="create" />
            </div>
        </div>
    )
}
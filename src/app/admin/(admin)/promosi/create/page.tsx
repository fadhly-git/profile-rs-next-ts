// app/admin/promotions/create/page.tsx
import { PromotionForm } from '@/components/promotions/promotion-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CreatePromotionPage() {
    return (
        <div className="container space-y-6 w-full mx-auto">
            <div>
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/admin/promosi">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Daftar Promosi
                    </Link>
                </Button>
            </div>

            <PromotionForm mode="create" />
        </div>
    )
}
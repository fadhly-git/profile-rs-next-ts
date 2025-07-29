// app/admin/promotions/[id]/edit/page.tsx
import { notFound } from 'next/navigation'
import { PromotionForm } from '@/components/promotions/promotion-form'
import { getPromotionById } from '@/lib/actions/promotion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EditPromotionPageProps {
    params: Promise<{ id: string }>
}

export default async function EditPromotionPage({ params }: EditPromotionPageProps) {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);
    const promotion = await getPromotionById(id)

    if (!promotion) {
        notFound()
    }

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

            <PromotionForm promotion={promotion} mode="edit" />
        </div>
    )
}
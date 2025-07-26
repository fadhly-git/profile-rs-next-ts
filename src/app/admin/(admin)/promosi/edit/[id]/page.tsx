// app/admin/promotions/[id]/edit/page.tsx
import { notFound } from 'next/navigation'
import { PromotionForm } from '@/components/promotions/promotion-form'
import { getPromotionById } from '@/lib/actions/promotion'

interface EditPromotionPageProps {
    params: {
        id: string
    }
}

export default async function EditPromotionPage({ params }: EditPromotionPageProps) {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);
    const promotion = await getPromotionById(id)

    if (!promotion) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Edit Promosi
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Ubah informasi promosi yang ada. Pastikan untuk memperbarui semua detail yang diperlukan.
                </p>
            </div>

            <PromotionForm promotion={promotion} mode="edit" />
        </div>
    )
}
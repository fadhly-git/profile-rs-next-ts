// app/admin/promotions/page.tsx
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { PromotionsTable } from '@/components/promotions/promotions-table'
import { getPromotions } from '@/lib/actions/promotion'

export default async function PromotionsPage() {
    const promotions = await getPromotions()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Promosi
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your promotional content
                    </p>
                </div>
                <Link href="/admin/promosi/create">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Buat Promosi
                    </Button>
                </Link>
            </div>

            <Suspense fallback={<div>Loading promosi...</div>}>
                <PromotionsTable data={promotions} />
            </Suspense>
        </div>
    )
}
// app/admin/feature-blocks/page.tsx
import { prisma } from '@/lib/prisma'
import { FeatureBlocksTable } from '@/components/feature-blocks/feature-blocks-table'

async function getFeatureBlocks() {
    return await prisma.featureBlocks.findMany({
        orderBy: [
            { display_order: 'asc' },
            { createdAt: 'desc' }
        ]
    })
}

export default async function FeatureBlocksPage() {
    const featureBlocks = await getFeatureBlocks()

    return (
        <div className="container mx-auto py-6 px-4">
            <FeatureBlocksTable data={featureBlocks} />
        </div>
    )
}
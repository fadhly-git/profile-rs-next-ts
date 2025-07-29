// app/admin/feature-blocks/edit/[id]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { FeatureBlockForm } from '@/components/feature-blocks/feature-block-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EditFeatureBlockPageProps {
    params: {
        id: string
    }
}

async function getFeatureBlock(id: number) {
    return await prisma.featureBlocks.findUnique({
        where: { id }
    })
}

export default async function EditFeatureBlockPage({ params }: EditFeatureBlockPageProps) {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);

    if (isNaN(id)) {
        notFound()
    }

    const featureBlock = await getFeatureBlock(id)

    if (!featureBlock) {
        notFound()
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href="/admin/layanan">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Daftar Layanan
                    </Link>
                </Button>
            </div>
            <div className="space-y-6">
                <FeatureBlockForm mode="edit" initialData={featureBlock} />
            </div>
        </div>
    )
}
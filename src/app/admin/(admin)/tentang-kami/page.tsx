// app/admin/about-us/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { AboutUsTable } from '@/components/about-us/about-us-table'
import { getAboutUsSections } from '@/lib/actions/about-us'

export default async function AboutUsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">About Us Management</h1>
                    <p className="text-gray-600 mt-2">
                        Kelola konten About Us untuk website
                    </p>
                </div>
                <Link href="/admin/tentang-kami/create">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah About Us
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar About Us</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div>Loading...</div>}>
                        <AboutUsTableWrapper />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}

async function AboutUsTableWrapper() {
    const data = await getAboutUsSections()
    return <AboutUsTable data={data} />
}
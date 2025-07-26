// app/admin/about-us/[id]/edit/page.tsx
import { notFound } from 'next/navigation'
import { AboutUsForm } from '@/components/about-us/about-us-form'
import { getAboutUsById } from '@/lib/actions/about-us'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EditAboutUsPageProps {
    params: { id: string }
}

export default async function EditAboutUsPage({ params }: EditAboutUsPageProps) {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);
    const aboutUs = await getAboutUsById(id);

    if (!aboutUs) {
        notFound();
    }

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

            <AboutUsForm mode="edit" initialData={aboutUs} />
        </div>
    );
}
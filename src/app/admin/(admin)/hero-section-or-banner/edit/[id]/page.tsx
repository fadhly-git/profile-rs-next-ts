import { notFound } from "next/navigation"
import { HeroEditPage } from "@/components/hero-section/templates/hero-edit-page"
import { getHeroSectionById } from "@/lib/actions/hero-section"

interface EditHeroSectionPageProps {
    params: Promise<{ id: string }>
}

export default async function EditHeroSectionPage({ params }: EditHeroSectionPageProps) {
    const awaitParams = await params
    const id = awaitParams.id
    const heroSection = await getHeroSectionById(id)

    if (!heroSection) {
        notFound()
    }

    return <HeroEditPage initialData={heroSection} />
}
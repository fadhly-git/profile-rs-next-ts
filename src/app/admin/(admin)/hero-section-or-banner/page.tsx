import { HeroListPage } from "@/components/hero-section/templates/hero-list-page"
import { getHeroSections } from "@/lib/actions/hero-section"

export default async function HeroSectionPage() {
  const heroSections = await getHeroSections()
  return <HeroListPage data={heroSections} />
}
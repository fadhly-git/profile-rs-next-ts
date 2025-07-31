"use client"

import { HeroForm } from "@/components/hero-section/hero-form"
import type { HeroSection } from '@/types'

interface HeroEditPageProps {
  initialData: HeroSection
}

export function HeroEditPage({ initialData }: HeroEditPageProps) {

  return (
    <HeroForm
      mode="edit"
      initialData={{
        id: initialData.id,
        headline: initialData.headline,
        subheading: initialData.subheading || "",
        background_image: initialData.background_image || "",
        cta_button_text_1: initialData.cta_button_text_1 || "",
        cta_button_link_1: initialData.cta_button_link_1 || "",
        cta_button_text_2: initialData.cta_button_text_2 || "",
        cta_button_link_2: initialData.cta_button_link_2 || ""
      }}
    />
  )
}
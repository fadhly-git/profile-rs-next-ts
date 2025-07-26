// types/about-us.ts
export interface AboutUsSection {
    id: number
    title: string | null
    short_description: string
    image_url: string | null
    read_more_link: string | null
    createdAt: Date | null
    updatedAt: Date | null
}

export interface AboutUsFormData {
    title?: string
    short_description: string
    image_url?: string
    read_more_link?: string
}
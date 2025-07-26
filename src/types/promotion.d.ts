// types/promotion.ts
export interface Promotion {
    id: number
    title: string
    description: string | null
    image_url: string | null
    link_url: string | null
    start_date: Date | null
    end_date: Date | null
    is_active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
}

// types/promotion.ts
export interface PromotionFormData {
    title: string
    description: string
    image_url: string
    link_url: string
    start_date: string // Keep as string for form handling
    end_date: string   // Keep as string for form handling
    is_active: boolean
}

// Untuk server action, gunakan type yang berbeda
export interface PromotionSubmitData {
    title: string
    description: string
    image_url: string
    link_url: string
    start_date?: Date | null
    end_date?: Date | null
    is_active: boolean
}
// types/feature-blocks.ts (update)
export interface FeatureBlock {
    id: number
    title: string
    description: string | null
    icon: string | null
    image_url: string | null
    display_order: number | null
    is_active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
}

export interface FeatureBlockFormData {
    title: string
    description: string
    icon: string
    image_url: string
    display_order: number
    is_active: boolean
}

// Tambahan untuk form errors
export interface FeatureBlockFormErrors {
    title?: string
    description?: string
    icon?: string
    image_url?: string
    display_order?: string
    is_active?: string
}
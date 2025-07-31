import { getKategoriList, getKategoriListExcept } from "@/lib/actions/kategori"
import { useEffect, useState } from "react"

interface CategoryOption {
    id_kategori: string
    nama_kategori: string
    parent_id: string | null
}

export function useCategory() {
    const [kategoriesList, setKategoriesList] = useState<CategoryOption[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchCategories = async (excludeId?: string) => {
        setIsLoading(true)
        try {
            const categories = excludeId
                ? await getKategoriListExcept(excludeId)
                : await getKategoriList()
            setKategoriesList(categories)
        } catch (error) {
            console.error("Failed to fetch categories:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Add useEffect to fetch categories on mount
    useEffect(() => {
        fetchCategories()
    }, [])

    return {
        kategoriesList,
        isLoading,
        fetchCategories,
        setKategoriesList
    }
}
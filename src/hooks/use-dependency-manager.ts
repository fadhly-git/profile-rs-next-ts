import { useState } from "react"
import { toast } from "sonner"

interface DependencyData {
    affectedCategories: number
    totalBerita: number
    totalHalaman: number
    hasAnyDependencies: boolean
    dependencies: Array<{
        categoryId: string
        categoryName: string
        beritaCount: number
        halamanCount: number
    }>
}

export function useDependencyManager() {
    const [showDependencyDialog, setShowDependencyDialog] = useState(false)
    const [dependencies, setDependencies] = useState<DependencyData | null>(null)
    const [handleOption, setHandleOption] = useState("deactivate")
    const [migrateToCategory, setMigrateToCategory] = useState("")
    const [isCheckingDependencies, setIsCheckingDependencies] = useState(false)

    const checkDependencies = async (categoryId: string): Promise<boolean> => {
        setIsCheckingDependencies(true)
        try {
            const response = await fetch(`/api/admin/kategori/check-dependencies/${categoryId}`)
            const result = await response.json()

            if (result.success) {
                setDependencies(result.data)
                if (result.data.hasAnyDependencies) {
                    setShowDependencyDialog(true) // ✅ Set dialog untuk muncul
                    return true // ✅ Return true karena ada dependencies
                }
            }
            return false // ✅ Return false karena tidak ada dependencies
        } catch (error) {
            console.error("Error checking dependencies:", error)
            toast.error("Gagal memeriksa dependencies")
            return false // ✅ Return false jika error
        } finally {
            setIsCheckingDependencies(false)
        }
    }

    const resetDependencyState = () => {
        setShowDependencyDialog(false)
        setDependencies(null)
        setHandleOption("deactivate")
        setMigrateToCategory("")
    }

    return {
        showDependencyDialog,
        setShowDependencyDialog,
        dependencies,
        handleOption,
        setHandleOption,
        migrateToCategory,
        setMigrateToCategory,
        isCheckingDependencies,
        checkDependencies,
        resetDependencyState
    }
}
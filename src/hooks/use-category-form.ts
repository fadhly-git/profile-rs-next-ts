/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface CategoryFormData {
    nama_kategori: string
    slug_kategori: string
    keterangan: string
    parent_id: string | null
    urutan: number | null
    is_main_menu: boolean
    is_active: boolean
}

export function useCategoryForm(initialData?: Partial<CategoryFormData>) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState<CategoryFormData>({
        nama_kategori: initialData?.nama_kategori || "",
        slug_kategori: initialData?.slug_kategori || "",
        keterangan: initialData?.keterangan || "",
        parent_id: initialData?.parent_id || null,
        urutan: initialData?.urutan || null,
        is_main_menu: initialData?.is_main_menu || false,
        is_active: initialData?.is_active ?? true,
    })

    const updateFormData = (updates: Partial<CategoryFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }))
    }

    const submitForm = async (action: (formData: FormData) => Promise<any>) => {
        const form = new FormData()

        // Populate form data
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (typeof value === 'boolean') {
                    if (value) form.set(key, 'on')
                } else {
                    form.set(key, String(value))
                }
            }
        })

        startTransition(async () => {
            try {
                const result = await action(form)

                if (result.success) {
                    toast.success(result.message)
                    setTimeout(() => {
                        router.push("/admin/kategori")
                    }, 1500)
                } else {
                    toast.error("Gagal menyimpan kategori", {
                        description: result.message
                    })
                }
            } catch (error: any) {
                toast.error("Terjadi kesalahan", {
                    description: error.message || "Silakan coba lagi"
                })
            }
        })
    }

    const handleBack = () => {
        router.push("/admin/kategori")
    }

    return {
        formData,
        updateFormData,
        submitForm,
        handleBack,
        isPending
    }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CategoryFormTemplate } from "@/components/kategori/templates/category-form-template"
import { CategoryForm } from "@/components/molecules/category-form"
import { useCategory } from "@/hooks/use-category"
import { createKategoriAction } from "@/lib/actions/kategori"

export default function CreateKategoriPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const { kategoriesList, fetchCategories } = useCategory()

    useEffect(() => {
        fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log("Kategories List:", kategoriesList)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        startTransition(async () => {
            try {
                const result = await createKategoriAction(formData)

                if (result.success) {
                    toast.success("Kategori berhasil dibuat!")
                } else {
                    toast.error("Gagal membuat kategori", {
                        description: (result as any).message || "Terjadi kesalahan saat membuat kategori"
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

    return (
        <CategoryFormTemplate
            title="Tambah Kategori"
            subtitle="Buat kategori baru untuk mengorganisir konten"
            onBack={handleBack}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitText="Simpan Kategori"
        >
            <CategoryForm
                kategoriesList={kategoriesList}
                isEditMode={false}
            />
        </CategoryFormTemplate>
    )
}
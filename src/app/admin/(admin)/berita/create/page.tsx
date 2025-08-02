/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BeritaFormTemplate } from '@/components/berita/templates/BeritaFormTemplate'
import { BeritaForm } from '@/components/berita/BeritaForm'
import { createBeritaAction } from '@/lib/actions/berita'
import { useState } from 'react'
import { User } from '@/types'
import { useSession } from 'next-auth/react'

export default function CreateBeritaPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const { data: session } = useSession();
    const user: User | undefined = session?.user
    ? {
      id: Number(session.user.id),
    }
    : undefined;

    const handleSubmit = async (formData: any) => {
        setIsLoading(true)
        try {
            const form = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                form.append(key, value as string)
            })

            // Tambahkan data user ke FormData jika user tersedia
            if (user) {
                form.append('user_id', String(user.id))
            }

            await createBeritaAction(form)
            toast.success("Berita berhasil dibuat")
            router.push('/admin/berita')
        } catch (error: unknown) {
            const isRedirectError = error &&
                typeof error === 'object' &&
                error !== null &&
                'digest' in error &&
                typeof (error as { digest: unknown }).digest === 'string' &&
                (error as { digest: string }).digest.includes('NEXT_REDIRECT')

            if (isRedirectError) {
                toast.success("Berita berhasil dibuat")
                router.push('/admin/berita')
            } else {
                toast.error("Gagal membuat berita", {
                    description: error instanceof Error ? error.message : "Terjadi kesalahan"
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveDraft = async (formData: any) => {
        await handleSubmit(formData)
    }

    const handlePreview = (formData: any) => {
        if (!formData.judul_berita || !formData.isi) {
            toast.error("Judul dan konten wajib diisi untuk pratinjau")
            return
        }

        const previewData = {
            ...formData,
            status_berita: "draft"
        }

        localStorage.setItem('preview_berita', JSON.stringify(previewData))
        window.open('/admin/berita/preview', '_blank')
    }

    return (
        <BeritaFormTemplate
            title="Buat Berita Baru"
            description="Buat dan publikasikan berita dengan editor yang lengkap"
        >
            <BeritaForm
                onSubmit={handleSubmit}
                onSaveDraft={handleSaveDraft}
                onPreview={handlePreview}
                isLoading={isLoading}
                mode="create"
            />
        </BeritaFormTemplate>
    )
}
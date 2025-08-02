/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BeritaFormTemplate } from '@/components/berita/templates/BeritaFormTemplate'
import { BeritaForm } from '@/components/berita/BeritaForm'
import { getBeritaByIdAction, updateBeritaAction } from '@/lib/actions/berita'
import { useEffect, useState } from 'react'
import { Beritas, User } from '@/types'
import { LoadingSpinner } from '@/components/atoms/loading-spinner'
import { useSession } from 'next-auth/react'

export default function EditBeritaPage() {
    const router = useRouter()
    const params = useParams()
    const beritaId = params.id as string

    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [beritaData, setBeritaData] = useState<Beritas | null>(null)

    const { data: session } = useSession();
    const user: User | undefined = session?.user
        ? {
            id: Number(session.user.id),
        }
        : undefined;

    // Load berita data
    useEffect(() => {
        const loadBeritaData = async () => {
            setIsLoadingData(true)
            try {
                const result = await getBeritaByIdAction(beritaId)

                if (result.success && result.data) {
                    setBeritaData(result.data)
                } else {
                    toast.error(result.error || "Berita tidak ditemukan")
                    router.push('/admin/berita')
                }
            } catch (error) {
                console.error('Error loading berita:', error)
                toast.error("Gagal memuat data berita")
                router.push('/admin/berita')
            } finally {
                setIsLoadingData(false)
            }
        }

        if (beritaId) {
            loadBeritaData()
        }
    }, [beritaId, router])

    const handleSubmit = async (formData: any) => {
        setIsLoading(true)
        try {
            const form = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                form.append(key, value as string)
            })
            if (user) {
                form.append('user_id', String(user.id))
            }

            await updateBeritaAction(beritaId, form)
            toast.success("Berita berhasil diperbarui")
            router.push('/admin/berita')
        } catch (error: unknown) {
            const isRedirectError = error &&
                typeof error === 'object' &&
                error !== null &&
                'digest' in error &&
                typeof (error as { digest: unknown }).digest === 'string' &&
                (error as { digest: string }).digest.includes('NEXT_REDIRECT')

            if (isRedirectError) {
                toast.success("Berita berhasil diperbarui")
                router.push('/admin/berita')
            } else {
                toast.error("Gagal memperbarui berita", {
                    description: error instanceof Error ? error.message : "Terjadi kesalahan"
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveDraft = async (formData: any) => {
        await handleSubmit({ ...formData, status_berita: "draft" })
    }

    const handlePreview = (formData: any) => {
        if (!formData.judul_berita || !formData.isi) {
            toast.error("Judul dan konten wajib diisi untuk pratinjau")
            return
        }

        const previewData = {
            ...formData,
            id_berita: beritaId,
            status_berita: "draft"
        }

        localStorage.setItem('preview_berita', JSON.stringify(previewData))
        window.open('/admin/berita/preview', '_blank')
    }

    if (isLoadingData) {
        return (
            <BeritaFormTemplate
                title="Edit Berita"
                description="Memuat data berita..."
            >
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            </BeritaFormTemplate>
        )
    }

    if (!beritaData) {
        return (
            <BeritaFormTemplate
                title="Edit Berita"
                description="Berita tidak ditemukan"
            >
                <div className="text-center py-12">
                    <p className="text-destructive mb-4">Berita tidak ditemukan</p>
                </div>
            </BeritaFormTemplate>
        )
    }

    const initialData = {
        judul_berita: beritaData.judul_berita,
        slug_berita: beritaData.slug_berita,
        isi: beritaData.isi,
        id_kategori: beritaData.id_kategori.toString(),
        status_berita: beritaData.status_berita,
        jenis_berita: beritaData.jenis_berita,
        bahasa: beritaData.bahasa,
        keywords: beritaData.keywords || "",
        thumbnail: beritaData.thumbnail || "",
        gambar: beritaData.gambar || "",
        icon: beritaData.icon || "",
        tanggal_post: beritaData.tanggal_post ?
            new Date(beritaData.tanggal_post).toISOString().slice(0, 16) :
            new Date().toISOString().slice(0, 16),
    }

    return (
        <BeritaFormTemplate
            title="Edit Berita"
            description={`Edit dan perbarui berita: ${beritaData.judul_berita}`}
        >
            <BeritaForm
                initialData={initialData}
                onSubmit={handleSubmit}
                onSaveDraft={handleSaveDraft}
                onPreview={handlePreview}
                isLoading={isLoading}
                mode="edit"
            />
        </BeritaFormTemplate>
    )
}
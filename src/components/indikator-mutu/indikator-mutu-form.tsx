// components/indikator-mutu/indikator-mutu-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
    createIndikatorMutu,
    updateIndikatorMutu,
} from "@/lib/actions/indikator-mutu"
import { IndikatorMutu } from "@/types"

const formSchema = z.object({
    period: z.string().min(1, "Period is required"),
    judul: z.string().min(1, "Judul is required"),
    capaian: z.string().min(1, "Capaian is required"),
    target: z.string().min(1, "Target is required"),
})

type FormData = z.infer<typeof formSchema>

interface IndikatorMutuFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    data?: IndikatorMutu | null
    mode: 'create' | 'edit'
}

export function IndikatorMutuForm({
    open,
    onOpenChange,
    data,
    mode
}: IndikatorMutuFormProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            period: data?.period || "",
            judul: data?.judul || "",
            capaian: data?.capaian || "",
            target: data?.target || "",
        },
    })

    const onSubmit = async (values: FormData) => {
        setLoading(true)

        try {
            let result

            if (mode === 'create') {
                result = await createIndikatorMutu(values)
            } else {
                result = await updateIndikatorMutu({
                    ...values,
                    id: data!.id
                })
            }

            if (result.success) {
                toast.success(result.message)
                onOpenChange(false)
                form.reset()
                router.refresh()
            } else {
                toast.error(result.message)
            }
        } catch {
            toast.error("Terjadi kesalahan")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Tambah' : 'Edit'} Indikator Mutu
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Tambahkan indikator mutu baru.'
                            : 'Edit indikator mutu yang sudah ada.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="period"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Period</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: 2024-01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="judul"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Judul</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Masukkan judul indikator..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="capaian"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Capaian</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: 85%" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="target"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: 90%" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                            >
                                Batal
                            </Button>
                            <LoadingButton type="submit" loading={loading}>
                                {mode === 'create' ? 'Tambah' : 'Simpan'}
                            </LoadingButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
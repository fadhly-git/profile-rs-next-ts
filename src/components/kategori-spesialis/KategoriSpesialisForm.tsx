'use client'

import { useTransition, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/atoms/input'
import { Textarea } from '@/components/atoms/textarea'
import { KategoriSpesialis } from '@/types/kategori-spesialis'
import { createSpesialis, updateSpesialis } from '@/lib/actions/kategori-spesialis'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const schema = z.object({
    nama_spesialis: z.string().min(1, 'Nama spesialis wajib diisi'),
    deskripsi: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    editingItem?: KategoriSpesialis | null
}

export default function KategoriSpesialisForm({ open, onOpenChange, editingItem }: Props) {
    const [isPending, startTransition] = useTransition()
    const isEditing = !!editingItem

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            nama_spesialis: '',
            deskripsi: '',
        },
    })

    // Reset form when dialog opens/closes or editing item changes
    useEffect(() => {
        if (open) {
            if (editingItem) {
                form.reset({
                    nama_spesialis: editingItem.nama_spesialis,
                    deskripsi: editingItem.deskripsi || '',
                })
            } else {
                form.reset({
                    nama_spesialis: '',
                    deskripsi: '',
                })
            }
        }
    }, [open, editingItem, form])

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            try {
                if (isEditing && editingItem) {
                    await updateSpesialis(editingItem.id_spesialis, data)
                    toast.success('Kategori spesialis berhasil diperbarui')
                } else {
                    await createSpesialis(data)
                    toast.success('Kategori spesialis berhasil ditambahkan')
                }

                onOpenChange(false)
                form.reset()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan')
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Kategori Spesialis' : 'Tambah Kategori Spesialis'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Nama Spesialis"
                        placeholder="Contoh: Jantung, Mata, THT"
                        {...form.register('nama_spesialis')}
                        error={form.formState.errors.nama_spesialis?.message}
                        disabled={isPending}
                    />

                    <Textarea
                        label="Deskripsi"
                        placeholder="Deskripsi singkat tentang spesialis ini (opsional)"
                        rows={3}
                        {...form.register('deskripsi')}
                        error={form.formState.errors.deskripsi?.message}
                        disabled={isPending}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {isEditing ? 'Perbarui' : 'Tambah'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
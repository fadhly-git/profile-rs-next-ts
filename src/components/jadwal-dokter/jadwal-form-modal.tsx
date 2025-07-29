/* eslint-disable @typescript-eslint/no-explicit-any */
// components/molecules/jadwal-form-modal.tsx
'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/atoms/input'
import Select from '@/components/atoms/select'
import { JadwalDokter } from '@/types/jadwal'
import { createJadwalDokter, updateJadwalDokter } from '@/lib/actions/jadwal-actions'
import { toast } from 'sonner'

const jadwalSchema = z.object({
    id_dokter: z.string().min(1, 'Dokter harus dipilih'),
    hari: z.string().min(1, 'Hari harus dipilih'),
    jam_mulai: z.string().min(1, 'Jam mulai harus diisi'),
    jam_selesai: z.string().min(1, 'Jam selesai harus diisi'),
    status: z.string().min(1, 'Status harus dipilih'),
}).refine((data) => {
    if (data.jam_mulai && data.jam_selesai) {
        return data.jam_mulai < data.jam_selesai
    }
    return true
}, {
    message: 'Jam mulai harus lebih kecil dari jam selesai',
    path: ['jam_selesai'],
})

interface JadwalFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    jadwal?: JadwalDokter
    dokters: any[]
}

const HARI_OPTIONS = [
    { value: 'Senin', label: 'Senin' },
    { value: 'Selasa', label: 'Selasa' },
    { value: 'Rabu', label: 'Rabu' },
    { value: 'Kamis', label: 'Kamis' },
    { value: 'Jumat', label: 'Jumat' },
    { value: 'Sabtu', label: 'Sabtu' },
    { value: 'Minggu', label: 'Minggu' },
]

const STATUS_OPTIONS = [
    { value: '1', label: 'Aktif' },
    { value: '0', label: 'Tidak Aktif' },
]

export function JadwalFormModal({ open, onOpenChange, jadwal, dokters }: JadwalFormModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const isEdit = !!jadwal

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<z.infer<typeof jadwalSchema>>({
        resolver: zodResolver(jadwalSchema),
        defaultValues: {
            id_dokter: jadwal ? String(jadwal.id_dokter) : '',
            hari: jadwal ? jadwal.hari : '',
            jam_mulai: jadwal ? jadwal.jam_mulai.toTimeString().slice(0, 5) : '',
            jam_selesai: jadwal ? jadwal.jam_selesai.toTimeString().slice(0, 5) : '',
            status: jadwal ? String(jadwal.status) : '1',
        }
    })

    const onSubmit = async (data: z.infer<typeof jadwalSchema>) => {
        setIsLoading(true)

        try {
            const formData = {
                id_dokter: BigInt(data.id_dokter),
                hari: data.hari,
                jam_mulai: data.jam_mulai,
                jam_selesai: data.jam_selesai,
                status: Number(data.status),
            }

            const result = isEdit
                ? await updateJadwalDokter({ ...formData, id_jadwal: jadwal.id_jadwal })
                : await createJadwalDokter(formData)

            if (result.success) {
                toast.success(result.message, {
                    description: "Berhasil",
                })
                onOpenChange(false)
                reset()
            } else {
                toast.error(result.error, {
                    description: "Gagal",
                })
            }
        } catch (error) {
            console.error('Form submission error:', error)
            toast.error("Terjadi kesalahan sistem", {
                description: "Gagal",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const dokterOptions = dokters.map(dokter => ({
        value: String(dokter.id_dokter),
        label: `${dokter.nama_dokter} - ${dokter.dokter_spesialis.map((ds: any) => ds.spesialis.nama_spesialis).join(', ')}`
    }))

    // Reset form when modal opens with new data
    useEffect(() => {
        if (open) {
            reset({
                id_dokter: jadwal ? String(jadwal.id_dokter) : '',
                hari: jadwal ? jadwal.hari : '',
                jam_mulai: jadwal ? jadwal.jam_mulai.toTimeString().slice(0, 5) : '',
                jam_selesai: jadwal ? jadwal.jam_selesai.toTimeString().slice(0, 5) : '',
                status: jadwal ? String(jadwal.status) : '1',
            })
        }
    }, [open, jadwal, reset])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Jadwal Dokter' : 'Tambah Jadwal Dokter'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Perbarui informasi jadwal dokter'
                            : 'Tambahkan jadwal dokter baru ke sistem'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Controller
                        name="id_dokter"
                        control={control}
                        render={({ field }) => (
                            <Select
                                className="w-full"
                                label="Dokter"
                                options={dokterOptions}
                                error={errors.id_dokter?.message}
                                placeholder="Pilih dokter..."
                                value={field.value}
                                onValueChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        name="hari"
                        control={control}
                        render={({ field }) => (
                            <Select
                                className="w-full"
                                label="Hari"
                                options={HARI_OPTIONS}
                                error={errors.hari?.message}
                                placeholder="Pilih hari..."
                                value={field.value}
                                onValueChange={field.onChange}
                            />
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="time"
                            label="Jam Mulai"
                            error={errors.jam_mulai?.message}
                            {...register('jam_mulai')}
                        />

                        <Input
                            type="time"
                            label="Jam Selesai"
                            error={errors.jam_selesai?.message}
                            {...register('jam_selesai')}
                        />
                    </div>

                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Status"
                                options={STATUS_OPTIONS}
                                error={errors.status?.message}
                                placeholder="Pilih status..."
                                value={field.value}
                                onValueChange={field.onChange}
                            />
                        )}
                    />

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
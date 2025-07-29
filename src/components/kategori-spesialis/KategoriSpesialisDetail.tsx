'use client'

import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { KategoriSpesialisWithDokter } from '@/types/kategori-spesialis'
import { getSpesialisById } from '@/lib/actions/kategori-spesialis'
import { Users } from 'lucide-react'
import Image from 'next/image'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    spesialisId: string | null
}

export default function KategoriSpesialisDetail({ open, onOpenChange, spesialisId }: Props) {
    const [data, setData] = useState<KategoriSpesialisWithDokter | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (open && spesialisId) {
            setIsLoading(true)
            getSpesialisById(spesialisId)
                .then(setData)
                .finally(() => setIsLoading(false))
        } else {
            setData(null)
        }
    }, [open, spesialisId])

    if (!open) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detail Kategori Spesialis</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                ) : data ? (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    ID
                                </label>
                                <div className="mt-1">
                                    <Badge variant="outline" className="font-mono">
                                        {data.id_spesialis}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Nama Spesialis
                                </label>
                                <p className="mt-1 font-medium">{data.nama_spesialis}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Deskripsi
                                </label>
                                <p className="mt-1 text-sm">
                                    {data.deskripsi || 'Tidak ada deskripsi'}
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="h-4 w-4" />
                                <h3 className="font-medium">Dokter dengan Spesialis Ini</h3>
                                <Badge variant="secondary">
                                    {data.dokter_spesialis.length}
                                </Badge>
                            </div>

                            {data.dokter_spesialis.length > 0 ? (
                                <div className="space-y-2">
                                    {data.dokter_spesialis.map((ds) => (
                                        <Card key={ds.id_dokter} className="p-3">
                                            <CardHeader>
                                                <CardTitle className="text-sm font-medium">
                                                    {ds.dokter.nama_dokter}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex items-center gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                        {ds.dokter.photo ? (
                                                            <Image
                                                                width={40}
                                                                height={40}
                                                                style={{ borderRadius: '50%' }}
                                                                src={ds.dokter.photo}
                                                                alt={ds.dokter.nama_dokter}
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-sm font-medium">
                                                                {ds.dokter.nama_dokter.charAt(0)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <CardDescription className="text-sm text-muted-foreground">
                                                        <div>
                                                            <p className="font-medium">{ds.dokter.nama_dokter}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                ID: {ds.dokter.id_dokter}
                                                            </p>
                                                        </div>
                                                    </CardDescription>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">
                                    Belum ada dokter yang menggunakan spesialis ini
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">
                        Data tidak ditemukan
                    </p>
                )}
            </DialogContent>
        </Dialog>
    )
}
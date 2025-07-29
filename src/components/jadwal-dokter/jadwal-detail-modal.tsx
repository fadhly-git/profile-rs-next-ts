// components/molecules/jadwal-detail-modal.tsx
'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { JadwalDokter } from '@/types/jadwal'

interface JadwalDetailModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    jadwal?: JadwalDokter
}

export function JadwalDetailModal({ open, onOpenChange, jadwal }: JadwalDetailModalProps) {
    if (!jadwal) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Detail Jadwal Dokter</DialogTitle>
                    <DialogDescription>
                        Informasi lengkap jadwal dokter
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={jadwal.dokter.photo} />
                            <AvatarFallback>
                                {jadwal.dokter.nama_dokter.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold">{jadwal.dokter.nama_dokter}</h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {jadwal.dokter.dokter_spesialis.map((ds) => (
                                    <Badge key={ds.spesialis.nama_spesialis} variant="secondary" className="text-xs">
                                        {ds.spesialis.nama_spesialis}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Hari</label>
                            <p className="text-sm font-semibold">{jadwal.hari}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                            <div className="mt-1">
                                <Badge variant={jadwal.status === 1 ? "default" : "secondary"}>
                                    {jadwal.status === 1 ? 'Aktif' : 'Tidak Aktif'}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Jam Mulai</label>
                            <p className="text-sm font-semibold">
                                {jadwal.jam_mulai.toTimeString().slice(0, 5)}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Jam Selesai</label>
                            <p className="text-sm font-semibold">
                                {jadwal.jam_selesai.toTimeString().slice(0, 5)}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
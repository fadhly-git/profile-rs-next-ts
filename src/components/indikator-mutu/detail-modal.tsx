// components/indikator-mutu/detail-modal.tsx
"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Calendar,
    Target,
    TrendingUp,
    Clock,
    Edit,
    Award,
    BarChart3
} from "lucide-react"
import { type IndikatorMutu } from "@/types"
import { formatDate } from "@/lib/utils"
import { BadgeStatus } from "@/components/ui/badge-status"
import { MainScrollArea } from "../main-scroll"
import React from "react"

interface DetailModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: IndikatorMutu | null
    onEdit?: (data: IndikatorMutu) => void
}

const getStatusInfo = (capaian: string, target: string) => {
    const capaianNum = parseFloat(capaian.replace(/[^\d.]/g, '')) || 0
    const targetNum = parseFloat(target.replace(/[^\d.]/g, '')) || 0
    const percentage = targetNum > 0 ? (capaianNum / targetNum) * 100 : (capaianNum > 0 ? 100 : 0)

    if (capaianNum >= targetNum) {
        return {
            status: 'success' as const,
            label: 'Target Tercapai',
            icon: <Award className="h-4 w-4" />,
            percentage: percentage.toFixed(1)
        }
    } else if (capaianNum >= targetNum * 0.8) {
        return {
            status: 'warning' as const,
            label: 'Hampir Tercapai',
            icon: <TrendingUp className="h-4 w-4" />,
            percentage: percentage.toFixed(1)
        }
    } else {
        return {
            status: 'danger' as const,
            label: 'Belum Tercapai',
            icon: <BarChart3 className="h-4 w-4" />,
            percentage: percentage.toFixed(1)
        }
    }
}

const ProgressBar = ({ percentage }: { percentage: number }) => {
    const getProgressColor = (pct: number) => {
        if (pct >= 100) return 'bg-green-500 dark:bg-green-400'
        if (pct >= 80) return 'bg-yellow-500 dark:bg-yellow-400'
        return 'bg-red-500 dark:bg-red-400'
    }
    // Progress bar bisa melebihi 100% secara visual, jadi kita clamp di 100 untuk width
    const clampedPercentage = Math.min(percentage, 100)

    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
                className={`h-full transition-all duration-500 ease-out ${getProgressColor(percentage)}`}
                style={{ width: `${clampedPercentage}%` }}
            />
        </div>
    )
}

const InfoCard = ({
    icon,
    label,
    value,
    description
}: {
    icon: React.ReactNode
    label: string
    value: string
    description?: string
}) => (
    <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex-shrink-0 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-600">
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{value}</p>
            {description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            )}
        </div>
    </div>
)

export function DetailModal({ open, onOpenChange, data, onEdit }: DetailModalProps) {
    if (!data) return null

    const statusInfo = getStatusInfo(data.capaian || '0', data.target || '0')
    const progressPercentage = parseFloat(statusInfo.percentage)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:!max-w-[600px] max-h-[90vh] flex flex-col p-0">

                <DialogHeader className="p-6 pb-4 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                Detail Indikator Mutu
                            </DialogTitle>
                            <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {data.period}
                                </Badge>
                                <BadgeStatus status={statusInfo.status}>
                                    {statusInfo.icon}
                                    <span className="ml-1">{statusInfo.label}</span>
                                </BadgeStatus>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {/* === LETAK PERBAIKAN UTAMA === */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="p-6 space-y-8">
                        {/* Judul Section */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <div className="h-1 w-8 bg-blue-600 dark:bg-blue-500 rounded-full" />
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Informasi Umum</h3>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Judul Indikator</h4>
                                <p className="text-blue-800 dark:text-blue-300 leading-relaxed">{data.judul}</p>
                            </div>
                        </div>

                        <Separator className="dark:bg-gray-700" />

                        {/* Performance Section */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="h-1 w-8 bg-green-600 dark:bg-green-500 rounded-full" />
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Kinerja</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard
                                    icon={<TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                                    label="Capaian"
                                    value={data.capaian || '-'}
                                    description="Hasil aktual yang dicapai"
                                />
                                <InfoCard
                                    icon={<Target className="h-5 w-5 text-green-600 dark:text-green-400" />}
                                    label="Target"
                                    value={data.target || '-'}
                                    description="Target yang ditetapkan"
                                />
                            </div>
                            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Progress Pencapaian
                                    </span>
                                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                        {statusInfo.percentage}%
                                    </span>
                                </div>
                                <ProgressBar percentage={progressPercentage} />
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>0%</span>
                                    <span className="flex items-center space-x-1">
                                        {statusInfo.icon}
                                        <span>{statusInfo.label}</span>
                                    </span>
                                    <span>100%+</span>
                                </div>
                            </div>
                        </div>

                        <Separator className="dark:bg-gray-700" />

                        {/* Timeline Section */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="h-1 w-8 bg-purple-600 dark:bg-purple-500 rounded-full" />
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Timeline</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard
                                    icon={<Clock className="h-5 w-5 text-green-600 dark:text-green-400" />}
                                    label="Dibuat"
                                    value={formatDate(data.createdAt)}
                                    description="Tanggal pembuatan record"
                                />
                                <InfoCard
                                    icon={<Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                                    label="Terakhir Diupdate"
                                    value={formatDate(data.updatedAt)}
                                    description="Tanggal pembaruan terakhir"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Tutup
                        </Button>
                        {onEdit && (
                            <Button
                                onClick={() => {
                                    if (data) {
                                        onEdit(data)
                                        onOpenChange(false)
                                    }
                                }}
                                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Data
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

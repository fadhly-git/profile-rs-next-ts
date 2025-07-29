// app/admin/dokter/_components/spesialis-management.tsx
"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/atoms/input"
import { Textarea } from "@/components/atoms/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, Stethoscope, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { createSpesialis, deleteSpesialis } from "@/lib/actions/kategori-spesialis"

interface SpesialisData {
    id_spesialis: string
    nama_spesialis: string
    deskripsi?: string | null
}

interface SpesialisManagementProps {
    spesialisList: SpesialisData[]
    onUpdate: () => void
}

const MAX_DESKRIPSI_LENGTH = 150

export function SpesialisManagement({ spesialisList, onUpdate }: SpesialisManagementProps) {
    const [isPending, startTransition] = useTransition()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        nama_spesialis: "",
        deskripsi: ""
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.nama_spesialis.trim()) {
            newErrors.nama_spesialis = "Nama spesialis harus diisi"
        }

        if (formData.deskripsi.length > MAX_DESKRIPSI_LENGTH) {
            newErrors.deskripsi = `Deskripsi tidak boleh lebih dari ${MAX_DESKRIPSI_LENGTH} karakter`
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        startTransition(async () => {
            try {
                await createSpesialis({
                    nama_spesialis: formData.nama_spesialis,
                    deskripsi: formData.deskripsi || undefined
                })

                toast.success("Spesialis berhasil ditambahkan")
                setFormData({ nama_spesialis: "", deskripsi: "" })
                setIsDialogOpen(false)
                onUpdate()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Gagal menambahkan spesialis")
            }
        })
    }

    const handleDelete = async (id: string) => {
        startTransition(async () => {
            try {
                await deleteSpesialis(id)
                toast.success("Spesialis berhasil dihapus")
                setDeleteId(null)
                onUpdate()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Gagal menghapus spesialis")
            }
        })
    }

    const handleInputChange = (field: string, value: string) => {
        // Batasi input deskripsi
        if (field === "deskripsi" && value.length > MAX_DESKRIPSI_LENGTH) {
            return
        }

        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    const remainingChars = MAX_DESKRIPSI_LENGTH - formData.deskripsi.length

    return (
        <Card className="shadow-sm max-w-3xl">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2  rounded-lg">
                            <Settings className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-sm">Kelola Spesialis</CardTitle>
                            <CardDescription className="text-xs">
                                Tambah kategori spesialis baru
                            </CardDescription>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="shrink-0 text-sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Tambah Spesialis Baru</DialogTitle>
                                <DialogDescription>
                                    Buat kategori spesialis baru untuk dokter
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="Nama Spesialis"
                                    value={formData.nama_spesialis}
                                    onChange={(e) => handleInputChange("nama_spesialis", e.target.value)}
                                    error={errors.nama_spesialis}
                                    placeholder="Contoh: Kardiologi"
                                    required
                                />

                                <div className="space-y-2">
                                    <Textarea
                                        label="Deskripsi (Opsional)"
                                        value={formData.deskripsi}
                                        onChange={(e) => handleInputChange("deskripsi", e.target.value)}
                                        placeholder="Deskripsi singkat tentang spesialis ini..."
                                        rows={3}
                                        error={errors.deskripsi}
                                    />
                                    <div className="flex justify-between items-center text-xs">
                                        <span className={`${remainingChars < 0 ? 'text-destructive' : remainingChars < 20 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                                            {formData.deskripsi.length}/{MAX_DESKRIPSI_LENGTH} karakter
                                        </span>
                                        {remainingChars >= 0 && (
                                            <span className="text-muted-foreground">
                                                Sisa: {remainingChars}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </form>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    disabled={isPending}
                                >
                                    Batal
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isPending}
                                >
                                    {isPending ? "Menyimpan..." : "Simpan"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                    {spesialisList.length > 0 ? (
                        spesialisList.map((spesialis) => (
                            <div
                                key={spesialis.id_spesialis}
                                className="flex items-start gap-3 p-3 rounded-lg transition-colors"
                            >
                                <div className="p-1 rounded mt-0.5">
                                    <Stethoscope className="h-3 w-3 text-blue-600" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            #{spesialis.id_spesialis}
                                        </Badge>
                                        <h4 className="font-medium text-sm truncate">
                                            {spesialis.nama_spesialis}
                                        </h4>
                                    </div>
                                    {spesialis.deskripsi && (
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {spesialis.deskripsi}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setDeleteId(spesialis.id_spesialis)}
                                    className="text-destructive hover:text-destructive h-8 w-8 p-0 shrink-0"
                                    disabled={isPending}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-3">
                                <Stethoscope className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="font-medium">Belum ada spesialis</p>
                            <p className="text-sm">Klik &quot;Tambah&quot; untuk membuat spesialis baru</p>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus spesialis ini?
                            Spesialis yang masih digunakan oleh dokter tidak dapat dihapus.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteId && handleDelete(deleteId)}
                            disabled={isPending}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isPending ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}
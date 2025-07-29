// components/indikator-mutu/indikator-mutu-form.tsx
"use client"

import { useEffect, useState } from "react"
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
    FormDescription,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
    createIndikatorMutu,
    updateIndikatorMutu,
} from "@/lib/actions/indikator-mutu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { type IndikatorMutu } from "@/types"

const formSchema = z.object({
    period: z.string().regex(/^\d{4}-\d{2}$/, "Format harus YYYY-MM"),
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
    uniqueJuduls: string[]
}

export function IndikatorMutuForm({
    open,
    onOpenChange,
    data,
    mode,
    uniqueJuduls
}: IndikatorMutuFormProps) {
    const [loading, setLoading] = useState(false)
    const [openCombobox, setOpenCombobox] = useState(false)

    // State untuk tahun dan bulan terpisah
    const [selectedYear, setSelectedYear] = useState<string>("")
    const [selectedMonth, setSelectedMonth] = useState<string>("")

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            period: data?.period || "",
            judul: data?.judul || "",
            capaian: data?.capaian || "",
            target: data?.target || "",
        },
    })

    useEffect(() => {
        if (data && mode === 'edit') {
            // Update form values
            form.reset({
                period: data.period || "",
                judul: data.judul || "",
                capaian: data.capaian || "",
                target: data.target || "",
            })

            // Update year dan month state
            if (data.period) {
                const [year, month] = data.period.split('-')
                setSelectedYear(year)
                setSelectedMonth(month)
            }
        } else if (mode === 'create') {
            // Reset form untuk create mode
            form.reset({
                period: "",
                judul: "",
                capaian: "",
                target: "",
            })

            // Set default year untuk create
            const currentYear = new Date().getFullYear().toString()
            setSelectedYear(currentYear)
            setSelectedMonth("")
        }
    }, [data, mode, form])

    // Tambahkan useEffect untuk reset ketika modal ditutup:
    useEffect(() => {
        if (!open) {
            setSelectedYear("")
            setSelectedMonth("")
        }
    }, [open])

    // Daftar bulan
    const months = [
        { value: "01", label: "Januari" },
        { value: "02", label: "Februari" },
        { value: "03", label: "Maret" },
        { value: "04", label: "April" },
        { value: "05", label: "Mei" },
        { value: "06", label: "Juni" },
        { value: "07", label: "Juli" },
        { value: "08", label: "Agustus" },
        { value: "09", label: "September" },
        { value: "10", label: "Oktober" },
        { value: "11", label: "November" },
        { value: "12", label: "Desember" },
    ]

    // Generate tahun (dari 2020 sampai 10 tahun ke depan)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - 2020 + 11 }, (_, i) => {
        const year = 2020 + i
        return { value: year.toString(), label: year.toString() }
    })

    // Update period ketika tahun atau bulan berubah
    const updatePeriod = (year: string, month: string) => {
        if (year && month) {
            const period = `${year}-${month}`
            form.setValue("period", period)
        }
    }

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
                // router.refresh()
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
            <DialogContent className="sm:!max-w-[500px]">
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
                        {/* Period Field dengan Dropdown Terpisah */}
                        <FormField
                            control={form.control}
                            name="period"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Period</FormLabel>
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Select Tahun */}
                                        <div>
                                            <Select
                                                value={selectedYear}
                                                onValueChange={(value) => {
                                                    setSelectedYear(value)
                                                    updatePeriod(value, selectedMonth)
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Tahun" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {years.map((year) => (
                                                        <SelectItem key={year.value} value={year.value}>
                                                            {year.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Select Bulan */}
                                        <div>
                                            <Select
                                                value={selectedMonth}
                                                onValueChange={(value) => {
                                                    setSelectedMonth(value)
                                                    updatePeriod(selectedYear, value)
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Bulan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {months.map((month) => (
                                                        <SelectItem key={month.value} value={month.value}>
                                                            {month.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Preview Period */}
                                    {field.value && (
                                        <div className="text-sm text-muted-foreground">
                                            Preview: {field.value}
                                        </div>
                                    )}

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Judul dengan Combobox */}
                        <FormField
                            control={form.control}
                            name="judul"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Judul</FormLabel>
                                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? uniqueJuduls.find(
                                                            (judul) => judul.toLowerCase() === field.value.toLowerCase()
                                                        ) || field.value
                                                        : "Pilih atau ketik judul..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Cari judul..."
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                />
                                                <CommandEmpty>
                                                    {field.value ? (
                                                        <div className="p-2 text-sm">
                                                            <span className="text-gray-500">Gunakan: </span>
                                                            <span className="font-medium">&quot;{field.value}&quot;</span>
                                                            <span className="text-gray-500"> (baru)</span>
                                                        </div>
                                                    ) : (
                                                        "Judul tidak ditemukan."
                                                    )}
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {uniqueJuduls.map((judul) => (
                                                        <CommandItem
                                                            value={judul}
                                                            key={judul}
                                                            onSelect={() => {
                                                                form.setValue("judul", judul)
                                                                setOpenCombobox(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    judul.toLowerCase() === field.value?.toLowerCase()
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {judul}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Pilih judul yang sudah ada atau ketik untuk menambahkan yang baru.
                                    </FormDescription>
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
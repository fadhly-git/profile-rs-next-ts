/* eslint-disable @typescript-eslint/no-explicit-any */
// components/indikator-mutu/smart-form.tsx
"use client"

import { useState, useEffect } from "react"
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
    FormDescription,
} from "@/components/ui/form"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { Check, ChevronsUpDown, Plus, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    createIndikatorMutu,
    updateIndikatorMutu,
    getExistingTitles,
    getPeriodsForTitle,
    checkDuplicateEntry,
} from "@/lib/actions/indikator-mutu"
import { type IndikatorMutu } from "@/types"

const formSchema = z.object({
    period: z.string().min(1, "Period is required").regex(
        /^(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)$/,
        "Format bulan tidak valid"
    ),
    judul: z.string().min(1, "Judul is required"),
    capaian: z.string().min(1, "Capaian is required"),
    target: z.string().min(1, "Target is required"),
})

type FormData = z.infer<typeof formSchema>

interface SmartFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    data?: IndikatorMutu | null
    mode: 'create' | 'edit'
}

const MONTHS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

export function SmartIndikatorMutuForm({
    open,
    onOpenChange,
    data,
    mode
}: SmartFormProps) {
    const [loading, setLoading] = useState(false)
    const [existingTitles, setExistingTitles] = useState<string[]>([])
    const [existingPeriods, setExistingPeriods] = useState<string[]>([])
    const [openTitleCombo, setOpenTitleCombo] = useState(false)
    const [openPeriodCombo, setOpenPeriodCombo] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedTitle, setSelectedTitle] = useState("")
    const [isNewTitle, setIsNewTitle] = useState(true)
    const [duplicateWarning, setDuplicateWarning] = useState(false)
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

    const watchedJudul = form.watch("judul")
    const watchedPeriod = form.watch("period")

    // Load existing titles on mount
    useEffect(() => {
        const loadTitles = async () => {
            const titles = await getExistingTitles()
            setExistingTitles(titles)
        }
        if (open) {
            loadTitles()
        }
    }, [open])

    // Load periods when title changes
    useEffect(() => {
        const loadPeriods = async () => {
            if (watchedJudul && existingTitles.includes(watchedJudul)) {
                const periods = await getPeriodsForTitle(watchedJudul)
                setExistingPeriods(periods)
                setIsNewTitle(false)
            } else {
                setExistingPeriods([])
                setIsNewTitle(true)
            }
        }

        if (watchedJudul) {
            loadPeriods()
        }
    }, [watchedJudul, existingTitles])

    // Check for duplicates
    useEffect(() => {
        const checkDuplicate = async () => {
            if (watchedJudul && watchedPeriod && mode === 'create') {
                const isDupe = await checkDuplicateEntry(watchedJudul, watchedPeriod)
                setDuplicateWarning(isDupe)
            } else {
                setDuplicateWarning(false)
            }
        }

        if (watchedJudul && watchedPeriod) {
            checkDuplicate()
        }
    }, [watchedJudul, watchedPeriod, mode])

    const onSubmit = async (values: FormData) => {
        if (duplicateWarning && mode === 'create') {
            toast.error("Data sudah ada, pilih periode yang berbeda")
            return
        }

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

    const handleTitleSelect = (title: string) => {
        form.setValue("judul", title)
        setSelectedTitle(title)
        setOpenTitleCombo(false)

        // Auto-suggest next available month
        if (existingTitles.includes(title)) {
            // Logic to suggest next month
            const usedMonths = existingPeriods
            const availableMonths = MONTHS.filter(month => !usedMonths.includes(month))
            if (availableMonths.length > 0) {
                form.setValue("period", availableMonths[0])
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Tambah' : 'Edit'} Indikator Mutu
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Pilih judul yang sudah ada atau buat baru. Sistem akan membantu mencegah duplikasi data.'
                            : 'Edit indikator mutu yang sudah ada.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Judul Field dengan Autocomplete */}
                        <FormField
                            control={form.control}
                            name="judul"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Judul Indikator</FormLabel>
                                    <Popover open={openTitleCombo} onOpenChange={setOpenTitleCombo}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openTitleCombo}
                                                    className={cn(
                                                        "justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value || "Pilih atau ketik judul baru..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Cari atau ketik judul baru..."
                                                    value={field.value}
                                                    onValueChange={(value: any) => {
                                                        field.onChange(value)
                                                        setIsNewTitle(!existingTitles.includes(value))
                                                    }}
                                                />
                                                <CommandList>
                                                    {existingTitles.length > 0 && (
                                                        <CommandGroup heading="Judul yang sudah ada">
                                                            {existingTitles.map((title) => (
                                                                <CommandItem
                                                                    key={title}
                                                                    value={title}
                                                                    onSelect={() => handleTitleSelect(title)}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            field.value === title ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {title}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    )}

                                                    {field.value && !existingTitles.includes(field.value) && (
                                                        <CommandGroup heading="Buat judul baru">
                                                            <CommandItem
                                                                value={field.value}
                                                                onSelect={() => handleTitleSelect(field.value)}
                                                            >
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Buat &quot;{field.value}&quot;
                                                            </CommandItem>
                                                        </CommandGroup>
                                                    )}

                                                    {!field.value && existingTitles.length === 0 && (
                                                        <CommandEmpty>Belum ada judul tersimpan.</CommandEmpty>
                                                    )}
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    {!isNewTitle && (
                                        <FormDescription className="flex items-center gap-2">
                                            <Info className="h-4 w-4 text-blue-500" />
                                            <span>Menambah periode baru untuk judul yang sudah ada</span>
                                        </FormDescription>
                                    )}

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Period dengan suggestion */}
                        <FormField
                            control={form.control}
                            name="period"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Bulan</FormLabel>
                                    <Popover open={openPeriodCombo} onOpenChange={setOpenPeriodCombo}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openPeriodCombo}
                                                    className={cn(
                                                        "justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value || "Pilih bulan..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Cari bulan..." />
                                                <CommandList>
                                                    <CommandGroup heading="Semua Bulan">
                                                        {MONTHS.map((month) => {
                                                            const isUsed = existingPeriods.includes(month)
                                                            return (
                                                                <CommandItem
                                                                    key={month}
                                                                    value={month}
                                                                    onSelect={() => {
                                                                        form.setValue("period", month)
                                                                        setOpenPeriodCombo(false)
                                                                    }}
                                                                    disabled={isUsed && !isNewTitle}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            field.value === month ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <span className={cn(isUsed && !isNewTitle && "line-through opacity-50")}>
                                                                        {month}
                                                                    </span>
                                                                    {isUsed && !isNewTitle && (
                                                                        <Badge variant="secondary" className="ml-auto text-xs">
                                                                            Sudah ada
                                                                        </Badge>
                                                                    )}
                                                                </CommandItem>
                                                            )
                                                        })}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    {existingPeriods.length > 0 && (
                                        <FormDescription>
                                            Periode yang sudah ada: {existingPeriods.join(", ")}
                                        </FormDescription>
                                    )}

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Duplicate Warning */}
                        {duplicateWarning && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Data untuk &quot;{watchedJudul}&quot; pada bulan &quot;{watchedPeriod}&quot; sudah ada.
                                    Pilih bulan yang berbeda atau edit data yang sudah ada.
                                </AlertDescription>
                            </Alert>
                        )}

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
                            <LoadingButton
                                type="submit"
                                loading={loading}
                                disabled={duplicateWarning && mode === 'create'}
                            >
                                {mode === 'create' ? 'Tambah' : 'Simpan'}
                            </LoadingButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
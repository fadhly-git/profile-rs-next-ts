/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
    Search,
    Filter,
    X,
    Calendar,
    Tag,
    RotateCcw,
    ChevronDown,
    ChevronUp
} from 'lucide-react'

interface Category {
    id_kategori: number
    nama_kategori: string
    slug_kategori: string
}

interface BeritaSearchFilterProps {
    categories: Category[]
    totalResults: number
    isLoading?: boolean
    onFiltersChange?: (filters: any) => void
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

export default function BeritaSearchFilter({
    categories,
    totalResults,
    isLoading = false,
    onFiltersChange
}: BeritaSearchFilterProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // State management
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('kategori') || '')
    const [selectedYear, setSelectedYear] = useState(searchParams.get('tahun') || '')
    const [selectedMonth, setSelectedMonth] = useState(searchParams.get('bulan') || '')
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'terbaru')
    const [isExpanded, setIsExpanded] = useState(false)

    // Debounced search term
    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    // Build URL with filters
    const buildFilterUrl = useCallback((filters: Record<string, string>) => {
        const params = new URLSearchParams()

        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== '' && value !== 'all') {
                params.set(key, value)
            }
        })

        // Remove page param when filters change
        params.delete('page')

        const queryString = params.toString()
        return `${pathname}${queryString ? `?${queryString}` : ''}`
    }, [pathname])

    // Apply filters function
    const applyFilters = useCallback(() => {
        const filters = {
            search: debouncedSearchTerm,
            kategori: selectedCategory,
            tahun: selectedYear,
            bulan: selectedMonth,
            sort: sortBy
        }

        // Analytics tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'search_filter', {
                event_category: 'Filter',
                event_label: `Search: ${debouncedSearchTerm}, Category: ${selectedCategory}`,
                search_term: debouncedSearchTerm,
                category: selectedCategory
            })
        }

        // Custom callback
        if (onFiltersChange) {
            onFiltersChange(filters)
        }

        // Navigate with new filters
        const url = buildFilterUrl(filters)
        router.push(url)
    }, [
        debouncedSearchTerm,
        selectedCategory,
        selectedYear,
        selectedMonth,
        sortBy,
        buildFilterUrl,
        router,
        onFiltersChange
    ])

    // Apply filters when debounced search changes
    useEffect(() => {
        applyFilters()
    }, [debouncedSearchTerm])

    // Apply filters when other filters change
    useEffect(() => {
        applyFilters()
    }, [selectedCategory, selectedYear, selectedMonth, sortBy])

    // Clear all filters
    const clearFilters = useCallback(() => {
        setSearchTerm('')
        setSelectedCategory('')
        setSelectedYear('')
        setSelectedMonth('')
        setSortBy('terbaru')

        // Navigate to clean URL
        router.push(pathname)
    }, [router, pathname])

    // Check if any filters are active
    const hasActiveFilters = searchTerm ||
        (selectedCategory && selectedCategory !== 'all') ||
        (selectedYear && selectedYear !== 'all') ||
        (selectedMonth && selectedMonth !== 'all') ||
        sortBy !== 'terbaru'

    // Generate years array (last 5 years)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

    // Months array
    const months = [
        { value: '1', label: 'Januari' },
        { value: '2', label: 'Februari' },
        { value: '3', label: 'Maret' },
        { value: '4', label: 'April' },
        { value: '5', label: 'Mei' },
        { value: '6', label: 'Juni' },
        { value: '7', label: 'Juli' },
        { value: '8', label: 'Agustus' },
        { value: '9', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' }
    ]

    // Sort options
    const sortOptions = [
        { value: 'terbaru', label: 'Terbaru' },
        { value: 'terlama', label: 'Terlama' },
        { value: 'terpopuler', label: 'Terpopuler' },
        { value: 'judul', label: 'Judul A-Z' }
    ]

    return (
        <Card className="mb-8">
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5 text-[#07b8b2]" />
                        <h3 className="text-lg font-semibold text-gray-900">Filter & Pencarian</h3>
                        {totalResults > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {totalResults.toLocaleString()} hasil
                            </Badge>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="lg:hidden"
                    >
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </Button>
                </div>

                {/* Search Input - Always visible */}
                <div className="mb-4">
                    <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
                        Pencarian
                    </Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            id="search"
                            placeholder="Cari berita, artikel, atau topik..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4"
                            disabled={isLoading}
                        />
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filters - Responsive Layout */}
                <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden'} lg:block`}>
                    {/* Row 1: Category and Sort */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Category Filter */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                Kategori
                            </Label>
                            <Select
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua kategori</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id_kategori} value={category.slug_kategori}>
                                            <div className="flex items-center space-x-2">
                                                <Tag className="w-3 h-3" />
                                                <span>{category.nama_kategori}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                Urutkan
                            </Label>
                            <Select
                                value={sortBy}
                                onValueChange={setSortBy}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {sortOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Row 2: Date Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Year Filter */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                Tahun
                            </Label>
                            <Select
                                value={selectedYear}
                                onValueChange={setSelectedYear}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua tahun</SelectItem>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-3 h-3" />
                                                <span>{year}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Month Filter */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                Bulan
                            </Label>
                            <Select
                                value={selectedMonth}
                                onValueChange={setSelectedMonth}
                                disabled={isLoading || !selectedYear}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua bulan</SelectItem>
                                    {months.map((month) => (
                                        <SelectItem key={month.value} value={month.value}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Active Filters & Clear Button */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm text-gray-600">Filter aktif:</span>

                                {searchTerm && (
                                    <Badge variant="secondary" className="flex items-center space-x-1">
                                        <Search className="w-3 h-3" />
                                        <span>&quot;{searchTerm}&quot;</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSearchTerm('')}
                                            className="h-4 w-4 p-0 hover:bg-transparent"
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </Badge>
                                )}

                                {selectedCategory && (
                                    <Badge variant="secondary" className="flex items-center space-x-1">
                                        <Tag className="w-3 h-3" />
                                        <span>{categories.find(c => c.slug_kategori === selectedCategory)?.nama_kategori}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedCategory('')}
                                            className="h-4 w-4 p-0 hover:bg-transparent"
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </Badge>
                                )}

                                {selectedYear && (
                                    <Badge variant="secondary" className="flex items-center space-x-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{selectedYear}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedYear('')}
                                            className="h-4 w-4 p-0 hover:bg-transparent"
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </Badge>
                                )}

                                {selectedMonth && (
                                    <Badge variant="secondary" className="flex items-center space-x-1">
                                        <span>{months.find(m => m.value === selectedMonth)?.label}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedMonth('')}
                                            className="h-4 w-4 p-0 hover:bg-transparent"
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </Badge>
                                )}

                                {sortBy !== 'terbaru' && (
                                    <Badge variant="secondary" className="flex items-center space-x-1">
                                        <span>{sortOptions.find(s => s.value === sortBy)?.label}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSortBy('terbaru')}
                                            className="h-4 w-4 p-0 hover:bg-transparent"
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </Badge>
                                )}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                disabled={isLoading}
                                className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span>Reset Filter</span>
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
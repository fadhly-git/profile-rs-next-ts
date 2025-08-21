/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useSearchParams } from 'next/navigation'
import BeritaSearchFilter from '@/components/berita-search-filter'
import BeritaPagination from '@/components/berita-pagination'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Calendar,
    Eye,
    ChevronRight,
    FileText,
    Newspaper,
    Users,
    Search
} from 'lucide-react'

interface Category {
    id_kategori: bigint
    nama_kategori: string
    slug_kategori: string
    keterangan?: string | null
    parent?: {
        nama_kategori: string
        slug_kategori: string
    } | null
    children?: unknown[]
    beritas: unknown[]
    Halaman: unknown[]
}

interface CategoryPageClientProps {
    category: Category
    allCategories: Array<{
        id_kategori: string
        nama_kategori: string
        slug_kategori: string
    }>
}

// News/Article Card Component
function NewsCard({
    title,
    excerpt,
    href,
    date,
    views,
    image,
    category
}: {
    title: string
    excerpt?: string
    href: string
    date?: Date | null
    views?: number | null
    image?: string | null
    category?: string
}) {
    return (
        <Card className="group hover:border-[#07b8b2] hover:shadow-lg transition-all duration-300 overflow-hidden">
            {image && (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                    <Image
                        src={image}
                        alt={title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}

            <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#07b8b2] transition-colors line-clamp-2 leading-tight">
                            {title}
                        </h3>
                        {excerpt && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                                {excerpt.replace(/<[^>]*>/g, '').substring(0, 150)}...
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {date && (
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(date).toLocaleDateString('id-ID')}</span>
                                </div>
                            )}
                            {views !== null && (
                                <div className="flex items-center space-x-1">
                                    <Eye className="w-3 h-3" />
                                    <span>{views || 0}</span>
                                </div>
                            )}
                            {category && (
                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                    {category}
                                </span>
                            )}
                        </div>

                        <Link href={href} className="text-[#07b8b2] hover:text-teal-700 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function CategoryPageClient({ category, allCategories }: CategoryPageClientProps) {
    const searchParams = useSearchParams()
    
    // Extract search parameters
    const currentPage = Number(searchParams.get('page')) || 1
    const searchTerm = searchParams.get('search') || ''
    const yearFilter = searchParams.get('tahun') || ''
    const monthFilter = searchParams.get('bulan') || ''
    const sortBy = searchParams.get('sort') || 'terbaru'
    const itemsPerPage = 10

    // Helper function untuk filtering berita
    const filterBerita = (beritas: any[], searchTerm: string, yearFilter: string, monthFilter: string, sortBy: string) => {
        let filtered = [...beritas]

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(berita => 
                berita.judul_berita.toLowerCase().includes(searchTerm.toLowerCase()) ||
                berita.isi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                berita.keywords?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filter by year
        if (yearFilter) {
            filtered = filtered.filter(berita => {
                if (!berita.tanggal_post) return false
                const year = new Date(berita.tanggal_post).getFullYear().toString()
                return year === yearFilter
            })
        }

        // Filter by month
        if (monthFilter && yearFilter) {
            filtered = filtered.filter(berita => {
                if (!berita.tanggal_post) return false
                const month = (new Date(berita.tanggal_post).getMonth() + 1).toString()
                return month === monthFilter
            })
        }

        // Sort
        switch (sortBy) {
            case 'terlama':
                filtered.sort((a, b) => new Date(a.tanggal_post || 0).getTime() - new Date(b.tanggal_post || 0).getTime())
                break
            case 'terpopuler':
                filtered.sort((a, b) => (b.hits || 0) - (a.hits || 0))
                break
            case 'judul':
                filtered.sort((a, b) => a.judul_berita.localeCompare(b.judul_berita))
                break
            default: // terbaru
                filtered.sort((a, b) => new Date(b.tanggal_post || 0).getTime() - new Date(a.tanggal_post || 0).getTime())
        }

        return filtered
    }

    // Helper function untuk filtering halaman
    const filterHalaman = (halamanList: any[], searchTerm: string) => {
        if (!searchTerm) return halamanList

        return halamanList.filter(halaman => 
            halaman.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
            halaman.konten?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }

    // Apply filters
    const filteredBerita = filterBerita(category.beritas, searchTerm, yearFilter, monthFilter, sortBy)
    const filteredHalaman = filterHalaman(category.Halaman, searchTerm)
    
    // Pagination for berita
    const totalBerita = filteredBerita.length
    const totalPagesBerita = Math.ceil(totalBerita / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedBerita = filteredBerita.slice(startIndex, startIndex + itemsPerPage)

    return (
        <>
            {/* Search and Filter Component */}
            <Suspense fallback={<Skeleton className="h-32 w-full mb-8" />}>
                <BeritaSearchFilter
                    categories={allCategories.map(cat => ({
                        id_kategori: Number(cat.id_kategori),
                        nama_kategori: cat.nama_kategori,
                        slug_kategori: cat.slug_kategori
                    }))}
                    totalResults={totalBerita + filteredHalaman.length}
                />
            </Suspense>

            {/* Content Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content - Takes 2/3 width */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Berita Terkait */}
                    {filteredBerita.length > 0 ? (
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-2">
                                    <Newspaper className="w-5 h-5 text-[#07b8b2]" />
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {searchTerm || yearFilter || monthFilter ? 'Hasil Pencarian Berita' : 'Berita Terkait'}
                                    </h2>
                                </div>
                                {!searchTerm && !yearFilter && !monthFilter && (
                                    <Link
                                        href={`/${category.slug_kategori}?type=berita`}
                                        className="text-[#07b8b2] hover:text-teal-700 text-sm font-medium transition-colors flex items-center space-x-1"
                                    >
                                        <span>Lihat semua</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                                {paginatedBerita.map(berita => (
                                    <NewsCard
                                        key={berita.id_berita.toString()}
                                        title={berita.judul_berita}
                                        excerpt={berita.isi}
                                        href={`/${category.slug_kategori}/${berita.slug_berita}`}
                                        date={berita.tanggal_post}
                                        views={berita.hits}
                                        image={berita.thumbnail}
                                        category={category.nama_kategori}
                                    />
                                ))}
                            </div>

                            {/* Pagination Component */}
                            {totalBerita > itemsPerPage && (
                                <div className="mt-8">
                                    <BeritaPagination
                                        currentPage={currentPage}
                                        totalPages={totalPagesBerita}
                                        totalItems={totalBerita}
                                        itemsPerPage={itemsPerPage}
                                        basePath={`/${category.slug_kategori}`}
                                    />
                                </div>
                            )}
                        </section>
                    ) : category.beritas.length > 0 && (searchTerm || yearFilter || monthFilter || sortBy !== 'terbaru') && (
                        <section>
                            <div className="flex items-center space-x-2 mb-6">
                                <Newspaper className="w-5 h-5 text-[#07b8b2]" />
                                <h2 className="text-xl font-semibold text-gray-900">Hasil Pencarian Berita</h2>
                            </div>
                            <Card className="p-8 text-center">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Search className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada berita ditemukan</h3>
                                        <p className="text-gray-600 mb-4">
                                            Coba ubah kata kunci pencarian atau filter yang Anda gunakan.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                const url = new URL(window.location.href)
                                                url.search = ''
                                                window.location.href = url.toString()
                                            }}
                                            className="text-[#07b8b2] border-[#07b8b2] hover:bg-[#07b8b2] hover:text-white"
                                        >
                                            Reset Filter
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </section>
                    )}

                    {/* Halaman di kategori */}
                    {filteredHalaman.length > 0 ? (
                        <section>
                            <div className="flex items-center space-x-2 mb-6">
                                <FileText className="w-5 h-5 text-[#07b8b2]" />
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {searchTerm ? 'Hasil Pencarian Halaman' : 'Halaman'}
                                </h2>
                            </div>
                            <div className="grid gap-4">
                                {filteredHalaman.map(halaman => (
                                    <Link
                                        key={halaman.id_halaman.toString()}
                                        href={`/${category.slug_kategori}/${halaman.slug}`}
                                        className="block"
                                    >
                                        <Card className="hover:border-[#07b8b2] hover:shadow-lg transition-all duration-300 group">
                                            <CardContent className="p-6">
                                                <div className="flex items-start space-x-4">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-12 h-12 bg-[#07b8b2] bg-opacity-10 rounded-xl flex items-center justify-center group-hover:bg-[#07b8b2] group-hover:bg-opacity-20 transition-colors">
                                                            <FileText className="w-6 h-6 text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 group-hover:text-[#07b8b2] transition-colors line-clamp-1">
                                                            {halaman.judul}
                                                        </h3>
                                                        {halaman.konten && (
                                                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                                                {halaman.konten.replace(/<[^>]*>/g, '').substring(0, 120)}...
                                                            </p>
                                                        )}
                                                        <div className="mt-4 flex items-center justify-between">
                                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                                {new Date(halaman.createdAt).toLocaleDateString('id-ID')}
                                                            </span>
                                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#07b8b2] transition-colors" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ) : category.Halaman.length > 0 && searchTerm && (
                        <section>
                            <div className="flex items-center space-x-2 mb-6">
                                <FileText className="w-5 h-5 text-[#07b8b2]" />
                                <h2 className="text-xl font-semibold text-gray-900">Hasil Pencarian Halaman</h2>
                            </div>
                            <Card className="p-8 text-center">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                        <FileText className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada halaman ditemukan</h3>
                                        <p className="text-gray-600 mb-4">
                                            Coba ubah kata kunci pencarian Anda.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                const url = new URL(window.location.href)
                                                url.searchParams.delete('search')
                                                window.location.href = url.toString()
                                            }}
                                            className="text-[#07b8b2] border-[#07b8b2] hover:bg-[#07b8b2] hover:text-white"
                                        >
                                            Reset Pencarian
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </section>
                    )}
                </div>

                {/* Sidebar - Takes 1/3 width */}
                <div className="space-y-6">
                    {/* Berita Terpopuler */}
                    {category.beritas.length > 0 && (
                        <Card className="sticky top-6">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-2 mb-6">
                                    <Users className="w-5 h-5 text-[#07b8b2]" />
                                    <h3 className="font-semibold text-gray-900">Berita Terpopuler</h3>
                                </div>
                                <div className="space-y-4">
                                    {(category.beritas as any[])
                                        .sort((a: any, b: any) => (b.hits || 0) - (a.hits || 0))
                                        .slice(0, 5)
                                        .map((berita: any, index: number) => (
                                            <Link
                                                key={berita.id_berita.toString()}
                                                href={`/${category.slug_kategori}/${berita.slug_berita}`}
                                                className="block p-4 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200"
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 bg-[#07b8b2] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                            {index + 1}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#07b8b2] transition-colors line-clamp-2 leading-relaxed">
                                                            {berita.judul_berita}
                                                        </h4>
                                                        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                                                            <div className="flex items-center space-x-1">
                                                                <Calendar className="w-3 h-3" />
                                                                <span>{berita.tanggal_post ? new Date(berita.tanggal_post).toLocaleDateString('id-ID') : '-'}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <Eye className="w-3 h-3" />
                                                                <span>{berita.hits || 0}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    )
}

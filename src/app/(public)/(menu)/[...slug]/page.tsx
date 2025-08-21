/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

// Force dynamic rendering for search functionality
export const dynamic = 'force-dynamic'
import {
    Calendar,
    Eye,
    ArrowLeft,
    ChevronRight,
    FileText,
    Newspaper,
    Users,
    Clock,
    Tag,
    X,
    Info,
    TrendingUp,
    Search
} from 'lucide-react'
import { Suspense } from 'react'
import { ShareButton } from '@/components/landing/shared-button'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import BeritaPagination from '@/components/berita-pagination'
// import CategoryPageClient from '@/components/kategori/CategoryPageClient'
import KontakKami from '@/app/(public)/(menu)/hubungi-kami/page'
import JadwalDokter from '@/app/(public)/(menu)/layanan/jadwal-dokter/page'
import IndikatorMutuPage from '@/app/(public)/(menu)/indikator-mutu/page'

// Update type untuk params yang async
type PageParams = Promise<{
    slug?: string[]
}>

type SearchParams = Promise<{
    [key: string]: string | string[] | undefined
}>

// Loading Components with shadcn/ui
function PageSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="space-y-6">
                    {/* Breadcrumb skeleton */}
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                    </div>

                    {/* Title skeleton */}
                    <Skeleton className="h-8 w-3/4" />

                    {/* Content skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function NewsCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-video">
                <Skeleton className="w-full h-full" />
            </div>
            <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}

function CategoryCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function LoadingGrid({ count = 6, type = 'news' }: { count?: number; type?: 'news' | 'category' }) {
    return (
        <div className={`grid gap-6 ${type === 'news' ? 'sm:grid-cols-1 lg:grid-cols-2' : 'sm:grid-cols-2'}`}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index}>
                    {type === 'news' ? <NewsCardSkeleton /> : <CategoryCardSkeleton />}
                </div>
            ))}
        </div>
    )
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<PageSkeleton />}>
            {children}
        </Suspense>
    )
}

// Breadcrumb Component
function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
            <Link
                href="/"
                className="hover:text-[#07b8b2] transition-colors flex items-center"
            >
                <span>Beranda</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 min-w-0">
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {item.href && index < items.length - 1 ? (
                        <Link
                            href={item.href}
                            className="hover:text-[#07b8b2] transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span
                            className={`text-gray-900 font-medium ${index === items.length - 1
                                ? 'truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px]'
                                : ''
                                }`}
                            title={item.label}
                        >
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    )
}

// Modified Category Card Component using shadcn/ui
function CategoryCard({
    title,
    description,
    href,
    icon: Icon,
    count,
    isClickable = true
}: {
    title: string
    description?: string
    href: string
    icon: React.ElementType
    count?: number
    isClickable?: boolean
}) {
    const cardContent = (
        <Card className={`${isClickable ? 'hover:border-[#07b8b2] hover:shadow-lg transition-all duration-300 cursor-pointer' : ''}`}>
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-[#07b8b2] bg-opacity-10 rounded-xl flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                            {title}
                        </h3>
                        {description && (
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                {description}
                            </p>
                        )}
                        {count !== undefined && (
                            <p className="mt-2 text-xs text-gray-500">
                                {count} item{count !== 1 ? 's' : ''}
                            </p>
                        )}
                        {isClickable && (
                            <div className="mt-2">
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    if (isClickable) {
        return (
            <Link href={href} className="block">
                {cardContent}
            </Link>
        )
    }

    return <div>{cardContent}</div>
}

// News/Article Card Component using shadcn/ui
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
                {category && (
                    <div className="flex items-center space-x-2 mb-3">
                        <Tag className="w-4 h-4 text-[#07b8b2]" />
                        <span className="text-sm text-[#07b8b2] font-medium">{category}</span>
                    </div>
                )}

                <h3 className="font-semibold text-gray-900 group-hover:text-[#07b8b2] transition-colors line-clamp-2 mb-3 text-lg leading-snug">
                    <Link href={href} className="hover:underline">{title}</Link>
                </h3>

                {excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                        {excerpt.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                )}

                {/* Meta Information */}
                <div className="flex flex-col space-y-3">
                    {/* Date and Views Row */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                            {date && (
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-[#07b8b2]" />
                                    <span className="font-medium">
                                        {new Date(date).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            )}

                            {views !== null && views !== undefined && (
                                <div className="flex items-center space-x-2">
                                    <Eye className="w-4 h-4 text-[#07b8b2]" />
                                    <span className="font-medium">{views.toLocaleString()} views</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                        <Link
                            href={href}
                            className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-white bg-[#07b8b2] hover:bg-teal-700 rounded-lg transition-all duration-200 group/btn shadow-sm hover:shadow-md"
                        >
                            Baca Selengkapnya
                            <ChevronRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export async function generateStaticParams() {
    try {
        const [pages, news, categories] = await Promise.all([
            prisma.halaman.findMany({
                where: { is_published: true },
                select: { slug: true, kategori: { select: { slug_kategori: true } } }
            }),
            prisma.beritas.findMany({
                where: { status_berita: 'publish' },
                select: { slug_berita: true, kategori: { select: { slug_kategori: true } } }
            }),
            prisma.kategori.findMany({
                where: { is_active: true },
                select: { slug_kategori: true, parent: { select: { slug_kategori: true } } }
            })
        ])

        const params: { slug: string[] }[] = []

        // Generate paths untuk halaman
        pages.forEach((page: any) => {
            if (page.kategori) {
                params.push({ slug: [page.kategori.slug_kategori, page.slug] })
            }
            params.push({ slug: [page.slug] })
        })

        // Generate paths untuk berita
        news.forEach(item => {
            if (item.kategori) {
                params.push({ slug: [item.kategori.slug_kategori, item.slug_berita] })
            }
            params.push({ slug: [item.slug_berita] })
        })

        // Generate paths untuk kategori
        categories.forEach(category => {
            const path: string[] = []
            if (category.parent) {
                path.push(category.parent.slug_kategori)
            }
            path.push(category.slug_kategori)
            params.push({ slug: path })
        })

        params.push({ slug: ['layanan'] })
        params.push({ slug: ['layanan', 'jadwal-dokter'] })
        params.push({ slug: ['hubungi-kami'] })
        params.push({ slug: ['hubungi-kami', 'kontak-kami'] })

        return params
    } catch (error) {
        console.error('Error generating static params:', error)
        return []
    }
}

export async function generateMetadata({ params }: { params: PageParams; searchParams: SearchParams }): Promise<Metadata> {
    try {
        const resolvedParams = await params
        const path = resolvedParams.slug || []
        const lastSegment = path[path.length - 1]

        // Default metadata
        const defaultMetadata = {
            title: 'RS PKU Muhammadiyah Boja',
            description: 'Menyehatkan Umat, Mencerdaskan Semesta.',
            siteName: 'RS PKU Muhammadiyah Boja',
            baseUrl: 'https://rspkuboja.com',
            defaultImage: 'https://rspkuboja.com/logo.png'
        }

        if (!lastSegment) {
            return {
                title: 'Halaman Tidak Ditemukan - RS PKU Muhammadiyah Boja',
                description: 'Halaman yang Anda cari tidak ditemukan.',
                openGraph: {
                    title: 'Halaman Tidak Ditemukan',
                    description: 'Halaman yang Anda cari tidak ditemukan.',
                    url: `${defaultMetadata.baseUrl}/${path.join('/')}`,
                    type: 'website',
                    siteName: defaultMetadata.siteName,
                    images: [defaultMetadata.defaultImage]
                },
                twitter: {
                    card: 'summary_large_image',
                    title: 'Halaman Tidak Ditemukan',
                    description: 'Halaman yang Anda cari tidak ditemukan.',
                    images: [defaultMetadata.defaultImage]
                }
            }
        }

        // Try to find content for metadata
        const [category, page, newsItem] = await Promise.all([
            prisma.kategori.findUnique({
                where: { slug_kategori: lastSegment },
                select: { nama_kategori: true, keterangan: true, gambar: true }
            }),
            prisma.halaman.findUnique({
                where: { slug: lastSegment },
                select: {
                    judul: true,
                    konten: true,
                    gambar: true,
                    createdAt: true,
                    updatedAt: true,
                    kategori: {
                        select: { nama_kategori: true, slug_kategori: true }
                    }
                }
            }),
            prisma.beritas.findFirst({
                where: { slug_berita: lastSegment },
                select: {
                    judul_berita: true,
                    isi: true,
                    gambar: true,
                    thumbnail: true,
                    keywords: true,
                    tanggal_post: true,
                    updatedAt: true,
                    hits: true,
                    kategori: {
                        select: { nama_kategori: true, slug_kategori: true }
                    },
                    user: {
                        select: { name: true }
                    }
                }
            })
        ])

        const currentUrl = `${defaultMetadata.baseUrl}/${path.join('/')}`

        // Category metadata
        if (category) {
            const categoryTitle = `${category.nama_kategori} - ${defaultMetadata.siteName}`
            const categoryDescription = category.keterangan?.replace(/<[^>]*>/g, '').substring(0, 160) || `Informasi lengkap tentang ${category.nama_kategori} di RS PKU Muhammadiyah Boja`
            const categoryImage = category.gambar || defaultMetadata.defaultImage

            return {
                title: categoryTitle,
                description: categoryDescription,
                keywords: `${category.nama_kategori}, RS PKU Muhammadiyah Boja, rumah sakit, kesehatan`,
                authors: [{ name: defaultMetadata.siteName }],
                creator: defaultMetadata.siteName,
                publisher: defaultMetadata.siteName,
                robots: 'index, follow',
                openGraph: {
                    title: category.nama_kategori,
                    description: categoryDescription,
                    url: currentUrl,
                    type: 'website',
                    siteName: defaultMetadata.siteName,
                    images: [{
                        url: categoryImage,
                        width: 1200,
                        height: 630,
                        alt: category.nama_kategori
                    }],
                    locale: 'id_ID'
                },
                twitter: {
                    card: 'summary_large_image',
                    site: '@rspkuboja',
                    creator: '@rspkuboja',
                    title: category.nama_kategori,
                    description: categoryDescription,
                    images: [{
                        url: categoryImage,
                        alt: category.nama_kategori
                    }]
                },
                alternates: {
                    canonical: currentUrl
                }
            }
        }

        // Page metadata
        if (page) {
            const pageTitle = `${page.judul} - ${defaultMetadata.siteName}`
            const pageDescription = page.konten?.replace(/<[^>]*>/g, '').substring(0, 160) || `${page.judul} - Informasi dari RS PKU Muhammadiyah Boja`
            const pageImage = page.gambar || defaultMetadata.defaultImage
            const categoryName = page.kategori?.nama_kategori

            return {
                title: pageTitle,
                description: pageDescription,
                keywords: `${page.judul}, ${categoryName || ''}, RS PKU Muhammadiyah Boja, rumah sakit, kesehatan`,
                authors: [{ name: defaultMetadata.siteName }],
                creator: defaultMetadata.siteName,
                publisher: defaultMetadata.siteName,
                robots: 'index, follow',
                openGraph: {
                    title: page.judul,
                    description: pageDescription,
                    url: currentUrl,
                    type: 'article',
                    siteName: defaultMetadata.siteName,
                    images: [{
                        url: pageImage,
                        width: 1200,
                        height: 630,
                        alt: page.judul
                    }],
                    locale: 'id_ID',
                    publishedTime: page.createdAt.toISOString(),
                    modifiedTime: page.updatedAt.toISOString(),
                    section: categoryName || 'Informasi',
                    authors: [defaultMetadata.siteName]
                },
                twitter: {
                    card: 'summary_large_image',
                    site: '@rspkuboja',
                    creator: '@rspkuboja',
                    title: page.judul,
                    description: pageDescription,
                    images: [{
                        url: pageImage,
                        alt: page.judul
                    }]
                },
                alternates: {
                    canonical: currentUrl
                },
                other: {
                    'article:published_time': page.createdAt.toISOString(),
                    'article:modified_time': page.updatedAt.toISOString(),
                    'article:section': categoryName || 'Informasi',
                    'article:author': defaultMetadata.siteName
                }
            }
        }

        // News metadata
        if (newsItem) {
            const newsTitle = `${newsItem.judul_berita} - ${defaultMetadata.siteName}`
            const newsDescription = newsItem.isi?.replace(/<[^>]*>/g, '').substring(0, 160) || `${newsItem.judul_berita} - Berita terbaru dari RS PKU Muhammadiyah Boja`
            const newsImage = newsItem.gambar || newsItem.thumbnail || defaultMetadata.defaultImage
            const categoryName = newsItem.kategori?.nama_kategori
            const authorName = newsItem.user?.name || defaultMetadata.siteName

            const keywordsArray = []
            if (newsItem.keywords) {
                keywordsArray.push(newsItem.keywords)
            }
            keywordsArray.push(newsItem.judul_berita)
            keywordsArray.push(categoryName || 'berita')
            keywordsArray.push('RS PKU Muhammadiyah Boja')
            keywordsArray.push('rumah sakit')
            keywordsArray.push('kesehatan')
            keywordsArray.push('boja')
            keywordsArray.push('Muhammadiyah')
            keywordsArray.push('PKU Boja')
            keywordsArray.push('RS Boja')
            keywordsArray.push('PKU Muhammadiyah')

            const finalKeywords = keywordsArray.filter(Boolean).join(', ')

            return {
                title: newsTitle,
                description: newsDescription,
                keywords: finalKeywords,
                authors: [{ name: authorName }],
                creator: authorName,
                publisher: defaultMetadata.siteName,
                robots: 'index, follow',
                openGraph: {
                    title: newsItem.judul_berita,
                    description: newsDescription,
                    url: currentUrl,
                    type: 'article',
                    siteName: defaultMetadata.siteName,
                    images: [{
                        url: newsImage,
                        width: 1200,
                        height: 630,
                        alt: newsItem.judul_berita
                    }],
                    locale: 'id_ID',
                    publishedTime: newsItem.tanggal_post?.toISOString(),
                    modifiedTime: (newsItem.updatedAt ? newsItem.updatedAt.toISOString() : new Date().toISOString()),
                    section: categoryName || 'Berita',
                    authors: [authorName]
                },
                twitter: {
                    card: 'summary_large_image',
                    site: '@rspkuboja',
                    creator: '@rspkuboja',
                    title: newsItem.judul_berita,
                    description: newsDescription,
                    images: [{
                        url: newsImage,
                        alt: newsItem.judul_berita
                    }]
                },
                alternates: {
                    canonical: currentUrl
                },
                other: {
                    'article:published_time': newsItem.tanggal_post?.toISOString() || new Date().toISOString(),
                    'article:modified_time': (newsItem.updatedAt ? newsItem.updatedAt.toISOString() : new Date().toISOString()),
                    'article:section': categoryName || 'Berita',
                    'article:author': authorName,
                    'article:tag': categoryName || 'berita',
                    'news_keywords': newsItem.keywords || `${newsItem.judul_berita}, ${categoryName || 'berita'}, RS PKU Muhammadiyah Boja`,
                    'keywords': finalKeywords
                }
            }
        }

        // 404 fallback
        return {
            title: 'Halaman Tidak Ditemukan - RS PKU Muhammadiyah Boja',
            description: 'Halaman yang Anda cari tidak ditemukan di website RS PKU Muhammadiyah Boja.',
            robots: 'noindex, nofollow',
            openGraph: {
                title: 'Halaman Tidak Ditemukan',
                description: 'Halaman yang Anda cari tidak ditemukan.',
                url: currentUrl,
                type: 'website',
                siteName: defaultMetadata.siteName,
                images: [defaultMetadata.defaultImage]
            },
            twitter: {
                card: 'summary_large_image',
                title: 'Halaman Tidak Ditemukan',
                description: 'Halaman yang Anda cari tidak ditemukan.',
                images: [defaultMetadata.defaultImage]
            }
        }

    } catch (error) {
        console.error('Error generating metadata:', error)

        return {
            title: 'Error - RS PKU Muhammadiyah Boja',
            description: 'Terjadi kesalahan pada sistem. Silakan coba lagi nanti.',
            robots: 'noindex, nofollow',
            openGraph: {
                title: 'Error - RS PKU Muhammadiyah Boja',
                description: 'Terjadi kesalahan pada sistem.',
                url: 'https://rspkuboja.com',
                type: 'website',
                siteName: 'RS PKU Muhammadiyah Boja',
                images: ['https://rspkuboja.com/storage/rspku.jpeg']
            },
            twitter: {
                card: 'summary_large_image',
                title: 'Error - RS PKU Muhammadiyah Boja',
                description: 'Terjadi kesalahan pada sistem.',
                images: ['https://rspkuboja.com/storage/rspku.jpeg']
            }
        }
    }
}

export default async function DynamicPage({ params, searchParams }: { params: PageParams; searchParams: SearchParams }) {
    try {
        const resolvedParams = await params
        const resolvedSearchParams = await searchParams
        const path = resolvedParams.slug || []
        const lastSegment = path[path.length - 1]

        // Extract search parameters
        const currentPage = Number(resolvedSearchParams.page) || 1
        const searchTerm = resolvedSearchParams.search as string || ''
        const yearFilter = resolvedSearchParams.tahun as string || ''
        const monthFilter = resolvedSearchParams.bulan as string || ''
        const sortBy = resolvedSearchParams.sort as string || 'terbaru'
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

        if (!lastSegment) {
            return notFound()
        }

        // ========== PENGECEKAN HALAMAN STATIS TERLEBIH DAHULU ==========
        const fullPath = path.join('/')

        if (fullPath === 'indikator-mutu') {
            return <IndikatorMutuPage />
        }

        if (fullPath === 'hubungi-kami') {
            return <KontakKami />
        }

        if (fullPath === 'layanan/jadwal-dokter') {
            return <JadwalDokter />
        }

        // Cek apakah ini kategori
        const category = await prisma.kategori.findUnique({
            where: { slug_kategori: lastSegment },
            include: {
                parent: true,
                children: {
                    where: { is_active: true },
                    orderBy: { urutan: 'asc' },
                    include: {
                        Halaman: {
                            where: { is_published: true }
                        }
                    }
                },
                beritas: {
                    where: { status_berita: 'publish' },
                    orderBy: { tanggal_post: 'desc' },
                },
                Halaman: {
                    where: { is_published: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (category) {
            // Apply filters to berita and halaman
            const filteredBerita = filterBerita(category.beritas, searchTerm, yearFilter, monthFilter, sortBy)
            const filteredHalaman = filterHalaman(category.Halaman, searchTerm)

            // Pagination for berita
            const totalBerita = filteredBerita.length
            const totalPagesBerita = Math.ceil(totalBerita / itemsPerPage)
            const startIndex = (currentPage - 1) * itemsPerPage
            const paginatedBerita = filteredBerita.slice(startIndex, startIndex + itemsPerPage)

            // Get all categories for filter dropdown
            // const allCategories = await prisma.kategori.findMany({
            //     where: { is_active: true },
            //     select: { id_kategori: true, nama_kategori: true, slug_kategori: true },
            //     orderBy: { nama_kategori: 'asc' }
            // })

            const breadcrumbItems = []

            if (category.parent) {
                breadcrumbItems.push({
                    label: category.parent.nama_kategori,
                    href: `/${category.parent.slug_kategori}`
                })
            }

            breadcrumbItems.push({
                label: category.nama_kategori
            })

            return (
                <ErrorBoundary>
                    <div className="min-h-screen bg-gray-50">
                        <div className="container mx-auto px-4 py-8 max-w-7xl">
                            <Breadcrumb items={breadcrumbItems} />

                            {/* Header Section */}
                            <Card className="mb-8">
                                <CardContent className="p-8">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-12 h-12 bg-[#07b8b2] bg-opacity-10 rounded-xl flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900">{category.nama_kategori}</h1>
                                            {category.parent && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Bagian dari{' '}
                                                    <Link
                                                        href={`/${category.parent.slug_kategori}`}
                                                        className="text-[#07b8b2] hover:text-teal-700 transition-colors"
                                                    >
                                                        {category.parent.nama_kategori}
                                                    </Link>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {category.keterangan && (
                                        <div className="text-gray-600 leading-relaxed">
                                            <div dangerouslySetInnerHTML={{ __html: category.keterangan }} />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Search and Filter Component with Client Side Logic */}
                            {/* <CategoryPageClient
                                category={category}
                                allCategories={allCategories.map(cat => ({
                                    id_kategori: cat.id_kategori.toString(),
                                    nama_kategori: cat.nama_kategori,
                                    slug_kategori: cat.slug_kategori
                                }))}
                            /> */}

                            {/* Content Grid - Improved 2 columns layout */}
                            <div className="grid gap-8 lg:grid-cols-3">
                                {/* Main Content - Takes 2/3 width */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Subkategori */}
                                    {category.children.length > 0 && (
                                        <section>
                                            <div className="flex items-center space-x-2 mb-6">
                                                <Users className="w-5 h-5 text-[#07b8b2]" />
                                                <h2 className="text-xl font-semibold text-gray-900">Subkategori</h2>
                                            </div>
                                            <Suspense fallback={<LoadingGrid count={4} type="category" />}>
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    {category.children.map(child => (
                                                        <CategoryCard
                                                            key={child.id_kategori.toString()}
                                                            title={child.nama_kategori}
                                                            description={child.keterangan || undefined}
                                                            href={`/${child.slug_kategori}`}
                                                            icon={FileText}
                                                            count={child.Halaman?.length}
                                                        />
                                                    ))}
                                                </div>
                                            </Suspense>
                                        </section>
                                    )}

                                    {/* Berita Terkait */}
                                    {category.beritas.length > 0 && (
                                        <section>
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center space-x-2">
                                                    <Newspaper className="w-5 h-5 text-[#07b8b2]" />
                                                    <h2 className="text-xl font-semibold text-gray-900">
                                                        {(searchTerm || yearFilter || monthFilter) ? 'Hasil Pencarian Berita' : 'Berita Terkait'}
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

                                            {filteredBerita.length > 0 ? (
                                                <>
                                                    <Suspense fallback={<LoadingGrid count={4} type="news" />}>
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
                                                    </Suspense>

                                                    {/* Pagination Component */}
                                                    {totalBerita > itemsPerPage && (
                                                        <div className="mt-8">
                                                            <Suspense fallback={<Skeleton className="h-16 w-full" />}>
                                                                <BeritaPagination
                                                                    currentPage={currentPage}
                                                                    totalPages={totalPagesBerita}
                                                                    totalItems={totalBerita}
                                                                    itemsPerPage={itemsPerPage}
                                                                    basePath={`/${category.slug_kategori}`}
                                                                />
                                                            </Suspense>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (searchTerm || yearFilter || monthFilter || sortBy !== 'terbaru') && (
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
                                                            <Link
                                                                href={`/${category.slug_kategori}`}
                                                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#07b8b2] border border-[#07b8b2] rounded-lg hover:bg-[#07b8b2] hover:text-white transition-colors"
                                                            >
                                                                Reset Filter
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </Card>
                                            )}
                                        </section>
                                    )}

                                    {/* Halaman di kategori */}
                                    {filteredHalaman.length > 0 && (
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
                                    )}
                                </div>

                                {/* Sidebar - Takes 1/3 width */}
                                <div className="space-y-6">
                                    {/* Berita Terpopuler */}
                                    {category.beritas.length > 0 && (
                                        <Card className="sticky top-6">
                                            <CardContent className="p-6">
                                                <div className="flex items-center space-x-2 mb-6">
                                                    <TrendingUp className="w-5 h-5 text-[#07b8b2]" />
                                                    <h3 className="font-semibold text-gray-900">Berita Terpopuler</h3>
                                                </div>
                                                <div className="space-y-4">
                                                    {category.beritas
                                                        .sort((a, b) => (b.hits || 0) - (a.hits || 0))
                                                        .slice(0, 5)
                                                        .map((berita, index) => (
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

                                    {/* Info Kategori */}
                                    {category.keterangan && (
                                        <div className="bg-gradient-to-br from-[#07b8b2] to-teal-600 rounded-xl p-6 text-white">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <Info className="w-5 h-5" />
                                                <h3 className="font-semibold">Tentang {category.nama_kategori}</h3>
                                            </div>
                                            <p className="text-sm leading-relaxed opacity-90">
                                                {category.keterangan}
                                            </p>
                                        </div>
                                    )}

                                    {/* Quick Stats */}
                                    <Card>
                                        <CardContent className="p-6">
                                            <h3 className="font-semibold text-gray-900 mb-4">Statistik</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                    <span className="text-sm text-gray-600 flex items-center space-x-2">
                                                        <FileText className="w-4 h-4" />
                                                        <span>Total Halaman</span>
                                                    </span>
                                                    <span className="font-semibold text-[#07b8b2]">{category.Halaman?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                    <span className="text-sm text-gray-600 flex items-center space-x-2">
                                                        <Newspaper className="w-4 h-4" />
                                                        <span>Total Berita</span>
                                                    </span>
                                                    <span className="font-semibold text-[#07b8b2]">{category.beritas?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center justify-between py-2">
                                                    <span className="text-sm text-gray-600 flex items-center space-x-2">
                                                        <Users className="w-4 h-4" />
                                                        <span>Subkategori</span>
                                                    </span>
                                                    <span className="font-semibold text-[#07b8b2]">{category.children?.length || 0}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </ErrorBoundary>
            )
        }

        // Cek apakah ini halaman
        const page = await prisma.halaman.findUnique({
            where: { slug: lastSegment },
            include: { kategori: true }
        })

        if (page) {
            const breadcrumbItems = []

            if (page.kategori) {
                breadcrumbItems.push({
                    label: page.kategori.nama_kategori,
                    href: `/${page.kategori.slug_kategori}`
                })
            }

            breadcrumbItems.push({
                label: page.judul
            })

            return (
                <ErrorBoundary>
                    <div className="min-h-screen bg-gray-50">
                        <div className="container mx-auto px-4 py-8 max-w-7xl">
                            <Breadcrumb items={breadcrumbItems} />

                            <Card className="overflow-hidden">
                                {/* Header */}
                                <CardContent className="p-8 border-b border-gray-100">
                                    <div className="flex items-center space-x-2 mb-4">
                                        {page.kategori && (
                                            <>
                                                <Tag className="w-4 h-4 text-white" />
                                                <Link
                                                    href={`/${page.kategori.slug_kategori}`}
                                                    className="text-sm text-[#07b8b2] hover:text-teal-700 font-medium transition-colors"
                                                >
                                                    {page.kategori.nama_kategori}
                                                </Link>
                                            </>
                                        )}
                                    </div>

                                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                        {page.judul}
                                    </h1>

                                    <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{new Date(page.createdAt).toLocaleDateString('id-ID')}</span>
                                        </div>

                                        <ShareButton
                                            url={`/${page.kategori?.slug_kategori || ''}/${page.slug}`}
                                            title={page.judul}
                                        />
                                    </div>
                                </CardContent>

                                {/* Content */}
                                <CardContent className="p-8">
                                    {page.gambar && (
                                        <div className="mb-8 rounded-xl overflow-hidden">
                                            <Image
                                                src={page.gambar}
                                                alt={page.judul}
                                                width={800}
                                                height={400}
                                                className="w-full h-auto"
                                            />
                                        </div>
                                    )}

                                    <div
                                        className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-[#07b8b2] prose-a:no-underline hover:prose-a:text-teal-700"
                                        dangerouslySetInnerHTML={{ __html: page.konten }}
                                    />
                                </CardContent>
                            </Card>

                            {/* Back Button */}
                            <div className="mt-8">
                                <Link
                                    href={page.kategori ? `/${page.kategori.slug_kategori}` : '/'}
                                    className="inline-flex items-center space-x-2 text-[#07b8b2] hover:text-teal-700 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Kembali{page.kategori ? ` ke ${page.kategori.nama_kategori}` : ' ke Beranda'}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </ErrorBoundary>
            )
        }

        // Cek apakah ini berita
        const newsItem = await prisma.beritas.findFirst({
            where: { slug_berita: lastSegment },
            include: {
                kategori: true,
                user: {
                    select: { name: true }
                }
            }
        })

        if (newsItem) {
            // Update hits
            await prisma.beritas.update({
                where: { id_berita: newsItem.id_berita },
                data: { hits: { increment: 1 } }
            })

            const breadcrumbItems = []

            if (newsItem.kategori) {
                breadcrumbItems.push({
                    label: newsItem.kategori.nama_kategori,
                    href: `/${newsItem.kategori.slug_kategori}`
                })
            }

            breadcrumbItems.push({
                label: newsItem.judul_berita
            })

            return (
                <ErrorBoundary>
                    <div className="min-h-screen bg-gray-50">
                        <div className="container mx-auto px-4 py-8 max-w-7xl">
                            <Breadcrumb items={breadcrumbItems} />

                            <Card className="overflow-hidden">
                                {/* Header */}
                                <CardContent className="p-4 sm:p-8 border-b border-gray-100">
                                    <div className="flex items-center space-x-2 mb-4">
                                        {newsItem.kategori && (
                                            <>
                                                <Tag className="w-4 h-4 text-white" />
                                                <Link
                                                    href={`/${newsItem.kategori.slug_kategori}`}
                                                    className="text-sm text-[#07b8b2] hover:text-teal-700 font-medium transition-colors"
                                                >
                                                    {newsItem.kategori.nama_kategori}
                                                </Link>
                                            </>
                                        )}
                                    </div>

                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
                                        {newsItem.judul_berita}
                                    </h1>

                                    {/* Mobile Layout - Stack vertically */}
                                    <div className="flex flex-col space-y-4 sm:hidden">
                                        {/* Info items - 2 columns on mobile */}
                                        <div className="grid grid-cols-1 gap-3">
                                            {newsItem.tanggal_post && (
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 flex-shrink-0" />
                                                    <span>{new Date(newsItem.tanggal_post).toLocaleDateString('id-ID')}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Eye className="w-4 h-4 flex-shrink-0" />
                                                <span>{(newsItem.hits || 0) + 1} views</span>
                                            </div>

                                            {newsItem.user && (
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Users className="w-4 h-4 flex-shrink-0" />
                                                    <span>{newsItem.user.name}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Share button - full width on mobile */}
                                        <div className="pt-2 border-t border-gray-100">
                                            <ShareButton
                                                url={`/${newsItem.kategori?.slug_kategori || ''}/${newsItem.slug_berita}`}
                                                title={newsItem.judul_berita}
                                            />
                                        </div>
                                    </div>

                                    {/* Desktop Layout - Horizontal */}
                                    <div className="hidden sm:flex items-center justify-between">
                                        <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
                                            {newsItem.tanggal_post && (
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(newsItem.tanggal_post).toLocaleDateString('id-ID')}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center space-x-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{(newsItem.hits || 0) + 1} views</span>
                                            </div>

                                            {newsItem.user && (
                                                <div className="flex items-center space-x-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>{newsItem.user.name}</span>
                                                </div>
                                            )}
                                        </div>

                                        <ShareButton
                                            url={`/${newsItem.kategori?.slug_kategori || ''}/${newsItem.slug_berita}`}
                                            title={newsItem.judul_berita}
                                        />
                                    </div>
                                </CardContent>

                                {/* Featured Image */}
                                {newsItem.gambar && (
                                    <div className="px-4 pt-4 sm:px-8 sm:pt-8">
                                        <div className="rounded-xl overflow-hidden">
                                            <Image
                                                src={newsItem.gambar}
                                                alt={newsItem.judul_berita}
                                                width={800}
                                                height={450}
                                                className="w-full h-auto"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Content */}
                                <CardContent className="p-4 sm:p-8">
                                    <div
                                        className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-[#07b8b2] prose-a:no-underline hover:prose-a:text-teal-700 prose-sm sm:prose-base"
                                        dangerouslySetInnerHTML={{ __html: newsItem.isi }}
                                    />
                                </CardContent>
                            </Card>

                            {/* Back Button */}
                            <div className="mt-8">
                                <Link
                                    href={newsItem.kategori ? `/${newsItem.kategori.slug_kategori}` : '/'}
                                    className="inline-flex items-center space-x-2 text-[#07b8b2] hover:text-teal-700 transition-colors text-sm sm:text-base"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Kembali{newsItem.kategori ? ` ke ${newsItem.kategori.nama_kategori}` : ' ke Beranda'}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </ErrorBoundary>
            )
        }

        return notFound()

    } catch (error) {
        if (error instanceof Error && error.message.includes('NEXT_HTTP_ERROR_FALLBACK')) {
            throw error // Re-throw untuk memicu not-found page
        }

        console.error('Database error in DynamicPage:', error)

        // Return error UI untuk database errors
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan Database</h1>
                    <p className="text-gray-600 mb-6">Maaf, terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-[#07b8b2] text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Beranda</span>
                    </Link>
                </div>
            </div>
        )
    }
}
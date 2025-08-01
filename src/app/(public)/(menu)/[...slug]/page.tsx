/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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
    X
} from 'lucide-react'
import { Suspense } from 'react'
import { ShareButton } from '@/components/landing/shared-button'
import KontakKami from '@/app/(public)/(menu)/hubungi-kami/kontak-kami/page'
import JadwalDokter from '@/app/(public)/(menu)/layanan/jadwal-dokter/page'

// Update type untuk params yang async
type PageParams = Promise<{
    slug?: string[]
}>



// Loading Components
function PageSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="animate-pulse">
                    {/* Breadcrumb skeleton */}
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-4 bg-gray-200 rounded w-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>

                    {/* Title skeleton */}
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>

                    {/* Content skeleton */}
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
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
                <div key={index} className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    {item.href && index < items.length - 1 ? (
                        <Link
                            href={item.href}
                            className="hover:text-[#07b8b2] transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    )
}

// Category Card Component
function CategoryCard({
    title,
    description,
    href,
    icon: Icon,
    count
}: {
    title: string
    description?: string
    href: string
    icon: React.ElementType
    count?: number
}) {
    return (
        <Link
            href={href}
            className="group block p-6 bg-white rounded-xl border border-gray-200 hover:border-[#07b8b2] hover:shadow-lg transition-all duration-300"
        >
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#07b8b2] bg-opacity-10 rounded-xl flex items-center justify-center group-hover:bg-[#07b8b2] transition-colors">
                        <Icon className="w-6 h-6 text-[#07b8b2] group-hover:text-white transition-colors" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#07b8b2] transition-colors">
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
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#07b8b2] transition-colors" />
            </div>
        </Link>
    )
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
        <article className="group bg-white rounded-xl border border-gray-200 hover:border-[#07b8b2] hover:shadow-lg transition-all duration-300 overflow-hidden">
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

            <div className="p-6">
                {category && (
                    <div className="flex items-center space-x-2 mb-3">
                        <Tag className="w-4 h-4 text-[#07b8b2]" />
                        <span className="text-sm text-[#07b8b2] font-medium">{category}</span>
                    </div>
                )}

                <h3 className="font-semibold text-gray-900 group-hover:text-[#07b8b2] transition-colors line-clamp-2 mb-2">
                    <Link href={href}>{title}</Link>
                </h3>

                {excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {excerpt.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                        {date && (
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(date).toLocaleDateString('id-ID')}</span>
                            </div>
                        )}

                        {views !== null && views !== undefined && (
                            <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>{views} views</span>
                            </div>
                        )}
                    </div>

                    <Link
                        href={href}
                        className="text-[#07b8b2] hover:text-teal-700 font-medium transition-colors"
                    >
                        Baca selengkapnya
                    </Link>
                </div>
            </div>
        </article>
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

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
    try {
        const resolvedParams = await params
        const path = resolvedParams.slug || []
        const lastSegment = path[path.length - 1]

        if (!lastSegment) {
            return {
                title: 'Halaman Tidak Ditemukan',
                description: 'Halaman yang Anda cari tidak ditemukan.'
            }
        }

        // Try to find content for metadata
        const [category, page, newsItem] = await Promise.all([
            prisma.kategori.findUnique({
                where: { slug_kategori: lastSegment },
                select: { nama_kategori: true, keterangan: true }
            }),
            prisma.halaman.findUnique({
                where: { slug: lastSegment },
                select: { judul: true, konten: true }
            }),
            prisma.beritas.findFirst({
                where: { slug_berita: lastSegment },
                select: { judul_berita: true, isi: true }
            })
        ])

        if (category) {
            return {
                title: category.nama_kategori,
                description: category.keterangan || `Informasi tentang ${category.nama_kategori}`
            }
        }

        if (page) {
            const description = page.konten?.replace(/<[^>]*>/g, '').substring(0, 160) || ''
            return {
                title: page.judul,
                description
            }
        }

        if (newsItem) {
            const description = newsItem.isi?.replace(/<[^>]*>/g, '').substring(0, 160) || ''
            return {
                title: newsItem.judul_berita,
                description
            }
        }

        return {
            title: 'Halaman Tidak Ditemukan',
            description: 'Halaman yang Anda cari tidak ditemukan.'
        }
    } catch (error) {
        console.error('Error generating metadata:', error)
        return {
            title: 'Error',
            description: 'Terjadi kesalahan pada sistem.'
        }
    }
}

export default async function DynamicPage({ params }: { params: PageParams }) {
    try {
        const resolvedParams = await params
        const path = resolvedParams.slug || []
        const lastSegment = path[path.length - 1]

        if (!lastSegment) {
            return notFound()
        }

        // ========== PENGECEKAN HALAMAN STATIS TERLEBIH DAHULU ==========
        const fullPath = path.join('/')
        
        // Cek halaman statis berdasarkan path lengkap
        
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
                    take: 9
                },
                Halaman: {
                    where: { is_published: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (category) {
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
                        <div className="container mx-auto px-4 py-8 max-w-6xl">
                            <Breadcrumb items={breadcrumbItems} />

                            {/* Header Section */}
                            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-[#07b8b2] bg-opacity-10 rounded-xl flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-[#07b8b2]" />
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
                            </div>

                            {/* Content Grid */}
                            <div className="grid gap-8 lg:grid-cols-3">
                                {/* Main Content */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Subkategori */}
                                    {category.children.length > 0 && (
                                        <section>
                                            <div className="flex items-center space-x-2 mb-6">
                                                <Users className="w-5 h-5 text-[#07b8b2]" />
                                                <h2 className="text-xl font-semibold text-gray-900">Subkategori</h2>
                                            </div>
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
                                        </section>
                                    )}

                                    {/* Berita Terkait */}
                                    {category.beritas.length > 0 && (
                                        <section>
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center space-x-2">
                                                    <Newspaper className="w-5 h-5 text-[#07b8b2]" />
                                                    <h2 className="text-xl font-semibold text-gray-900">Berita Terkait</h2>
                                                </div>
                                                <Link
                                                    href={`/${category.slug_kategori}?type=berita`}
                                                    className="text-[#07b8b2] hover:text-teal-700 text-sm font-medium transition-colors"
                                                >
                                                    Lihat semua
                                                </Link>
                                            </div>
                                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                                {category.beritas.map(berita => (
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
                                        </section>
                                    )}
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Halaman Terkait */}
                                    {category.Halaman.length > 0 && (
                                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <FileText className="w-5 h-5 text-[#07b8b2]" />
                                                <h3 className="font-semibold text-gray-900">Halaman Terkait</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {category.Halaman.map(halaman => (
                                                    <Link
                                                        key={halaman.id_halaman.toString()}
                                                        href={`/${category.slug_kategori}/${halaman.slug}`}
                                                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-gray-900 group-hover:text-[#07b8b2] transition-colors">
                                                                {halaman.judul}
                                                            </span>
                                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#07b8b2] transition-colors" />
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
                        <div className="container mx-auto px-4 py-8 max-w-4xl">
                            <Breadcrumb items={breadcrumbItems} />

                            <article className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                {/* Header */}
                                <div className="p-8 border-b border-gray-100">
                                    <div className="flex items-center space-x-2 mb-4">
                                        {page.kategori && (
                                            <>
                                                <Tag className="w-4 h-4 text-[#07b8b2]" />
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
                                </div>

                                {/* Content */}
                                <div className="p-8">
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
                                </div>
                            </article>

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
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <Breadcrumb items={breadcrumbItems} />

                    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="p-4 sm:p-8 border-b border-gray-100">
                            <div className="flex items-center space-x-2 mb-4">
                                {newsItem.kategori && (
                                    <>
                                        <Tag className="w-4 h-4 text-[#07b8b2]" />
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
                        </div>

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
                        <div className="p-4 sm:p-8">
                            <div
                                className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-[#07b8b2] prose-a:no-underline hover:prose-a:text-teal-700 prose-sm sm:prose-base"
                                dangerouslySetInnerHTML={{ __html: newsItem.isi }}
                            />
                        </div>
                    </article>

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
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

// Update type untuk params yang async
type PageParams = Promise<{
    slug?: string[]
}>

export async function generateStaticParams() {
    // Ambil semua path yang mungkin
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
    pages.forEach(page => {
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

    return params
}

// Update function component untuk handle async params
export default async function DynamicPage({ params }: { params: PageParams }) {
    // Await params sebelum menggunakannya
    const resolvedParams = await params
    const path = resolvedParams.slug || []
    const lastSegment = path[path.length - 1]

    // Return 404 jika tidak ada slug
    if (!lastSegment) {
        return notFound()
    }

    // Cek apakah ini kategori
    const category = await prisma.kategori.findUnique({
        where: { slug_kategori: lastSegment },
        include: {
            parent: true,
            children: true,
            beritas: {
                where: { status_berita: 'publish' },
                orderBy: { tanggal_post: 'desc' }
            },
            Halaman: {
                where: { is_published: true }
            }
        }
    })

    if (category) {
        return (
            <div>
                <h1>{category.nama_kategori}</h1>
                {category.parent && <p>Bagian dari: {category.parent.nama_kategori}</p>}

                {category.children.length > 0 && (
                    <div>
                        <h2>Subkategori</h2>
                        <ul>
                            {category.children.map(child => (
                                <li key={child.id_kategori.toString()}>
                                    <a href={`/${child.slug_kategori}`}>{child.nama_kategori}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {category.beritas.length > 0 && (
                    <>
                        <h2>Berita Terkait</h2>
                        <ul>
                            {category.beritas.map(berita => (
                                <li key={berita.id_berita.toString()}>
                                    <a href={`/${category.slug_kategori}/${berita.slug_berita}`}>
                                        {berita.judul_berita}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {category.Halaman.length > 0 && (
                    <>
                        <h2>Halaman Terkait</h2>
                        <ul>
                            {category.Halaman.map(halaman => (
                                <li key={halaman.id_halaman.toString()}>
                                    <a href={`/${category.slug_kategori}/${halaman.slug}`}>
                                        {halaman.judul}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        )
    }

    // Cek apakah ini halaman
    const page = await prisma.halaman.findUnique({
        where: { slug: lastSegment },
        include: { kategori: true }
    })

    if (page) {
        return (
            <div>
                <h1>{page.judul}</h1>
                {page.kategori && (
                    <p>
                        Kategori: <a href={`/${page.kategori.slug_kategori}`}>{page.kategori.nama_kategori}</a>
                    </p>
                )}
                <div dangerouslySetInnerHTML={{ __html: page.konten }} />
            </div>
        )
    }

    // Cek apakah ini berita
    const newsItem = await prisma.beritas.findFirst({
        where: { slug_berita: lastSegment },
        include: { kategori: true }
    })

    if (newsItem) {
        return (
            <div>
                <h1>{newsItem.judul_berita}</h1>
                {newsItem.kategori && (
                    <p>
                        Kategori: <a href={`/${newsItem.kategori.slug_kategori}`}>{newsItem.kategori.nama_kategori}</a>
                    </p>
                )}
                <div dangerouslySetInnerHTML={{ __html: newsItem.isi }} />
            </div>
        )
    }

    return notFound()
}
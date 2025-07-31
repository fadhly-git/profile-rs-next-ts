import { prisma } from "@/lib/prisma"
import { EnumRoleUsers } from "@prisma/client"
import {
    Users,
    FileText,
    Calendar,
    Activity,
    TrendingUp,
    Eye
} from "lucide-react"
import Link from "next/link"

type RecentNewsItem = {
    id_berita: bigint
    judul_berita: string
    tanggal_post: Date | null
    status_berita: "publish" | "draft"
    hits?: number | null
    user: {
        id: bigint              // 👈 Gunakan `id` bukan `id_user`
        name: string
        email: string
        email_verified_at: Date | null
        password: string
        gambar: string | null
        remember_token: string | null
        role: EnumRoleUsers
        deleted_at: Date | null
        createdAt: Date | null
        updatedAt: Date | null
    }
    slug_berita: string
    thumbnail?: string | null
    gambar?: string | null
    icon?: string | null
    kategori?: {
        nama_kategori: string
    }
}

async function getDashboardStats() {
    try {
        const [
            totalDoctors,
            totalNews,
            totalSchedules,
            publishedNews,
            totalNewsHits,
            recentNews
        ] = await Promise.all([
            prisma.dokters.count(),
            prisma.beritas.count(),
            prisma.jadwalDokters.count(),
            prisma.beritas.count({
                where: { status_berita: 'publish' } // enum value from schema
            }),
            prisma.beritas.aggregate({
                _sum: { hits: true }
            }),
            prisma.beritas.findMany({
                take: 5,
                orderBy: { tanggal_post: 'desc' },
                include: {
                    user: true,
                    kategori: true // opsional jika Anda ingin data kategori juga
                }
            })
        ])

        return {
            totalDoctors,
            totalNews,
            totalSchedules,
            publishedNews,
            totalNewsHits: totalNewsHits._sum.hits || 0,
            recentNews
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return {
            totalDoctors: 0,
            totalNews: 0,
            totalSchedules: 0,
            publishedNews: 0,
            totalNewsHits: 0,
            recentNews: []
        }
    }
}

export default async function AdminDashboard() {
    const stats = await getDashboardStats()

    const statsCards = [
        {
            title: "Total Dokter",
            value: stats.totalDoctors,
            icon: Users,
            color: "bg-blue-500",
            textColor: "text-blue-600"
        },
        {
            title: "Total Berita",
            value: stats.totalNews,
            icon: FileText,
            color: "bg-green-500",
            textColor: "text-green-600"
        },
        {
            title: "Berita Published",
            value: stats.publishedNews,
            icon: TrendingUp,
            color: "bg-purple-500",
            textColor: "text-purple-600"
        },
        {
            title: "Jadwal Dokter",
            value: stats.totalSchedules,
            icon: Calendar,
            color: "bg-orange-500",
            textColor: "text-orange-600"
        },
        {
            title: "Total Views",
            value: stats.totalNewsHits,
            icon: Eye,
            color: "bg-red-500",
            textColor: "text-red-600"
        }
    ]

    return (
        <div className="space-y-6 min-h-screen p-6 bg-background">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-primary/70">Dashboard</h1>
                <div className="text-sm text-primary">
                    Selamat datang di panel admin
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {statsCards.map((card, index) => {
                    const IconComponent = card.icon
                    return (
                        <div key={index} className="bg-secondary p-6 rounded-lg shadow-sm border border-foreground">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm mb-1">{card.title}</p>
                                    <p className="text-2xl font-bold">{card.value}</p>
                                </div>
                                <div className={`p-3 rounded-full ${card.color}`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Recent News */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-secondary p-6 rounded-lg shadow-sm border border-foreground">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-primary/70">Berita Terbaru</h2>
                        <Activity className="w-5 h-5 " />
                    </div>
                    <div className="space-y-4">
                        {stats.recentNews.map((news: RecentNewsItem) => (
                            <div key={news.id_berita} className="flex items-start space-x-3 p-3 hover:bg-accent rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {news.judul_berita}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {news.user.name} • {news.tanggal_post ? new Date(news.tanggal_post).toLocaleDateString('id-ID') : "-"}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className={`px-2 py-1 text-xs rounded-lg ${news.status_berita === 'publish'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {news.status_berita}
                                        </span>
                                        {(news.hits ?? 0) > 0 && (
                                            <span className="text-xs text-gray-500 flex items-center">
                                                <Eye className="w-3 h-3 mr-1" />
                                                {news.hits}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {stats.recentNews.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">
                                Belum ada berita
                            </p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-secondary p-6 rounded-lg shadow-sm border border-foreground">
                    <h2 className="text-lg font-semibold text-primary/70 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href="/admin/berita/create"
                            className="block w-full text-left px-4 py-3 bg-blue-700 hover:bg-blue-500 rounded-lg transition-colors duration-200"
                        >
                            <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-blue-100" />
                                <span className="font-medium text-blue-200">Buat Berita Baru</span>
                            </div>
                        </Link>
                        <Link
                            href="/admin/data-dokter/create"
                            className="block w-full text-left px-4 py-3 bg-green-700 hover:bg-green-500 rounded-lg transition-colors duration-200"
                        >
                            <div className="flex items-center space-x-3">
                                <Users className="w-5 h-5 text-green-50" />
                                <span className="font-medium text-green-100">Tambah Dokter</span>
                            </div>
                        </Link>
                        <Link
                            href="/admin/jadwal-dokter"
                            className="block w-full text-left px-4 py-3 bg-purple-700 hover:bg-purple-500 rounded-lg transition-colors duration-200"
                        >
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-5 h-5 text-purple-50" />
                                <span className="font-medium text-purple-100">Atur Jadwal Dokter</span>
                            </div>
                        </Link>
                        <Link
                            href="/admin/website-settings"
                            className="block w-full text-left px-4 py-3 bg-orange-700 hover:bg-orange-500 rounded-lg transition-colors duration-200"
                        >
                            <div className="flex items-center space-x-3">
                                <Activity className="w-5 h-5 text-orange-50" />
                                <span className="font-medium text-orange-100">Pengaturan Website</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
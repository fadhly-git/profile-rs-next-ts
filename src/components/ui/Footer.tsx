"use client"
import Link from 'next/link'
import Image from 'next/image'
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Phone,
    Mail,
    MapPin,
    Clock,
    ArrowUp,
    ExternalLink,
} from 'lucide-react'

interface FooterProps {
    settings: {
        website_name?: string | null
        logo_url?: string | null
        phone?: string | null
        email?: string | null
        address?: string | null
        url_maps?: string | null
        facebook_url?: string | null
        twitter_url?: string | null
        instagram_url?: string | null
        youtube_url?: string | null
        footer_text?: string | null
        copyright_text?: string | null
        logo_akreditasi_url?: string | null
        nama_akreditasi?: string | null
    } | null
    menuCategories?: {
        id_kategori: number
        nama_kategori: string
        slug_kategori: string
        children: {
            id_kategori: number
            nama_kategori: string
            slug_kategori: string
        }[]
        Halaman: {
            id_halaman: number
            judul: string
            slug: string
        }[]
    }[]
}

export default function Footer({ settings, menuCategories = [] }: FooterProps) {
    const currentYear = new Date().getFullYear()

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    // Get social media links
    const socialLinks = [
        {
            name: 'Facebook',
            url: settings?.facebook_url,
            icon: Facebook,
            color: 'hover:bg-blue-600',
            bgColor: 'bg-blue-500'
        },
        {
            name: 'Twitter',
            url: settings?.twitter_url,
            icon: Twitter,
            color: 'hover:bg-sky-600',
            bgColor: 'bg-sky-500'
        },
        {
            name: 'Instagram',
            url: settings?.instagram_url,
            icon: Instagram,
            color: 'hover:bg-pink-600',
            bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500'
        },
        {
            name: 'YouTube',
            url: settings?.youtube_url,
            icon: Youtube,
            color: 'hover:bg-red-600',
            bgColor: 'bg-red-500'
        }
    ].filter(social => social.url)

    // Get main menu categories (limit to 6 for better layout)
    const mainMenuCategories = menuCategories.slice(0, 6)

    // Get quick links from first category's pages or use default
    const quickLinks = menuCategories.length > 0 && menuCategories[0].Halaman.length > 0
        ? menuCategories[0].Halaman.slice(0, 5).map(page => ({
            name: page.judul,
            href: `/${menuCategories[0].slug_kategori}/${page.slug}`
        }))
        : [
            { name: 'Tentang Kami', href: '/tentang-kami' },
            { name: 'Visi & Misi', href: '/tentang-kami/visi-misi' },
            { name: 'Sejarah', href: '/tentang-kami/sejarah' },
            { name: 'Struktur Organisasi', href: '/tentang-kami/struktur-organisasi' },
            { name: 'Penghargaan', href: '/tentang-kami/penghargaan' },
        ]

    // Get services from categories
    const services = menuCategories.find(cat =>
        cat.slug_kategori.includes('layanan') ||
        cat.slug_kategori.includes('service') ||
        cat.nama_kategori.toLowerCase().includes('layanan')
    )?.Halaman.slice(0, 5).map(page => ({
        name: page.judul,
        href: `/${menuCategories.find(cat =>
            cat.slug_kategori.includes('layanan') ||
            cat.slug_kategori.includes('service') ||
            cat.nama_kategori.toLowerCase().includes('layanan')
        )?.slug_kategori}/${page.slug}`
    })) || [
            { name: 'Instalasi Gawat Darurat', href: '/layanan/igd' },
            { name: 'Rawat Jalan', href: '/layanan/rawat-jalan' },
            { name: 'Rawat Inap', href: '/layanan/rawat-inap' },
            { name: 'Laboratorium', href: '/layanan/laboratorium' },
            { name: 'Radiologi', href: '/layanan/radiologi' },
        ]

    return (
        <>
            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 z-40 p-3 bg-[#07b8b2] text-white rounded-full shadow-lg hover:bg-teal-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#07b8b2] focus:ring-opacity-50"
                aria-label="Scroll to top"
            >
                <ArrowUp className="w-5 h-5" />
            </button>

            <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Main Footer Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        {/* Company Info - Spans 2 columns on large screens */}
                        <div className="lg:col-span-2">
                            {/* Logo and Title */}
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="flex items-center space-x-3">
                                    {settings?.logo_url ? (
                                        <div className="relative">
                                            <Image
                                                src={settings.logo_url}
                                                alt="Hospital Logo"
                                                width={48}
                                                height={48}
                                                style={{ width: "auto", height: "auto" }}
                                                className="h-12 w-auto"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-r from-[#07b8b2] to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <span className="text-white font-bold text-xl">
                                                {settings?.website_name?.charAt(0) || 'H'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Accreditation Logo */}
                                    {settings?.logo_akreditasi_url && (
                                        <div className="relative">
                                            <Image
                                                src={settings.logo_akreditasi_url}
                                                alt="Accreditation"
                                                width={48}
                                                height={48}
                                                style={{ width: "auto", height: "auto" }}
                                                className="h-12 w-auto"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                {settings?.website_name || 'Rumah Sakit'}
                            </h3>

                            {settings?.nama_akreditasi && (
                                <p className="text-[#07b8b2] font-medium text-sm mb-4">
                                    {settings.nama_akreditasi}
                                </p>
                            )}

                            {settings?.footer_text && (
                                <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                                    {settings.footer_text}
                                </p>
                            )}

                            {/* Contact Info */}
                            <div className="space-y-4">
                                {settings?.phone && (
                                    <Link
                                        href={`tel:${settings.phone}`}
                                        className="flex items-center space-x-3 text-gray-300 hover:text-[#07b8b2] transition-colors duration-200 group"
                                    >
                                        <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-[#07b8b2] transition-colors duration-200">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Telepon</p>
                                            <p className="font-medium">{settings.phone}</p>
                                        </div>
                                    </Link>
                                )}

                                {settings?.email && (
                                    <Link
                                        href={`mailto:${settings.email}`}
                                        className="flex items-center space-x-3 text-gray-300 hover:text-[#07b8b2] transition-colors duration-200 group"
                                    >
                                        <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-[#07b8b2] transition-colors duration-200">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                                            <p className="font-medium">{settings.email}</p>
                                        </div>
                                    </Link>
                                )}

                                {settings?.address && (
                                    <div className="flex items-start space-x-3 text-gray-300">
                                        <div className="p-2 bg-gray-800 rounded-lg mt-1">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Alamat</p>
                                            <p className="font-medium leading-relaxed mb-2">{settings.address}</p>

                                            {/* Maps Button */}
                                            {settings?.url_maps && (
                                                <button
                                                    onClick={() => {
                                                        // Extract maps URL from iframe
                                                        const iframe = settings.url_maps;
                                                        const srcMatch = iframe?.match(/src="([^"]*)"/);
                                                        if (srcMatch) {
                                                            window.open(srcMatch[1], '_blank');
                                                        }
                                                    }}
                                                    className="inline-flex items-center space-x-1 text-[#07b8b2] hover:text-teal-300 transition-colors duration-200 text-sm group"
                                                >
                                                    <span>Lihat di Maps</span>
                                                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                                                </button>
                                            )}

                                            {/* Alternative: Embedded Maps Preview */}
                                            {settings?.url_maps && (
                                                <div className="mt-4 rounded-lg overflow-hidden p-1">
                                                    <div
                                                        className="w-full h-32 rounded cursor-pointer hover:opacity-90 transition-opacity relative group"
                                                        onClick={() => {
                                                            const iframe = settings.url_maps;
                                                            const srcMatch = iframe?.match(/src="([^"]*)"/);
                                                            if (srcMatch) {
                                                                window.open(srcMatch[1], '_blank');
                                                            }
                                                        }}
                                                    >
                                                        <div
                                                            dangerouslySetInnerHTML={{ __html: settings.url_maps }}
                                                            className="w-full h-full pointer-events-none"
                                                            style={{
                                                                transform: 'scale(0.8)',
                                                                transformOrigin: 'top left',
                                                                width: '125%',
                                                                height: '125%'
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                                                            <div className="bg-[#07b8b2] text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                Klik untuk buka Maps
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Operating Hours */}
                                <div className="flex items-start space-x-3 text-gray-300">
                                    <div className="p-2 bg-gray-800 rounded-lg">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Jam Operasional</p>
                                        <p className="font-medium">24 Jam Setiap Hari</p>
                                        <p className="text-sm text-gray-400">Siap melayani Anda</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-white relative">
                                Menu Utama
                                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#07b8b2] rounded-full"></div>
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        href="/"
                                        className="text-gray-300 hover:text-[#07b8b2] text-sm transition-all duration-200 flex items-center group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3 group-hover:bg-[#07b8b2] transition-colors duration-200"></span>
                                        Beranda
                                    </Link>
                                </li>
                                {quickLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-300 hover:text-[#07b8b2] text-sm transition-all duration-200 flex items-center group"
                                        >
                                            <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3 group-hover:bg-[#07b8b2] transition-colors duration-200"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-white relative">
                                Layanan Utama
                                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#07b8b2] rounded-full"></div>
                            </h3>
                            <ul className="space-y-3">
                                {services.map((service) => (
                                    <li key={service.name}>
                                        <Link
                                            href={service.href}
                                            className="text-gray-300 hover:text-[#07b8b2] text-sm transition-all duration-200 flex items-center group"
                                        >
                                            <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3 group-hover:bg-[#07b8b2] transition-colors duration-200"></span>
                                            {service.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Categories & Social Media */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-white relative">
                                Kategori Lainnya
                                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#07b8b2] rounded-full"></div>
                            </h3>
                            <ul className="space-y-3 mb-8">
                                {mainMenuCategories.map((category) => (
                                    <li key={category.id_kategori}>
                                        <Link
                                            href={`/${category.slug_kategori}`}
                                            className="text-gray-300 hover:text-[#07b8b2] text-sm transition-all duration-200 flex items-center group"
                                        >
                                            <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3 group-hover:bg-[#07b8b2] transition-colors duration-200"></span>
                                            {category.nama_kategori}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* Social Media */}
                            {socialLinks.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold mb-4 text-white relative">
                                        Ikuti Kami
                                        <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#07b8b2] rounded-full"></div>
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {socialLinks.map((social) => {
                                            const Icon = social.icon
                                            return (
                                                <Link
                                                    key={social.name}
                                                    href={social.url!}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`group relative p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${social.bgColor} shadow-lg hover:shadow-xl`}
                                                    aria-label={`Follow us on ${social.name}`}
                                                >
                                                    <Icon className="w-5 h-5 text-white" />

                                                    {/* Tooltip */}
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                        {social.name}
                                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black"></div>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="relative border-t border-gray-800 bg-black bg-opacity-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 text-sm text-gray-400">
                                <span>
                                    {settings?.copyright_text || `© ${currentYear} ${settings?.website_name || 'Rumah Sakit'}. All rights reserved.`}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Link
                                    href="/kebijakan-privasi"
                                    className="text-sm text-gray-400 hover:text-[#07b8b2] transition-colors duration-200 flex items-center space-x-1 group"
                                >
                                    <span>Kebijakan Privasi</span>
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                </Link>
                                <span className="text-gray-600">•</span>
                                <Link
                                    href="/syarat-layanan"
                                    className="text-sm text-gray-400 hover:text-[#07b8b2] transition-colors duration-200 flex items-center space-x-1 group"
                                >
                                    <span>Syarat & Ketentuan</span>
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                </Link>
                                <span className="text-gray-600">•</span>
                                <Link
                                    href="/hubungi-kami/kontak-kami"
                                    className="text-sm text-gray-400 hover:text-[#07b8b2] transition-colors duration-200 flex items-center space-x-1 group"
                                >
                                    <span>Kritik & Saran</span>
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
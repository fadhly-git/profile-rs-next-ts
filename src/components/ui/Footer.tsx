"use client"
import Link from 'next/link'
import Image from 'next/image'
import {
    Facebook,
    Instagram,
    Youtube,
    Phone,
    Mail,
    MapPin,
    Clock,
    ArrowUp,
    ExternalLink,
} from 'lucide-react'

export const TiktokIcon = ({ className }: { className?: string }) => (
    <svg className={className ?? "w-6 h-6"} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.45095 19.7926C8.60723 18.4987 9.1379 17.7743 10.1379 17.0317C11.5688 16.0259 13.3561 16.5948 13.3561 16.5948V13.2197C13.7907 13.2085 14.2254 13.2343 14.6551 13.2966V17.6401C14.6551 17.6401 12.8683 17.0712 11.4375 18.0775C10.438 18.8196 9.90623 19.5446 9.7505 20.8385C9.74562 21.5411 9.87747 22.4595 10.4847 23.2536C10.3345 23.1766 10.1815 23.0889 10.0256 22.9905C8.68807 22.0923 8.44444 20.7449 8.45095 19.7926ZM22.0352 6.97898C21.0509 5.90039 20.6786 4.81139 20.5441 4.04639H21.7823C21.7823 4.04639 21.5354 6.05224 23.3347 8.02482L23.3597 8.05134C22.8747 7.7463 22.43 7.38624 22.0352 6.97898ZM28 10.0369V14.293C28 14.293 26.42 14.2312 25.2507 13.9337C23.6179 13.5176 22.5685 12.8795 22.5685 12.8795C22.5685 12.8795 21.8436 12.4245 21.785 12.3928V21.1817C21.785 21.6711 21.651 22.8932 21.2424 23.9125C20.709 25.246 19.8859 26.1212 19.7345 26.3001C19.7345 26.3001 18.7334 27.4832 16.9672 28.28C15.3752 28.9987 13.9774 28.9805 13.5596 28.9987C13.5596 28.9987 11.1434 29.0944 8.96915 27.6814C8.49898 27.3699 8.06011 27.0172 7.6582 26.6277L7.66906 26.6355C9.84383 28.0485 12.2595 27.9528 12.2595 27.9528C12.6779 27.9346 14.0756 27.9528 15.6671 27.2341C17.4317 26.4374 18.4344 25.2543 18.4344 25.2543C18.5842 25.0754 19.4111 24.2001 19.9423 22.8662C20.3498 21.8474 20.4849 20.6247 20.4849 20.1354V11.3475C20.5435 11.3797 21.2679 11.8347 21.2679 11.8347C21.2679 11.8347 22.3179 12.4734 23.9506 12.8889C25.1204 13.1864 26.7 13.2483 26.7 13.2483V9.91314C27.2404 10.0343 27.7011 10.0671 28 10.0369Z" fill="#EE1D52" />
        <path d="M26.7009 9.91314V13.2472C26.7009 13.2472 25.1213 13.1853 23.9515 12.8879C22.3188 12.4718 21.2688 11.8337 21.2688 11.8337C21.2688 11.8337 20.5444 11.3787 20.4858 11.3464V20.1364C20.4858 20.6258 20.3518 21.8484 19.9432 22.8672C19.4098 24.2012 18.5867 25.0764 18.4353 25.2553C18.4353 25.2553 17.4337 26.4384 15.668 27.2352C14.0765 27.9539 12.6788 27.9357 12.2604 27.9539C12.2604 27.9539 9.84473 28.0496 7.66995 26.6366L7.6591 26.6288C7.42949 26.4064 7.21336 26.1717 7.01177 25.9257C6.31777 25.0795 5.89237 24.0789 5.78547 23.7934C5.78529 23.7922 5.78529 23.791 5.78547 23.7898C5.61347 23.2937 5.25209 22.1022 5.30147 20.9482C5.38883 18.9122 6.10507 17.6625 6.29444 17.3494C6.79597 16.4957 7.44828 15.7318 8.22233 15.0919C8.90538 14.5396 9.6796 14.1002 10.5132 13.7917C11.4144 13.4295 12.3794 13.2353 13.3565 13.2197V16.5948C13.3565 16.5948 11.5691 16.028 10.1388 17.0317C9.13879 17.7743 8.60812 18.4987 8.45185 19.7926C8.44534 20.7449 8.68897 22.0923 10.0254 22.991C10.1813 23.0898 10.3343 23.1775 10.4845 23.2541C10.7179 23.5576 11.0021 23.8221 11.3255 24.0368C12.631 24.8632 13.7249 24.9209 15.1238 24.3842C16.0565 24.0254 16.7586 23.2167 17.0842 22.3206C17.2888 21.7611 17.2861 21.1978 17.2861 20.6154V4.04639H20.5417C20.6763 4.81139 21.0485 5.90039 22.0328 6.97898C22.4276 7.38624 22.8724 7.7463 23.3573 8.05134C23.5006 8.19955 24.2331 8.93231 25.1734 9.38216C25.6596 9.61469 26.1722 9.79285 26.7009 9.91314Z" fill="#000000" />
        <path d="M4.48926 22.7568V22.7594L4.57004 22.9784C4.56076 22.9529 4.53074 22.8754 4.48926 22.7568Z" fill="#69C9D0" />
        <path d="M10.5128 13.7916C9.67919 14.1002 8.90498 14.5396 8.22192 15.0918C7.44763 15.7332 6.79548 16.4987 6.29458 17.354C6.10521 17.6661 5.38897 18.9168 5.30161 20.9528C5.25223 22.1068 5.61361 23.2983 5.78561 23.7944C5.78543 23.7956 5.78543 23.7968 5.78561 23.798C5.89413 24.081 6.31791 25.0815 7.01191 25.9303C7.2135 26.1763 7.42963 26.4111 7.65924 26.6334C6.92357 26.1457 6.26746 25.5562 5.71236 24.8839C5.02433 24.0451 4.60001 23.0549 4.48932 22.7626C4.48919 22.7605 4.48919 22.7584 4.48932 22.7564V22.7527C4.31677 22.2571 3.95431 21.0651 4.00477 19.9096C4.09213 17.8736 4.80838 16.6239 4.99775 16.3108C5.4985 15.4553 6.15067 14.6898 6.92509 14.0486C7.608 13.4961 8.38225 13.0567 9.21598 12.7484C9.73602 12.5416 10.2778 12.3891 10.8319 12.2934C11.6669 12.1537 12.5198 12.1415 13.3588 12.2575V13.2196C12.3808 13.2349 11.4148 13.4291 10.5128 13.7916Z" fill="#69C9D0" />
        <path d="M20.5438 4.04635H17.2881V20.6159C17.2881 21.1983 17.2881 21.76 17.0863 22.3211C16.7575 23.2167 16.058 24.0253 15.1258 24.3842C13.7265 24.923 12.6326 24.8632 11.3276 24.0368C11.0036 23.823 10.7187 23.5594 10.4844 23.2567C11.5962 23.8251 12.5913 23.8152 13.8241 23.341C14.7558 22.9821 15.4563 22.1734 15.784 21.2774C15.9891 20.7178 15.9864 20.1546 15.9864 19.5726V3H20.4819C20.4819 3 20.4315 3.41188 20.5438 4.04635ZM26.7002 8.99104V9.9131C26.1725 9.79263 25.6609 9.61447 25.1755 9.38213C24.2352 8.93228 23.5026 8.19952 23.3594 8.0513C23.5256 8.1559 23.6981 8.25106 23.8759 8.33629C25.0192 8.88339 26.1451 9.04669 26.7002 8.99104Z" fill="#69C9D0" />
    </svg>
)

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
            name: 'TikTok',
            url: settings?.twitter_url,
            icon: TiktokIcon,
            color: 'hover:bg-sky-200',
            bgColor: 'bg-sky-50'
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
                                                width={130}
                                                height={130}
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
                                                width={120}
                                                height={120}
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
                                    href="/hubungi-kami"
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
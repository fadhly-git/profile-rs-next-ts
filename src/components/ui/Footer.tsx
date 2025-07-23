import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react'

interface FooterProps {
    settings: {
        website_name?: string | null
        logo_url?: string | null
        phone?: string | null
        email?: string | null
        address?: string | null
        facebook_url?: string | null
        twitter_url?: string | null
        instagram_url?: string | null
        youtube_url?: string | null
        footer_text?: string | null
        copyright_text?: string | null
        logo_akreditasi_url?: string | null
        nama_akreditasi?: string | null
    } | null
}

const quickLinks = [
    { name: 'Tentang Kami', href: '/tentang-kami' },
    { name: 'Layanan', href: '/layanan' },
    { name: 'Dokter', href: '/dokter' },
    { name: 'Berita', href: '/berita' },
    { name: 'Kontak', href: '/kontak' },
]

const services = [
    { name: 'Instalasi Gawat Darurat', href: '/layanan/igd' },
    { name: 'Rawat Jalan', href: '/layanan/rawat-jalan' },
    { name: 'Rawat Inap', href: '/layanan/rawat-inap' },
    { name: 'Laboratorium', href: '/layanan/laboratorium' },
    { name: 'Radiologi', href: '/layanan/radiologi' },
]

export default function Footer({ settings }: FooterProps) {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-4">
                            {settings?.logo_url ? (
                                <Image
                                    src={settings.logo_url}
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    className="h-10 w-auto"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">H</span>
                                </div>
                            )}
                            <h3 className="text-lg font-bold">
                                {settings?.website_name || 'Hospital'}
                            </h3>
                        </div>

                        {settings?.footer_text && (
                            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                                {settings.footer_text}
                            </p>
                        )}

                        {/* Contact Info */}
                        <div className="space-y-2">
                            {settings?.phone && (
                                <div className="flex items-center space-x-2 text-sm">
                                    <Phone className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-300">{settings.phone}</span>
                                </div>
                            )}
                            {settings?.email && (
                                <div className="flex items-center space-x-2 text-sm">
                                    <Mail className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-300">{settings.email}</span>
                                </div>
                            )}
                            {settings?.address && (
                                <div className="flex items-start space-x-2 text-sm">
                                    <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
                                    <span className="text-gray-300">{settings.address}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Menu Utama</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Layanan</h3>
                        <ul className="space-y-2">
                            {services.map((service) => (
                                <li key={service.name}>
                                    <Link
                                        href={service.href}
                                        className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                                    >
                                        {service.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Media & Accreditation */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Ikuti Kami</h3>
                        <div className="flex space-x-3 mb-6">
                            {settings?.facebook_url && (
                                <a
                                    href={settings.facebook_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    <Facebook className="w-4 h-4" />
                                </a>
                            )}
                            {settings?.twitter_url && (
                                <a
                                    href={settings.twitter_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-blue-400 rounded-lg hover:bg-blue-500 transition-colors duration-200"
                                >
                                    <Twitter className="w-4 h-4" />
                                </a>
                            )}
                            {settings?.instagram_url && (
                                <a
                                    href={settings.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors duration-200"
                                >
                                    <Instagram className="w-4 h-4" />
                                </a>
                            )}
                            {settings?.youtube_url && (
                                <a
                                    href={settings.youtube_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
                                >
                                    <Youtube className="w-4 h-4" />
                                </a>
                            )}
                        </div>

                        {/* Accreditation */}
                        {settings?.logo_akreditasi_url && (
                            <div>
                                <h4 className="text-sm font-semibold mb-2">Akreditasi</h4>
                                <div className="flex items-center space-x-2">
                                    <Image
                                        src={settings.logo_akreditasi_url}
                                        alt="Akreditasi"
                                        width={32}
                                        height={32}
                                        className="h-8 w-auto"
                                    />
                                    {settings?.nama_akreditasi && (
                                        <span className="text-xs text-gray-300">
                                            {settings.nama_akreditasi}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-400">
                            {settings?.copyright_text || `© ${currentYear} ${settings?.website_name || 'Hospital'}. All rights reserved.`}
                        </p>
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-white">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
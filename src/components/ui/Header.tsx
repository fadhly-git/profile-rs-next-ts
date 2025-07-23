'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react'

interface HeaderProps {
    settings: {
        website_name?: string | null
        logo_url?: string | null
        phone?: string | null
        email?: string | null
        address?: string | null
    } | null
}

const navigationItems = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/tentang-kami' },
    { name: 'Layanan', href: '/layanan' },
    { name: 'Dokter', href: '/dokter' },
    { name: 'Berita', href: '/berita' },
    { name: 'Kontak', href: '/kontak' },
]

export default function Header({ settings }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="bg-white shadow-sm">
            {/* Top bar */}
            <div className="bg-blue-600 text-white py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-6">
                            {settings?.phone && (
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{settings.phone}</span>
                                </div>
                            )}
                            {settings?.email && (
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4" />
                                    <span>{settings.email}</span>
                                </div>
                            )}
                        </div>
                        <div className="hidden md:flex items-center space-x-2">
                            {settings?.address && (
                                <>
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate max-w-xs">{settings.address}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3">
                            {settings?.logo_url ? (
                                <Image
                                    src={settings.logo_url}
                                    alt="Logo"
                                    width={48}
                                    height={48}
                                    className="h-12 w-auto"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">H</span>
                                </div>
                            )}
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    {settings?.website_name || 'Hospital'}
                                </h1>
                                <p className="text-sm text-gray-500">Healthcare Services</p>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200">
                    <div className="px-4 py-2 space-y-1 bg-white shadow-lg">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    )
}
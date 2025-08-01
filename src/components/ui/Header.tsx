'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  Mail,
  X,
  ChevronDown,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Clock,
  Home,
  MapPin
} from 'lucide-react';
import { WebsiteSettings, MenuCategory } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  websiteSettings: WebsiteSettings;
  menuCategories: MenuCategory[];
}

const Header: React.FC<HeaderProps> = ({ websiteSettings, menuCategories }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on link
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-trigger')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when screen size changes
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  const handleMouseEnter = (categoryId: number) => {
    if (isMobile) return;
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(categoryId);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const toggleMobileSubmenu = (categoryId: number) => {
    setActiveMobileSubmenu(activeMobileSubmenu === categoryId ? null : categoryId);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveMobileSubmenu(null);
  };

  const getSocialIcon = (platform: string) => {
    const iconClass = "w-4 h-4";
    switch (platform) {
      case 'facebook':
        return <Facebook className={iconClass} />;
      case 'twitter':
        return <Twitter className={iconClass} />;
      case 'instagram':
        return <Instagram className={iconClass} />;
      case 'youtube':
        return <Youtube className={iconClass} />;
      default:
        return null;
    }
  };

  const socialLinks = [
    { url: websiteSettings?.facebook_url, platform: 'facebook' },
    { url: websiteSettings?.twitter_url, platform: 'twitter' },
    { url: websiteSettings?.instagram_url, platform: 'instagram' },
    { url: websiteSettings?.youtube_url, platform: 'youtube' },
  ].filter(link => link.url);

  return (
    <>
      {/* Top Info Bar - Hidden on mobile for cleaner look */}
      {!isMobile && (
        <div className="bg-[#07b8b2] text-white">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between py-2 text-sm">
              {/* Contact Info */}
              <div className="flex items-center space-x-6">
                {websiteSettings?.phone && (
                  <div className="flex items-center gap-2 hover:text-teal-200 transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>{websiteSettings?.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Buka 24 Jam</span>
                </div>
                {websiteSettings?.email && (
                  <Link
                    href={`mailto:${websiteSettings?.email}`}
                    className="flex items-center gap-2 hover:text-teal-200 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{websiteSettings?.email}</span>
                  </Link>
                )}
                {/* Tambahkan Lokasi dengan Maps Link */}
                {websiteSettings?.address && (
                  <button
                    onClick={() => {
                      // Buka modal maps atau redirect ke maps
                      if (websiteSettings?.url_maps) {
                        // Extract maps URL from iframe
                        const iframe = websiteSettings.url_maps;
                        const srcMatch = iframe.match(/src="([^"]*)"/);
                        if (srcMatch) {
                          window.open(srcMatch[1], '_blank');
                        }
                      } else {
                        // Fallback ke Google Maps search
                        if (websiteSettings.address) {
                          window.open(`https://www.google.com/maps/search/${encodeURIComponent(websiteSettings.address)}`, '_blank');
                        }
                      }
                    }}
                    className="flex items-center gap-2 hover:text-teal-200 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-4 h-4" />
                    <span className="truncate max-w-48">{websiteSettings.address}</span>
                  </button>
                )}
              </div>

              {/* Social Media */}
              {socialLinks.length > 0 && (
                <div className="flex items-center space-x-3">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                      aria-label={`Follow us on ${social.platform}`}
                    >
                      {getSocialIcon(social.platform)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <header
        className={`sticky top-0 z-50 bg-white border-b transition-all duration-300 ${scrolled ? 'border-gray-200 shadow-lg' : 'border-gray-100'
          }`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 group">
                {websiteSettings?.logo_url && (
                  <div className="relative">
                    <Image
                      src={websiteSettings?.logo_url}
                      alt="Hospital Logo"
                      width={120}
                      height={120}
                      style={{ width: 'auto', height: 'auto' }}
                      className="w-32 h-32 object-contain transition-transform group-hover:scale-105"
                      priority
                    />
                  </div>
                )}

                {websiteSettings?.logo_akreditasi_url && (
                  <div className="relative">
                    <Image
                      src={websiteSettings?.logo_akreditasi_url}
                      alt="Accreditation"
                      width={72}
                      height={72}
                      style={{ width: 'auto', height: 'auto' }}
                      className="w-18 h-18 object-contain transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="flex items-center space-x-1">
                {/* Home Link */}
                <Link
                  href="/"
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-[#07b8b2] hover:bg-teal-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Beranda
                </Link>

                {/* Dynamic Categories */}
                {menuCategories?.map((category) => {
                  const hasSubmenu = category.children.length > 0 || category.Halaman.length > 0;

                  return (
                    <div
                      key={category.id_kategori}
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(category.id_kategori)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        href={`/${category.slug_kategori}`}
                        className="flex items-center px-4 py-2 text-gray-700 hover:text-[#07b8b2] hover:bg-teal-50 rounded-lg transition-all duration-200 font-medium"
                      >
                        {category.nama_kategori}
                        {hasSubmenu && (
                          <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200" />
                        )}
                      </Link>

                      {/* Desktop Dropdown */}
                      {hasSubmenu && (
                        <div
                          className={`absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 ${activeDropdown === category.id_kategori
                              ? 'opacity-100 visible transform translate-y-0'
                              : 'opacity-0 invisible transform -translate-y-2 pointer-events-none'
                            }`}
                          onMouseEnter={() => handleMouseEnter(category.id_kategori)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className="py-2 max-h-80 overflow-y-auto custom-scrollbar">
                            {/* Direct Pages */}
                            {category.Halaman.map((halaman) => (
                              <Link
                                key={halaman.id_halaman}
                                href={`/${category.slug_kategori}/${halaman.slug}`}
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-[#07b8b2] transition-colors group"
                              >
                                <div className="w-2 h-2 bg-teal-200 rounded-full mr-3 group-hover:bg-[#07b8b2] transition-colors" />
                                {halaman.judul}
                              </Link>
                            ))}

                            {/* Sub Categories */}
                            {category.children.map((child, index) => (
                              <div key={child.id_kategori}>
                                {(category.Halaman.length > 0 || index > 0) && (
                                  <div className="border-t border-gray-100 my-1" />
                                )}
                                <div className="flex items-center px-6 py-2.5 text-sm text-gray-600 hover:bg-teal-50 hover:text-[#07b8b2] transition-colors group">
                                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3 group-hover:bg-[#07b8b2] transition-colors" />
                                  {child.nama_kategori}
                                </div>

                                {child.Halaman.map((halaman) => (
                                  <Link
                                    key={halaman.id_halaman}
                                    href={`/${child.slug_kategori}/${halaman.slug}`}
                                    className="flex items-center px-6 py-2.5 text-sm text-gray-600 hover:bg-teal-50 hover:text-[#07b8b2] transition-colors group"
                                  >
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3 group-hover:bg-[#07b8b2] transition-colors" />
                                    {halaman.judul}
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="mobile-menu-trigger relative p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-50 transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'
            }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-50' : 'opacity-0'
              }`}
            onClick={closeMobileMenu}
          />

          {/* Menu Panel */}
          <div
            className={`mobile-menu-container absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-[#07b8b2] to-teal-600">
              <div className="flex items-center space-x-3">
                {websiteSettings.logo_url && (
                  <Image
                    src={websiteSettings.logo_url}
                    alt="Hospital Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                )}
                <span className="text-white font-semibold text-base">
                  {websiteSettings.website_name}
                </span>
              </div>

              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Home Link */}
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex items-center px-6 py-4 text-gray-700 hover:bg-teal-50 hover:text-[#07b8b2] transition-colors border-b border-gray-50"
              >
                <Home className="w-5 h-5 mr-3 text-[#07b8b2]" />
                <span className="font-medium">Beranda</span>
              </Link>

              {/* Category Links */}
              {menuCategories.map((category) => {
                const hasSubmenu = category.children.length > 0 || category.Halaman.length > 0;
                const isOpen = activeMobileSubmenu === category.id_kategori;

                return (
                  <div key={category.id_kategori} className="border-b border-gray-50">
                    <div className="flex items-center">
                      <Link
                        href={`/${category.slug_kategori}`}
                        onClick={closeMobileMenu}
                        className="flex-1 flex items-center text-sm px-6 py-4 text-gray-700 hover:text-[#07b8b2] transition-colors"
                      >
                        <span className="font-medium">{category.nama_kategori}</span>
                      </Link>

                      {hasSubmenu && (
                        <button
                          onClick={() => toggleMobileSubmenu(category.id_kategori)}
                          className="p-4 text-gray-400 hover:text-[#07b8b2] transition-colors"
                          aria-expanded={isOpen}
                        >
                          <ChevronRight
                            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''
                              }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Submenu */}
                    {hasSubmenu && (
                      <div
                        className={`bg-gray-50 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                      >
                        <div className="py-2">
                          {/* Direct Pages */}
                          {category.Halaman.map((halaman) => (
                            <Link
                              key={halaman.id_halaman}
                              href={`/${category.slug_kategori}/${halaman.slug}`}
                              onClick={closeMobileMenu}
                              className="flex items-center px-8 py-3 text-sm text-gray-600 hover:text-[#07b8b2] hover:bg-white transition-colors"
                            >
                              <div className="w-2 h-2 bg-teal-300 rounded-full mr-3" />
                              {halaman.judul}
                            </Link>
                          ))}

                          {/* Sub Categories */}
                          {category.children.map((child) => (
                            <div key={child.id_kategori}>
                              <div className="px-8 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {child.nama_kategori}
                              </div>

                              {child.Halaman.map((halaman) => (
                                <Link
                                  key={halaman.id_halaman}
                                  href={`/${child.slug_kategori}/${halaman.slug}`}
                                  onClick={closeMobileMenu}
                                  className="flex items-center px-10 py-2.5 text-sm text-gray-600 hover:text-[#07b8b2] hover:bg-white transition-colors"
                                >
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3" />
                                  {halaman.judul}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer - Contact Info */}
            <div className="border-t border-gray-100 p-4 bg-gray-50">
              <div className="space-y-3">
                {websiteSettings.phone && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-[#07b8b2] bg-opacity-10 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-[#07b8b2]" />
                    </div>
                    <span>{websiteSettings.phone}</span>
                  </div>
                )}

                {websiteSettings.email && (
                  <Link
                    href={`mailto:${websiteSettings.email}`}
                    className="flex items-center space-x-3 text-sm text-gray-600 hover:text-[#07b8b2] transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#07b8b2] bg-opacity-10 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-[#07b8b2]" />
                    </div>
                    <span>{websiteSettings.email}</span>
                  </Link>
                )}

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="flex items-center space-x-2 pt-2">
                    {socialLinks.map((social, index) => (
                      <Link
                        key={index}
                        href={social.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-[#07b8b2] bg-opacity-10 rounded-full flex items-center justify-center text-[#07b8b2] hover:bg-opacity-20 transition-colors"
                      >
                        {getSocialIcon(social.platform)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .hamburger {
          width: 18px;
          height: 14px;
          position: relative;
          transform: rotate(0deg);
          transition: .3s ease-in-out;
        }

        .hamburger span {
          display: block;
          position: absolute;
          height: 2px;
          width: 100%;
          background: #4a5568;
          border-radius: 1px;
          opacity: 1;
          left: 0;
          transform: rotate(0deg);
          transition: .15s ease-in-out;
        }

        .hamburger span:nth-child(1) {
          top: 0px;
        }

        .hamburger span:nth-child(2) {
          top: 6px;
        }

        .hamburger span:nth-child(3) {
          top: 12px;
        }

        .hamburger.active span:nth-child(1) {
          top: 6px;
          transform: rotate(135deg);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
          left: -20px;
        }

        .hamburger.active span:nth-child(3) {
          top: 6px;
          transform: rotate(-135deg);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #07b8b2;
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #059b94;
        }
      `}</style>
    </>
  );
};

export default Header;
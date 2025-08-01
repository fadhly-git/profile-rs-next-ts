import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import Link from 'next/link'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronRight,
  MessageSquare,
  Send
} from 'lucide-react'
import { KritikSaranForm } from '@/components/forms/kritik-saran-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Kontak Kami - Hubungi Rumah Sakit',
  description: 'Hubungi kami untuk informasi lebih lanjut, kritik, dan saran. Tersedia berbagai cara untuk menghubungi rumah sakit.'
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

// Contact Info Card Component
function ContactInfoCard({ 
  icon: Icon, 
  title, 
  content, 
  href,
  isExternal = false 
}: { 
  icon: React.ElementType
  title: string
  content: string | null
  href?: string
  isExternal?: boolean
}) {
  if (!content) return null

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (href) {
      if (isExternal) {
        return (
          <a 
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            {children}
          </a>
        )
      } else {
        return (
          <Link href={href} className="block group">
            {children}
          </Link>
        )
      }
    }
    return <div>{children}</div>
  }

  return (
    <CardWrapper>
      <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:border-[#07b8b2]">
        <CardContent className="p-2 px-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-[#07b8b2] bg-opacity-10 rounded-xl flex items-center justify-center group-hover:bg-[#07b8b2] transition-colors">
                <Icon className="w-6 h-6 text-[#07b8b2] group-hover:text-white text-white/90 transition-colors" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  )
}

// Social Media Links Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SocialMediaLinks({ settings }: { settings: any }) {
  const socialLinks = [
    { icon: Facebook, url: settings.facebook_url, name: 'Facebook' },
    { icon: Twitter, url: settings.twitter_url, name: 'Twitter' },
    { icon: Instagram, url: settings.instagram_url, name: 'Instagram' },
    { icon: Youtube, url: settings.youtube_url, name: 'YouTube' }
  ].filter(link => link.url)

  if (socialLinks.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-[#07b8b2]" />
          <span>Media Sosial</span>
        </CardTitle>
        <CardDescription>
          Ikuti kami di media sosial untuk informasi terbaru
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {socialLinks.map(({ icon: Icon, url, name }) => (
            <Link
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 hover:bg-[#07b8b2] hover:text-white hover:border-[#07b8b2] transition-colors"
              >
                <Icon className="w-4 h-4" />
                <span>{name}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Google Maps Component
function GoogleMapsSection({ mapsUrl }: { mapsUrl: string }) {
  // Extract iframe src from the full HTML if needed
  const getIframeSrc = (url: string) => {
    // If it's already a direct URL, return as is
    if (url.startsWith('https://www.google.com/maps/embed') || 
        url.startsWith('https://maps.google.com/')) {
      return url
    }
    
    // If it's HTML with iframe, extract src using regex
    const srcMatch = url.match(/src=["']([^"']*)["']/i)
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1]
    }
    
    // Fallback: if still contains iframe tags, try to extract any google maps URL
    const googleMapsMatch = url.match(/https:\/\/(?:www\.)?google\.com\/maps\/embed[^"'\s>]*/i)
    if (googleMapsMatch) {
      return googleMapsMatch[0]
    }
    
    return url
  }

  const iframeSrc = getIframeSrc(mapsUrl)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-[#07b8b2]" />
          <span>Lokasi Kami</span>
        </CardTitle>
        <CardDescription>
          Temukan lokasi rumah sakit kami di peta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
          <iframe
            src={iframeSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Rumah Sakit"
            className="w-full h-full"
          />
        </div>
        <div className="mt-4 flex justify-center">
          <Link
            href={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-[#07b8b2] hover:text-teal-700 transition-colors text-sm font-medium"
          >
            <MapPin className="w-4 h-4" />
            <span>Buka di Google Maps</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function KontakKamiPage() {
  try {
    // Ambil data website settings
    const settings = await prisma.websiteSettings.findFirst()

    const breadcrumbItems = [
      { label: 'Hubungi Kami', href: '/hubungi-kami' },
      { label: 'Kontak Kami' }
    ]

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Kontak Kami</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami siap membantu Anda. Hubungi kami melalui berbagai cara berikut atau 
              sampaikan kritik dan saran untuk pelayanan yang lebih baik.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Informasi Kontak</h2>
                <div className="space-y-4">
                  <ContactInfoCard
                    icon={MapPin}
                    title="Alamat"
                    content={settings?.address ?? null}
                  />
                  
                  <ContactInfoCard
                    icon={Phone}
                    title="Telepon"
                    content={settings?.phone ?? null}
                    href={settings?.phone ? `tel:${settings.phone}` : undefined}
                    isExternal={true}
                  />
                  
                  <ContactInfoCard
                    icon={Mail}
                    title="Email"
                    content={settings?.email ?? null}
                    href={settings?.email ? `mailto:${settings.email}` : undefined}
                    isExternal={true}
                  />
                  
                  <ContactInfoCard
                    icon={Clock}
                    title="Jam Operasional"
                    content="24 Jam (Setiap Hari)"
                  />
                </div>
              </div>

              {/* Social Media */}
              <SocialMediaLinks settings={settings} />

              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Penting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Buka 24 Jam
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Unit Gawat Darurat:</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Tersedia
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ambulans:</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      24 Jam
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Google Maps */}
              {settings?.url_maps && (
                <GoogleMapsSection mapsUrl={settings.url_maps} />
              )}

              {/* Kritik dan Saran Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Send className="w-5 h-5 text-[#07b8b2]" />
                    <span>Kritik dan Saran</span>
                  </CardTitle>
                  <CardDescription>
                    Sampaikan kritik dan saran Anda untuk membantu kami memberikan pelayanan yang lebih baik
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <KritikSaranForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading contact page:', error)
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h1>
          <p className="text-gray-600 mb-6">Maaf, terjadi kesalahan saat memuat halaman kontak.</p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#07b8b2] text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    )
  }
}
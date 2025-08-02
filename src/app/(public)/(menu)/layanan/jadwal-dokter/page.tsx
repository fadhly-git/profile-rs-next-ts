import { getWebsiteSetting, prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Calendar, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react'
import { notFound } from 'next/navigation'
import { JadwalDokterTable } from '@/components/jadwal-dokter/jadwal-dokter-table'

export const metadata: Metadata = {
  title: 'Jadwal Dokter | Layanan',
  description: 'Jadwal praktek dokter spesialis dan pelayanan kesehatan'
}

// Breadcrumb Component
function Breadcrumb() {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link 
        href="/" 
        className="hover:text-[#07b8b2] transition-colors"
      >
        Beranda
      </Link>
      <ChevronRight className="w-4 h-4 text-gray-400" />
      <Link 
        href="/layanan" 
        className="hover:text-[#07b8b2] transition-colors"
      >
        Layanan
      </Link>
      <ChevronRight className="w-4 h-4 text-gray-400" />
      <span className="text-gray-900 font-medium">Jadwal Dokter</span>
    </nav>
  )
}

// Fetch data jadwal dokter
async function getJadwalDokter() {
  try {
    const jadwalDokter = await prisma.dokters.findMany({
      include: {
        dokter_spesialis: {
          include: {
            spesialis: true
          }
        },
        JadwalDokters: {
          orderBy: [
            { hari: 'asc' },
            { jam_mulai: 'asc' }
          ]
        }
      },
      orderBy: {
        nama_dokter: 'asc'
      }
    })

    return jadwalDokter
  } catch (error) {
    console.error('Error fetching jadwal dokter:', error)
    return []
  }
}

export default async function JadwalDokterPage() {
  const jadwalDokter = await getJadwalDokter()
  const websiteSettings = await getWebsiteSetting();

  if (!jadwalDokter) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumb />
        
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-[#07b8b2] bg-opacity-10 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Jadwal Praktek Dokter Spesialis</h1>
              <p className="text-gray-600 mt-1">
                Informasi lengkap jadwal praktek dokter spesialis
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 text-yellow-600 mt-0.5">⚠️</div>
              <div>
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Penting:</span> Jadwal dapat berubah sewaktu-waktu. 
                  Silakan hubungi rumah sakit untuk konfirmasi sebelum berkunjung.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Jadwal Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <JadwalDokterTable data={jadwalDokter} />
        </div>
        
        {/* Info Tambahan */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Layanan</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Pendaftaran:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Pendaftaran dibuka pukul 07:00</li>
                <li>• Bawa kartu identitas (KTP) atau kartu BPJS, dan persiapkan aplikasi mobile JKN</li>
                <li>• Pasien rujukan wajib membawa surat rujukan</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Kontak Informasi:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Telepon: {websiteSettings?.phone}</li>
                <li>• Email: {websiteSettings?.email}</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/layanan"
            className="inline-flex items-center space-x-2 text-[#07b8b2] hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Layanan</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
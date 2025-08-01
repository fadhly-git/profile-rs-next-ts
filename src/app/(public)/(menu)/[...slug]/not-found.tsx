"use client"
import Link from 'next/link'
import { Search, ArrowLeft, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
                    {/* 404 Animation */}
                    <div className="mb-6">
                        <div className="text-8xl font-bold text-[#07b8b2] opacity-20 mb-4">
                            404
                        </div>
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <Search className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Halaman Tidak Ditemukan
                    </h1>
                    
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Maaf, halaman yang Anda cari tidak dapat ditemukan. 
                        Mungkin halaman telah dipindahkan, dihapus, atau URL yang Anda masukkan salah.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#07b8b2] text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                        >
                            <Home className="w-4 h-4" />
                            <span>Kembali ke Beranda</span>
                        </Link>
                        
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Halaman Sebelumnya</span>
                        </button>
                    </div>
                    
                    {/* Suggested Links */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-3">Atau coba kunjungi:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <Link 
                                href="/tentang-kami" 
                                className="text-sm text-[#07b8b2] hover:text-teal-700 transition-colors"
                            >
                                Tentang Kami
                            </Link>
                            <span className="text-gray-300">•</span>
                            <Link 
                                href="/layanan" 
                                className="text-sm text-[#07b8b2] hover:text-teal-700 transition-colors"
                            >
                                Layanan
                            </Link>
                            <span className="text-gray-300">•</span>
                            <Link 
                                href="/berita" 
                                className="text-sm text-[#07b8b2] hover:text-teal-700 transition-colors"
                            >
                                Berita
                            </Link>
                            <span className="text-gray-300">•</span>
                            <Link 
                                href="/kontak" 
                                className="text-sm text-[#07b8b2] hover:text-teal-700 transition-colors"
                            >
                                Kontak
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
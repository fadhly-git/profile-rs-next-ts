'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RefreshCw, ArrowLeft, AlertTriangle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Dynamic page error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-orange-600" />
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Terjadi Kesalahan
                    </h1>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Maaf, terjadi kesalahan saat memuat halaman. 
                        Silakan coba refresh halaman atau kembali ke beranda.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={reset}
                            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-[#07b8b2] text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Coba Lagi</span>
                        </button>
                        
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Kembali ke Beranda</span>
                        </Link>
                    </div>
                    
                    {process.env.NODE_ENV === 'development' && (
                        <details className="mt-6 text-left">
                            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                Detail Error (Development)
                            </summary>
                            <pre className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600 overflow-auto max-h-32">
                                {error.message}
                            </pre>
                        </details>
                    )}
                </div>
            </div>
        </div>
    )
}
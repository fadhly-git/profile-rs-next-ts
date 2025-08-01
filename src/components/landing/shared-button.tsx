'use client'

import { useState, useEffect } from 'react'
import { Share2 } from 'lucide-react'

export function ShareButton({ url, title }: { url: string; title: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  const shareData = {
    title,
    url: typeof window !== 'undefined' ? window.location.origin + url : url
  }

  const handleShare = async () => {
    if (isSharing) return // Prevent multiple shares

    
    if (navigator.share) {
      setIsSharing(true)
      try {
        await navigator.share(shareData)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // Hanya log error jika bukan user cancel
        if (error?.name !== 'AbortError') {
          console.error('Error sharing:', error)
        }
      } finally {
        setIsSharing(false)
      }
    } else {
      setIsOpen(!isOpen)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url)
      setIsOpen(false)
      
      // Simple toast notification
      const toast = document.createElement('div')
      toast.textContent = 'Link berhasil disalin!'
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity'
      document.body.appendChild(toast)
      
      setTimeout(() => {
        toast.style.opacity = '0'
        setTimeout(() => document.body.removeChild(toast), 300)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const shareToSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareData.url)
    const encodedTitle = encodeURIComponent(shareData.title)
    
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    }
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
      setIsOpen(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isOpen && !target.closest('[data-share-dropdown]')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" data-share-dropdown>
      <button 
        onClick={handleShare}
        disabled={isSharing}
        className={`flex items-center space-x-1 text-gray-600 hover:text-[#07b8b2] transition-colors ${
          isSharing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Share2 className={`w-4 h-4 ${isSharing ? 'animate-pulse' : ''}`} />
        <span>{isSharing ? 'Sharing...' : 'Bagikan'}</span>
      </button>
      
      {isOpen && !navigator.share && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="p-2">
            <button
              onClick={() => shareToSocial('whatsapp')}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>WhatsApp</span>
            </button>
            
            <button
              onClick={() => shareToSocial('facebook')}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              <span>Facebook</span>
            </button>
            
            <button
              onClick={() => shareToSocial('twitter')}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <div className="w-4 h-4 bg-sky-500 rounded-full"></div>
              <span>Twitter</span>
            </button>
            
            <button
              onClick={() => shareToSocial('telegram')}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>Telegram</span>
            </button>
            
            <button
              onClick={() => shareToSocial('linkedin')}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <div className="w-4 h-4 bg-blue-700 rounded-full"></div>
              <span>LinkedIn</span>
            </button>
            
            <hr className="my-2" />
            
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
              <span>Salin Link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
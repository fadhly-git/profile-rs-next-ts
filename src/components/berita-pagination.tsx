/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BeritaPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  basePath: string
  isLoading?: boolean
  onPageChange?: (page: number) => void
}

// Loading skeleton component
function PaginationSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      {/* Info skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      
      {/* Pagination skeleton */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  )
}

export default function BeritaPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  basePath,
  isLoading = false,
  onPageChange
}: BeritaPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Analytics tracking function
  const trackPageChange = useCallback((page: number, totalPages: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_change', {
        event_category: 'Pagination',
        event_label: `Page ${page} of ${totalPages}`,
        value: page
      })
    }
  }, [])

  // Auto scroll to top function
  const scrollToTop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }, [])

  // Build URL with preserved search parameters
  const buildUrl = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (page > 1) {
      params.set('page', page.toString())
    } else {
      params.delete('page')
    }

    const queryString = params.toString()
    return `${basePath}${queryString ? `?${queryString}` : ''}`
  }, [basePath, searchParams])

  // Handle page navigation
  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return
    }

    // Track analytics
    trackPageChange(page, totalPages)
    
    // Auto scroll
    scrollToTop()
    
    // Custom callback
    if (onPageChange) {
      onPageChange(page)
    }

    // Navigate to new URL
    const url = buildUrl(page)
    router.push(url)
  }, [currentPage, totalPages, trackPageChange, scrollToTop, onPageChange, buildUrl, router])

  // Generate page numbers array for pagination
  const generatePageNumbers = useCallback(() => {
    const pages: (number | 'ellipsis')[] = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Complex logic for ellipsis
      if (currentPage <= 4) {
        // Show first 5 pages, ellipsis, last page
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        // Show first page, ellipsis, last 5 pages
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }, [currentPage, totalPages])

  // Calculate display info
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Show loading skeleton
  if (isLoading) {
    return <PaginationSkeleton />
  }

  // Don't render if no pages
  if (totalPages <= 1) {
    return null
  }

  const pageNumbers = generatePageNumbers()

  return (
    <div className="flex flex-col space-y-4">
      {/* Info Display - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 text-sm text-gray-600">
        <div className="text-center sm:text-left">
          Menampilkan {startItem.toLocaleString()} - {endItem.toLocaleString()} dari {totalItems.toLocaleString()} hasil
        </div>
        <div className="text-center sm:text-right">
          Halaman {currentPage} dari {totalPages}
        </div>
      </div>

      {/* Pagination Component */}
      <Pagination className="justify-center">
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              href={currentPage > 1 ? buildUrl(currentPage - 1) : undefined}
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) {
                  handlePageChange(currentPage - 1)
                }
              }}
              className={`${
                currentPage <= 1 
                  ? 'pointer-events-none opacity-50' 
                  : 'hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </PaginationPrevious>
          </PaginationItem>

          {/* Page Numbers */}
          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={buildUrl(page)}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(page)
                  }}
                  isActive={page === currentPage}
                  className={`cursor-pointer ${
                    page === currentPage
                      ? 'bg-[#07b8b2] text-white hover:bg-[#07b8b2]/90'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              href={currentPage < totalPages ? buildUrl(currentPage + 1) : undefined}
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages) {
                  handlePageChange(currentPage + 1)
                }
              }}
              className={`${
                currentPage >= totalPages 
                  ? 'pointer-events-none opacity-50' 
                  : 'hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <ChevronRight className="h-4 w-4" />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Mobile Quick Jump - Only show on mobile for many pages */}
      {totalPages > 10 && (
        <div className="flex sm:hidden justify-center space-x-2">
          {currentPage > 3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              className="text-xs"
            >
              Halaman 1
            </Button>
          )}
          {currentPage < totalPages - 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              className="text-xs"
            >
              Halaman {totalPages}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
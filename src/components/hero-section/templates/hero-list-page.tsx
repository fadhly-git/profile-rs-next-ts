"use client"

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { HeroDataTable } from "@/components/hero-section/hero-data-table"
import type { HeroSection } from '@/types'

interface HeroListPageProps {
  data: HeroSection[]
}

function TableSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-full sm:w-32" />
      </div>
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-10 w-full sm:w-64" />
          <Skeleton className="h-10 w-20" />
        </div>
        <div className="border rounded-lg">
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function HeroListPage({ data }: HeroListPageProps) {
  return (
    <div className="container mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<TableSkeleton />}>
        <HeroDataTable data={data} />
      </Suspense>
    </div>
  )
}
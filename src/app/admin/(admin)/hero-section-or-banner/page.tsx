// app/admin/hero-section/page.tsx
import { DataTableHero } from "./data-table-hero"
import { getHeroSections } from "./actions"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

function TableSkeleton() {
    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-64" />
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

export default async function HeroSectionPage() {
    const heroSections = await getHeroSections()

    return (
        <div className="container mx-auto py-6">
            <Suspense fallback={<TableSkeleton />}>
                <DataTableHero data={heroSections} />
            </Suspense>
        </div>
    )
}
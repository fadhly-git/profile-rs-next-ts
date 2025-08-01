import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Breadcrumb skeleton */}
                <div className="flex items-center space-x-2 mb-6">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                </div>
                
                {/* Main content skeleton */}
                <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <Skeleton className="w-12 h-12 rounded-xl" />
                        <div className="flex-1">
                            <Skeleton className="h-8 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </div>
                </div>
                
                {/* Content grid skeleton */}
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Cards skeleton */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                                    <div className="flex items-start space-x-4">
                                        <Skeleton className="w-12 h-12 rounded-xl" />
                                        <div className="flex-1">
                                            <Skeleton className="h-5 w-3/4 mb-2" />
                                            <Skeleton className="h-4 w-full mb-1" />
                                            <Skeleton className="h-4 w-2/3" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Sidebar skeleton */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <Skeleton className="w-5 h-5" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-3 rounded-lg">
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
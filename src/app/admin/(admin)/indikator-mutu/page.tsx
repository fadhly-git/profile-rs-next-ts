// app/admin/indikator-mutu/page.tsx
import { Suspense } from "react"
import { IndikatorMutuDataTable } from "@/components/indikator-mutu/data-table-with-context"
import { getIndikatorMutu, getUniqueJuduls } from "@/lib/actions/indikator-mutu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function TableSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-4 w-[400px]" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Skeleton className="h-10 w-[300px]" />
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

async function IndikatorMutuTable() {
    // Fetch data di server component
    const [data, uniqueJuduls] = await Promise.all([
        getIndikatorMutu(),
        getUniqueJuduls()
    ])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manajemen Indikator Mutu</CardTitle>
                <CardDescription>
                    Kelola data indikator mutu untuk monitoring dan evaluasi kinerja.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <IndikatorMutuDataTable
                    data={data}
                    uniqueJuduls={uniqueJuduls}
                />
            </CardContent>
        </Card>
    )
}

export default function IndikatorMutuPage() {
    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Indikator Mutu</h1>
                <p className="text-muted-foreground">
                    Sistem input yang smart untuk mencegah kesalahan duplikasi data.
                </p>
            </div>

            <Suspense fallback={<TableSkeleton />}>
                <IndikatorMutuTable />
            </Suspense>
        </div>
    )
}
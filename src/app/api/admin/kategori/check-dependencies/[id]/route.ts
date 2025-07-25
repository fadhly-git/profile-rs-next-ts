/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/admin/kategori/check-dependencies/[id]/route.ts

import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const categoryId = BigInt(params.id)

        // Dapatkan semua kategori yang akan terpengaruh
        const childrenIds = await getAllChildrenRecursive(prisma, categoryId)
        const allCategoryIds = [categoryId, ...childrenIds]

        // Cek dependencies
        const dependencies = await Promise.all(
            allCategoryIds.map(async (id) => {
                const [beritaCount, halamanCount, kategori] = await Promise.all([
                    prisma.beritas.count({ where: { id_kategori: id } }),
                    prisma.halaman.count({ where: { kategoriId: id } }),
                    prisma.kategori.findUnique({
                        where: { id_kategori: id },
                        select: { nama_kategori: true }
                    })
                ])

                return {
                    categoryId: id.toString(),
                    categoryName: kategori?.nama_kategori,
                    beritaCount,
                    halamanCount,
                    hasData: beritaCount > 0 || halamanCount > 0
                }
            })
        )

        const totalBerita = dependencies.reduce((sum, dep) => sum + dep.beritaCount, 0)
        const totalHalaman = dependencies.reduce((sum, dep) => sum + dep.halamanCount, 0)
        const hasAnyDependencies = dependencies.some(dep => dep.hasData)

        return NextResponse.json({
            success: true,
            data: {
                affectedCategories: allCategoryIds.length,
                totalBerita,
                totalHalaman,
                hasAnyDependencies,
                dependencies: dependencies.filter(dep => dep.hasData)
            }
        })

    } catch (error) {
        console.error("Error checking dependencies:", error)
        return NextResponse.json({
            success: false,
            message: "Gagal memeriksa dependencies"
        }, { status: 500 })
    }
}

// Helper function (sama seperti di atas)
async function getAllChildrenRecursive(prisma: any, parentId: bigint): Promise<bigint[]> {
    const children = await prisma.kategori.findMany({
        where: { parent_id: parentId },
        select: { id_kategori: true }
    })

    let allChildren: bigint[] = []

    for (const child of children) {
        allChildren.push(child.id_kategori)
        const grandChildren = await getAllChildrenRecursive(prisma, child.id_kategori)
        allChildren = [...allChildren, ...grandChildren]
    }

    return allChildren
}
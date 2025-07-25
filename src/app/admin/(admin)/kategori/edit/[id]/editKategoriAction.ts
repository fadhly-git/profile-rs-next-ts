/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/(admin)/kategori/edit/[id]/editKategoriAction.ts
"use server"

import { prisma } from '@/lib/prisma'
import { revalidatePath } from "next/cache"
import { parseOptionalBigInt } from '@/lib/utils'

interface DependencyInfo {
    categoryId: bigint
    categoryName: string
    beritaCount: number
    halamanCount: number
}

interface UpdateResult {
    success: boolean
    message: string
    deactivatedCategories?: number
    affectedBerita?: number
    affectedHalaman?: number
    dependencies?: DependencyInfo[]
}



export async function updateKategoriAction(id: string, formData: FormData): Promise<UpdateResult> {
    try {

        const nama_kategori = formData.get("nama_kategori") as string
        const keterangan = formData.get("keterangan") as string
        const parentIdRaw = formData.get("parent_id")
        const parent_id = parseOptionalBigInt(parentIdRaw);

        const urutan = formData.get("urutan") ? parseInt(formData.get("urutan") as string) : null
        const gambar = formData.get("gambar") as string || null
        const is_main_menu = formData.get("is_main_menu") === "on"
        const is_active = formData.get("is_active") === "on"

        let result: UpdateResult

        await prisma.$transaction(async (tx) => {
            // Update kategori utama
            await tx.kategori.update({
                where: { id_kategori: BigInt(id) },
                data: {
                    nama_kategori,
                    keterangan,
                    parent_id,
                    urutan,
                    gambar,
                    is_main_menu,
                    is_active,
                    updatedAt: new Date()
                }
            })

            // Jika kategori dinonaktifkan, handle dependencies
            if (!is_active) {
                const deactivationResult = await deactivateWithDependencies(tx, BigInt(id))
                result = {
                    success: true,
                    message: `Kategori berhasil diupdate. ${deactivationResult.deactivatedCount} kategori dinonaktifkan, ${deactivationResult.beritaAffected} berita dinonaktifkan, ${deactivationResult.halamanAffected} halaman dinonaktifkan.`,
                    deactivatedCategories: deactivationResult.deactivatedCount,
                    affectedBerita: deactivationResult.beritaAffected,
                    affectedHalaman: deactivationResult.halamanAffected,
                    dependencies: deactivationResult.dependencies
                }
            } else {
                result = {
                    success: true,
                    message: "Kategori berhasil diupdate"
                }
            }
        })

        revalidatePath("/admin/kategori")
        return result!

    } catch (error) {
        console.error("Error updating kategori:", error)
        return {
            success: false,
            message: "Gagal mengupdate kategori"
        }
    }
}

// Alternative action dengan pilihan handling
export async function updateKategoriActionWithOptions(id: string, formData: FormData): Promise<UpdateResult> {
    try {
        const handleDependencies = formData.get("handle_dependencies") as string // "deactivate", "migrate", "keep"
        const migrateToId = formData.get("migrate_to_category") as string | null

        const nama_kategori = formData.get("nama_kategori") as string
        const keterangan = formData.get("keterangan") as string
        const parentIdRaw = formData.get("parent_id")
        const parent_id = parseOptionalBigInt(parentIdRaw);

        const urutan = formData.get("urutan") ? parseInt(formData.get("urutan") as string) : null
        const gambar = formData.get("gambar") as string || null
        const is_main_menu = formData.get("is_main_menu") === "on"
        const is_active = formData.get("is_active") === "on"

        let result: UpdateResult

        await prisma.$transaction(async (tx) => {
            // Update kategori utama
            await tx.kategori.update({
                where: { id_kategori: BigInt(id) },
                data: {
                    nama_kategori,
                    keterangan,
                    parent_id,
                    urutan,
                    gambar,
                    is_main_menu,
                    is_active,
                    updatedAt: new Date()
                }
            })

            if (!is_active) {
                switch (handleDependencies) {
                    case "deactivate":
                        const deactivationResult = await deactivateWithDependencies(tx, BigInt(id))
                        result = {
                            success: true,
                            message: `Kategori dan semua konten terkait berhasil dinonaktifkan.`,
                            deactivatedCategories: deactivationResult.deactivatedCount,
                            affectedBerita: deactivationResult.beritaAffected,
                            affectedHalaman: deactivationResult.halamanAffected
                        }
                        break

                    case "migrate":
                        if (!migrateToId) {
                            throw new Error("Kategori tujuan migrasi harus dipilih")
                        }
                        const migrationResult = await migrateAndDeactivate(tx, BigInt(id), BigInt(migrateToId))
                        result = {
                            success: true,
                            message: `Kategori dinonaktifkan dan konten dipindahkan ke kategori lain.`,
                            deactivatedCategories: migrationResult.deactivatedCount,
                            affectedBerita: migrationResult.beritaMigrated,
                            affectedHalaman: migrationResult.halamanMigrated
                        }
                        break

                    case "keep":
                        const keepResult = await deactivateCategoriesOnly(tx, BigInt(id))
                        result = {
                            success: true,
                            message: `Kategori dinonaktifkan, konten tetap dipertahankan.`,
                            deactivatedCategories: keepResult.deactivatedCount
                        }
                        break

                    default: {
                        const deactivationResult = await deactivateWithDependencies(tx, BigInt(id));
                        result = {
                            success: true,
                            message: "Kategori berhasil diupdate dengan penanganan default.",
                            deactivatedCategories: deactivationResult.deactivatedCount,
                            affectedBerita: deactivationResult.beritaAffected,
                            affectedHalaman: deactivationResult.halamanAffected,
                            dependencies: deactivationResult.dependencies
                        };
                        break;
                    }
                }
            } else {
                result = {
                    success: true,
                    message: "Kategori berhasil diupdate"
                }
            }
        })

        revalidatePath("/admin/kategori")
        return result!

    } catch (error: any) {
        console.error("Error updating kategori:", error)
        return {
            success: false,
            message: "Gagal mengupdate kategori: " + error.message
        }
    }
}

// Fungsi untuk migrasi konten ke kategori lain
async function migrateAndDeactivate(tx: any, parentId: bigint, targetCategoryId: bigint) {
    const childrenIds = await getAllChildrenRecursive(tx, parentId)
    const allCategoryIds = [parentId, ...childrenIds]

    // Pastikan kategori target aktif
    const targetCategory = await tx.kategori.findUnique({
        where: { id_kategori: targetCategoryId },
        select: { is_active: true }
    })

    if (!targetCategory?.is_active) {
        throw new Error("Kategori tujuan tidak aktif")
    }

    // Migrasi berita
    const beritaMigration = await tx.beritas.updateMany({
        where: {
            id_kategori: { in: allCategoryIds }
        },
        data: {
            id_kategori: targetCategoryId,
            updatedAt: new Date()
        }
    })

    // Migrasi halaman
    const halamanMigration = await tx.halaman.updateMany({
        where: {
            kategoriId: { in: allCategoryIds }
        },
        data: {
            kategoriId: targetCategoryId,
            updatedAt: new Date()
        }
    })

    // Nonaktifkan kategori
    await tx.kategori.updateMany({
        where: {
            id_kategori: { in: allCategoryIds }
        },
        data: {
            is_active: false,
            updatedAt: new Date()
        }
    })

    return {
        deactivatedCount: allCategoryIds.length,
        beritaMigrated: beritaMigration.count,
        halamanMigrated: halamanMigration.count
    }
}

// Fungsi untuk nonaktifkan kategori saja tanpa mengubah konten
async function deactivateCategoriesOnly(tx: any, parentId: bigint) {
    const childrenIds = await getAllChildrenRecursive(tx, parentId)
    const allCategoryIds = [parentId, ...childrenIds]

    // Hanya nonaktifkan kategori, konten tetap aktif
    await tx.kategori.updateMany({
        where: {
            id_kategori: { in: allCategoryIds }
        },
        data: {
            is_active: false,
            updatedAt: new Date()
        }
    })

    return {
        deactivatedCount: allCategoryIds.length
    }
}

// Fungsi untuk mendapatkan semua child kategori secara rekursif
async function getAllChildrenRecursive(tx: any, parentId: bigint): Promise<bigint[]> {
    const children = await tx.kategori.findMany({
        where: { parent_id: parentId },
        select: { id_kategori: true }
    })

    let allChildren: bigint[] = []

    for (const child of children) {
        allChildren.push(child.id_kategori)
        const grandChildren = await getAllChildrenRecursive(tx, child.id_kategori)
        allChildren = [...allChildren, ...grandChildren]
    }

    return allChildren
}

// Fungsi untuk cek dependency setiap kategori
async function checkCategoryDependencies(tx: any, categoryId: bigint) {
    const [beritaCount, halamanCount, categoryInfo] = await Promise.all([
        tx.beritas.count({ where: { id_kategori: categoryId } }),
        tx.halaman.count({ where: { kategoriId: categoryId } }),
        tx.kategori.findUnique({
            where: { id_kategori: categoryId },
            select: { nama_kategori: true }
        })
    ])

    return {
        categoryId,
        categoryName: categoryInfo?.nama_kategori || "Unknown",
        beritaCount,
        halamanCount,
        hasData: beritaCount > 0 || halamanCount > 0
    }
}

// Fungsi utama untuk deaktivasi dengan handle dependencies
async function deactivateWithDependencies(tx: any, parentId: bigint) {
    // Dapatkan semua kategori yang akan dinonaktifkan (parent + children)
    const childrenIds = await getAllChildrenRecursive(tx, parentId)
    const allCategoryIds = [parentId, ...childrenIds]

    // Cek dependencies untuk setiap kategori
    const dependencies: DependencyInfo[] = []
    let totalBeritaAffected = 0
    let totalHalamanAffected = 0

    for (const categoryId of allCategoryIds) {
        const deps = await checkCategoryDependencies(tx, categoryId)
        if (deps.hasData) {
            dependencies.push(deps)
            totalBeritaAffected += deps.beritaCount
            totalHalamanAffected += deps.halamanCount
        }
    }

    // Nonaktifkan semua kategori
    await tx.kategori.updateMany({
        where: {
            id_kategori: { in: allCategoryIds }
        },
        data: {
            is_active: false,
            updatedAt: new Date()
        }
    })

    // Nonaktifkan semua berita yang terkait
    const beritaUpdateResult = await tx.beritas.updateMany({
        where: {
            id_kategori: { in: allCategoryIds }
        },
        data: {
            status_berita: "draft", // Ubah status ke draft
            updatedAt: new Date()
        }
    })

    // Update halaman yang terkait (jika perlu dinonaktifkan)
    const halamanUpdateResult = await tx.halaman.updateMany({
        where: {
            kategoriId: { in: allCategoryIds }
        },
        data: {
            is_published: false,
            updatedAt: new Date()
        }
    })

    return {
        deactivatedCount: allCategoryIds.length,
        beritaAffected: beritaUpdateResult.count,
        halamanAffected: halamanUpdateResult.count,
        dependencies
    }
}

export async function getKategoriById(id: string) {
    try {
        const kategori = await prisma.kategori.findUnique({
            where: {
                id_kategori: BigInt(id)
            }
        });

        if (!kategori) return null;

        // Convert BigInt to string for serialization
        return {
            ...kategori,
            id_kategori: kategori.id_kategori.toString(),
            parent_id: kategori.parent_id?.toString() || null
        };
    } catch (error) {
        console.error("Error fetching kategori:", error);
        return null;
    }
}
/* 
export async function updateKategoriAction(id: string, formData: FormData) {
    try {
        const nama_kategori = formData.get("nama_kategori") as string
        const slug_kategori = formData.get("slug_kategori") as string
        const keterangan = formData.get("keterangan") as string
        const parent_id = parseOptionalBigInt(formData.get("parent_id"));
        const urutan = formData.get("urutan") ? parseInt(formData.get("urutan") as string) : null
        const gambar = formData.get("gambar") as string || null
        const is_main_menu = formData.get("is_main_menu") === "on"
        const is_active = formData.get("is_active") === "on"

        await prisma.kategori.update({
            where: {
                id_kategori: BigInt(id)
            },
            data: {
                nama_kategori,
                slug_kategori,
                keterangan,
                parent_id,
                urutan,
                gambar,
                is_main_menu,
                is_active,
            }
        })

        revalidatePath("/admin/kategori")
        return { success: true }
    } catch (error) {
        console.error("Error updating kategori:", error)
        throw new Error("Gagal mengupdate kategori")
    }
}
*/
export async function getKategoriListExcept(excludeId: string) {
    try {
        const kategoriList = await prisma.kategori.findMany({
            where: {
                is_active: true,
                NOT: {
                    id_kategori: BigInt(excludeId)
                }
            },
            select: {
                id_kategori: true,
                nama_kategori: true,
                parent_id: true,
            },
            orderBy: { nama_kategori: 'asc' }
        })

        return kategoriList.map(k => ({
            ...k,
            id_kategori: k.id_kategori.toString(),
            parent_id: k.parent_id?.toString() || null
        }));
    } catch (error) {
        console.error("Error fetching kategori:", error)
        return []
    }
}

export async function deleteKategoriAction(id: string) {
    try {
        // Check if kategori has children or related data
        const kategori = await prisma.kategori.findUnique({
            where: {
                id_kategori: BigInt(id)
            },
            include: {
                children: true,
                beritas: true,
                menu: true,
                Halaman: true
            }
        });

        if (!kategori) {
            throw new Error("Kategori tidak ditemukan");
        }

        // Check for dependencies
        if (kategori.children && kategori.children.length > 0) {
            throw new Error("Kategori memiliki sub-kategori. Hapus sub-kategori terlebih dahulu.");
        }

        if (kategori.beritas && kategori.beritas.length > 0) {
            throw new Error("Kategori memiliki berita terkait. Pindahkan atau hapus berita terlebih dahulu.");
        }

        if (kategori.Halaman && kategori.Halaman.length > 0) {
            throw new Error("Kategori memiliki halaman terkait. Pindahkan atau hapus halaman terlebih dahulu.");
        }

        // Delete kategori
        await prisma.kategori.delete({
            where: {
                id_kategori: BigInt(id)
            }
        });

        revalidatePath("/admin/kategori");
        return { success: true };
    } catch (error: unknown) {
        console.error("Error deleting kategori:", error);
        if (error instanceof Error) {
            throw new Error(error.message || "Gagal menghapus kategori");
        }
        throw new Error("Gagal menghapus kategori");
    }
}
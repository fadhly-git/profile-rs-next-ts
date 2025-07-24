// app/admin/kategori/create/kategoriSchema.ts
import { z } from "zod"

export const kategoriSchema = z.object({
    nama_kategori: z.string().min(3, "Nama kategori minimal 3 karakter"),
    slug_kategori: z.string()
        .min(3, "Slug minimal 3 karakter")
        .regex(/^[a-z0-9-]+$/, "Hanya huruf kecil, angka, dan tanda hubung"),
    keterangan: z.string().optional(),
    parent_id: z.union([
        z.string().transform(val => BigInt(val)),
        z.null()
    ]).optional(),
    is_main_menu: z.boolean().default(false),
    is_active: z.boolean().default(true),
})

export type KategoriFormValues = z.infer<typeof kategoriSchema>
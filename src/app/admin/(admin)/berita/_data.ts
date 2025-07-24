/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { Beritas, EnumStatusBerita, EnumBeritasBahasa } from "@/types";

// Helper function to convert bigint fields to number
function convertBigIntFields(berita: any): Beritas {
    return {
        ...berita,
        id_berita: typeof berita.id_berita === "bigint" ? Number(berita.id_berita) : berita.id_berita,
        id_user: typeof berita.id_user === "bigint" ? Number(berita.id_user) : berita.id_user,
        id_kategori: typeof berita.id_kategori === "bigint" ? Number(berita.id_kategori) : berita.id_kategori,
        // Convert nested kategori if present
        kategori: berita.kategori
            ? {
                ...berita.kategori,
                id_kategori: typeof berita.kategori.id_kategori === "bigint"
                    ? Number(berita.kategori.id_kategori)
                    : berita.kategori.id_kategori,
                parent_id: typeof berita.kategori.parent_id === "bigint"
                    ? Number(berita.kategori.parent_id)
                    : berita.kategori.parent_id,
            }
            : berita.kategori,
        // Convert nested user if present (if user has bigint fields, add conversion here)
        user: berita.user,
    };
}

export const getBeritas = async (): Promise<Beritas[]> => {
    const beritas = await prisma.beritas.findMany({
        include: {
            user: true,
            kategori: true,
        },
        orderBy: {
            id_berita: 'desc',
        },
    });
    // Convert bigint fields to number for each berita
    return beritas.map(convertBigIntFields);
};

export type BeritasWithRelations = Awaited<ReturnType<typeof getBeritas>>;
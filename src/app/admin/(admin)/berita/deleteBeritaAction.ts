"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteBeritaAction = async (id: string) => {
    await prisma.beritas.delete({
        where: {
            id_berita: BigInt(id),
        },
    });
    revalidatePath("/admin/berita");
};
import { PrismaClient } from '@prisma/client'

export async function getWebsiteSetting() {
    try {
        const setting = await prisma.websiteSettings.findFirst();
        return setting;
    } catch (error) {
        console.error("Error fetching website settings:", error);
        return null;
    }
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        // log: ['query'],
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
// @/lib/actions/user-actions
'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { User } from "@/types/user"; // Hapus UserFormData import

export async function getUsers(includeDeleted: boolean = false) {
    try {
        const users = await prisma.user.findMany({
            where: includeDeleted ? {} : { deleted_at: null },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                gambar: true,
                email_verified_at: true,
                deleted_at: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        return users.map(user => ({
            ...user,
            id: user.id.toString(),
            status: user.deleted_at ? 'deleted' as const : 'active' as const
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
}

export async function createUser(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as User['role'];
        const gambarFile = formData.get('gambar') as File | null;

        const hashedPassword = await bcrypt.hash(password, 10);

        let imagePath = null;
        if (gambarFile && gambarFile.size > 0) {
            const bytes = await gambarFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const avatarsDir = join(process.cwd(), 'public', 'avatars');
            await mkdir(avatarsDir, { recursive: true });

            const timestamp = Date.now();
            const filename = `${timestamp}-${gambarFile.name}`;
            const filepath = join(avatarsDir, filename);

            await writeFile(filepath, buffer);
            imagePath = `/avatars/${filename}`;
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                gambar: imagePath,
            }
        });

        revalidatePath('/admin/user-management');
        return { success: true, user };
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    }
}

export async function updateUser(id: string, formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as User['role'];
        const gambarFile = formData.get('gambar') as File | null;

        const updateData: {
            name: string;
            email: string;
            role: User['role'];
            password?: string;
            gambar?: string;
        } = {
            name,
            email,
            role,
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (gambarFile && gambarFile.size > 0) {
            const bytes = await gambarFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const avatarsDir = join(process.cwd(), 'public', 'avatars');
            await mkdir(avatarsDir, { recursive: true });

            const timestamp = Date.now();
            const filename = `${timestamp}-${gambarFile.name}`;
            const filepath = join(avatarsDir, filename);

            await writeFile(filepath, buffer);
            updateData.gambar = `/avatars/${filename}`;
        }

        const user = await prisma.user.update({
            where: { id: BigInt(id) },
            data: updateData,
        });

        revalidatePath('/admin/user-management');
        return { success: true, user };
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user');
    }
}

export async function softDeleteUser(id: string) {
    try {
        await prisma.user.update({
            where: { id: BigInt(id) },
            data: { deleted_at: new Date() } // Ini sekarang akan work
        });

        revalidatePath('/admin/user-management');
        return { success: true };
    } catch (error) {
        console.error('Error soft deleting user:', error);
        throw new Error('Failed to delete user');
    }
}

export async function restoreUser(id: string) {
    try {
        await prisma.user.update({
            where: { id: BigInt(id) },
            data: { deleted_at: null } // Ini sekarang akan work
        });

        revalidatePath('/admin/user-management');
        return { success: true };
    } catch (error) {
        console.error('Error restoring user:', error);
        throw new Error('Failed to restore user');
    }
}

export async function permanentDeleteUser(id: string) {
    try {
        await prisma.user.delete({
            where: { id: BigInt(id) }
        });

        revalidatePath('/admin/user-management');
        return { success: true };
    } catch (error) {
        console.error('Error permanently deleting user:', error);
        throw new Error('Failed to permanently delete user');
    }
}
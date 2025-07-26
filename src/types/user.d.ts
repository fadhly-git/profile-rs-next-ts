// types/user.ts
export interface User {
    id: bigint;
    name: string;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'USER';
    gambar: string | null;
    email_verified_at: Date | null;
    deleted_at: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserFormData {
    name: string;
    email: string;
    password?: string;
    role: User['role'];
    gambar?: File | null;
}

export interface UserTableData {
    id: string;
    name: string;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'USER';
    gambar: string | null;
    status: 'active' | 'deleted';
    createdAt: Date | null;
    email_verified_at: Date | null; // Add this line
    deleted_at: Date | null; // Change 'deletedAt' to 'deleted_at'
    updatedAt: Date | null; // Add this line
}
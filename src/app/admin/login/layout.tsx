import { authOptions } from '@/lib/authOptions';
import { Metadata } from 'next'
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: "Login Admin",
    description: "Login untuk masuk ke dashboard admin",
}

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (session) { redirect('/admin/dashboard') }
    return children
}
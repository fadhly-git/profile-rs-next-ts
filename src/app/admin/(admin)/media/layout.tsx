import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function MediaLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (!session) { redirect('/admin/login') }
    return (
        <div className="flex justify-center w-full">
            {children}
        </div>
    )
}
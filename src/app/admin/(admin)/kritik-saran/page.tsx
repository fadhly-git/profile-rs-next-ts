'use client';

import { useEffect, useState } from 'react';
import { getKritikSaran } from '@/lib/actions/kritik-saran';
import { DataTable } from '@/components/kritik-saran/kritik-saran-table';
import { LoadingSpinner } from '@/components/atoms/loading-spinner';
import { EnumPerawatanTerkait } from '@/types';
import { useRouter } from 'next/navigation';

export default function KritikSaranPage() {
    const router = useRouter();
    const [kritikSaran, setKritikSaran] = useState<Array<{
        telepon: string | undefined;
        nama_kmr_no_kmr: string | undefined;
        id: bigint;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        nama: string;
        alamat: string;
        kritik: string;
        nama_poli: string | null;
        perawatan_terakait: EnumPerawatanTerkait;
        saran: string;
    }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getKritikSaran();
                setKritikSaran(data);
            } catch (error) {
                console.error('Failed to load kritik saran:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return <div className='w-full justify-center items-center'><LoadingSpinner /></div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Kritik dan Saran</h1>
            <DataTable
                data={kritikSaran}
                onRefresh={() => router.refresh()}
            />
        </div>
    );
}
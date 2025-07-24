import { getKritikSaran } from './_data';
import { DataTable } from './DataTable';

export default async function KritikSaranPage() {
    const kritikSaran = await getKritikSaran();
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Kritik dan Saran</h1>
            <DataTable data={kritikSaran} />
        </div>
    );
}
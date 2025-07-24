import { getBeritas } from "./_data";
import { DataTableBerita } from "./DataTableBerita";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function BeritaPage() {
    const beritas = await getBeritas();

    return (
        <div className="container mx-auto p-4 overflow-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manajemen Berita</h1>
                <Link href="/admin/berita/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Buat Berita Baru
                    </Button>
                </Link>
            </div>
            <DataTableBerita data={beritas} />
        </div>
    );
}
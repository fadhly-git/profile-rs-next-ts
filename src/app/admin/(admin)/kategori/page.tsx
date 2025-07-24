// app/admin/kategori/page.tsx
import { getKategori } from "./_data";
import { DataTableKategori } from "./DataTableKategori";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function KategoriPage() {
    const kategori = await getKategori();
    return (
        <div className="container mx-auto p-4 overflow-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Kategori</h1>
                <Link href="/admin/kategori/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Kategori
                    </Button>
                </Link>
            </div>
            <DataTableKategori data={kategori} />
        </div>
    );
}
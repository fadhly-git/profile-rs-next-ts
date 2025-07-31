import { getBeritas } from "@/lib/actions/berita"
import { BeritaPageClient } from "./BeritaPageClient"

export default async function BeritaPage() {
    const beritas = await getBeritas()

    return <BeritaPageClient initialData={beritas} />
}
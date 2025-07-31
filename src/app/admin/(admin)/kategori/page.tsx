import { getKategori } from "@/lib/actions/kategori"
import { CategoryPageTemplate } from "@/components/kategori/templates/category-page-template"
import { CategoryTableContainer } from "@/components/kategori/category-table-container"

export default async function KategoriPage() {
    const kategori = await getKategori()

    return (
        <CategoryPageTemplate
            title="Kategori"
            createUrl="/admin/kategori/create"
            createButtonText="Tambah Kategori"
        >
            <CategoryTableContainer data={kategori} />
        </CategoryPageTemplate>
    )
}
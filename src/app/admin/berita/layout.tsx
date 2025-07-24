import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Preview Berita",
    description: "Preview berita yang akan ditampilkan",
}

export default async function BeritaLayout({ children }: { children: React.ReactNode }) {
    return children
}
export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface WebsiteSetting {
    id: number;
    website_name: string | null;
    logo_url: string | null;
    favicon_url: string | null;
    logo_akreditasi_url: string | null;
    nama_akreditasi: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    facebook_url: string | null;
    twitter_url: string | null;
    instagram_url: string | null;
    youtube_url: string | null;
    footer_text: string | null;
    copyright_text: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};

export interface User {
    id?: number;
    name?: string;
    email?: string;
    image?: string | null;
}

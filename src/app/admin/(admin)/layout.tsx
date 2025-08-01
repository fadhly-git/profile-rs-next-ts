
import '@/app/admin/admin.css'
import { Providers } from "@/app/providers"
import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { getWebsiteSetting } from '@/lib/prisma'
import { WebsiteSettings } from '@/types'
import { Metadata } from 'next'
import { MainScrollArea } from '@/components/main-scroll'

export async function generateMetadata(): Promise<Metadata> {
    const setting = await getWebsiteSetting();
    return {
        title: `Admin Panel - ${setting?.website_name || "Website"}`,
        description: "Manage your website settings and content",
        icons: setting?.favicon_url,

    }
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const websiteSettings: WebsiteSettings | null = await getWebsiteSetting();
    const session = await getServerSession(authOptions);
    if (!session) { redirect('/admin/login') }
    return (
        <Providers>
            <div className="[--header-height:calc(--spacing(14))] h-screen flex flex-col overflow-hidden">
                <SidebarProvider className="flex flex-col flex-1">
                    <SiteHeader />
                    <div className="flex flex-1">
                        <AppSidebar appName={websiteSettings?.website_name ?? "Admin"} />
                        <SidebarInset className="flex flex-1 overflow-hidden">
                            <div className="h-full">
                                <MainScrollArea>
                                    {children}
                                </MainScrollArea>
                            </div>
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </div>
        </Providers>
    )
}
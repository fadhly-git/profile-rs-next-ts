
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
import { WebsiteSetting } from '@/types'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const websiteSettings: WebsiteSetting | null = await getWebsiteSetting();
    console.log("Website Settings:", websiteSettings);
    const session = await getServerSession(authOptions);
    if (!session) { redirect('/admin/login') }
    return (
        <Providers>
            <div className="[--header-height:calc(--spacing(14))]">
                <SidebarProvider className="flex flex-col">
                    <SiteHeader />
                    <div className="flex flex-1 p-4 md:p-6 lg:p-8">
                        <AppSidebar appName={websiteSettings?.website_name ?? "Admin"} />
                        <SidebarInset>
                            {children}
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </div>
        </Providers>
    )
}
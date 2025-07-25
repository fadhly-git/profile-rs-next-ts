import { Poppins } from 'next/font/google'
import '@/app/admin/admin.css'
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollAreaProvider } from '@/context/scrollarea-context'
import { Toaster } from '@/components/ui/sonner'


const poppins = Poppins({ subsets: ['latin'], weight: ['500', '800'] })

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.className} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Toaster position="top-center" />
                    <ScrollAreaProvider>
                        {children}
                    </ScrollAreaProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

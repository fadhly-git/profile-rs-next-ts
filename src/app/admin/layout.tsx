import { Poppins } from 'next/font/google'
import '@/app/admin/admin.css'
import { ThemeProvider } from "@/components/theme-provider"

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
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}

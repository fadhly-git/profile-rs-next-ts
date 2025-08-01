import type { Metadata } from "next";
import { Poppins } from 'next/font/google'
import '@/app/globals.css'
import Header from "@/components/ui/Header";
import { getWebsiteData } from "@/lib/public/main";
import { ScrollAreaProvider } from "@/context/scrollarea-context";
import Footer from "@/components/ui/Footer";

const poppins = Poppins({ subsets: ['latin'], weight: ['500', '800'] })

export async function generateMetadata(): Promise<Metadata> {
  const setting = await getWebsiteData();

  return {
    title: setting?.websiteSettings?.website_name || "Website",
    description: "Website description",
    icons: {
      icon: setting?.websiteSettings?.favicon_url || "/favicon.ico",
    }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getWebsiteData();

  // Wait for all data to be available
  if (!data || !data.websiteSettings || !data.menuCategories) {
    return null; // or a loading spinner
  }

  const { websiteSettings, menuCategories } = data;
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
          <Header
            websiteSettings={websiteSettings}
            menuCategories={menuCategories}
          />
          <div className="flex-grow overflow-y-hidden">
            <ScrollAreaProvider>{children}</ScrollAreaProvider>
          </div>
          <Footer
            settings={websiteSettings}
            menuCategories={menuCategories}
          />
      </body>
    </html>
  );
}

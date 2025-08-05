import type { Metadata } from "next";
import { Poppins } from 'next/font/google'
import '@/app/globals.css'
import Header from "@/components/ui/Header";
import { getWebsiteData } from "@/lib/public/main";
import { ScrollAreaProvider } from "@/context/scrollarea-context";
import Footer from "@/components/ui/Footer";
import Head from "next/head";

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
      <Head>
        <meta property="og:title" content="RS PKU Muhammadiyah Boja" />
        <meta property="og:description" content="Menyehatkan Umat, Mencerdaskan Semesta." />
        <meta property="og:image" content="https://rspkuboja.com/logo.png" />
        <meta property="og:url" content="https://rspkuboja.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="RS PKU Muhammadiyah Boja" />
        <meta name="keywords" content="rumah sakit, pku, muhammadiyah, boja" />
      </Head>
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

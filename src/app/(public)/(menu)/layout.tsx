import type { Metadata } from "next";
import { Poppins } from 'next/font/google'
import '@/app/globals.css'
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { Providers } from "@/app/providers";
import { prisma } from '@/lib/prisma'

const poppins = Poppins({ subsets: ['latin'], weight: ['500', '800'] })

async function getWebsiteSetting() {
  try {
    const setting = await prisma.websiteSettings.findFirst();
    return setting;
  } catch (error) {
    console.error("Error fetching website settings:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const setting = await getWebsiteSetting();

  return {
    title: setting?.website_name || "Website",
    description: "Website description",
    icons: {
      icon: setting?.favicon_url || "/favicon.ico",
    }
  }
}

export default async function MenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSettings = await getWebsiteSetting();
  return (
    <div className="flex flex-col min-h-screen">
      <Header settings={websiteSettings} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer settings={websiteSettings} />
    </div>
  );
}

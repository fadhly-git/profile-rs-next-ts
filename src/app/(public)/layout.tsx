import type { Metadata } from "next";
import { Poppins } from 'next/font/google'
import '@/app/globals.css'
import { Providers } from "@/components/providers/session-provider";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

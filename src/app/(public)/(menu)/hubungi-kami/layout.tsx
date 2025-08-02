import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontak Kami - RS PKU Muhammadiyah Boja',
  description: 'Hubungi kami untuk informasi lebih lanjut, kritik, dan saran. Tersedia berbagai cara untuk menghubungi rumah sakit.'
}

export default function LayoutKontakKami({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return <>{children}</>;
}
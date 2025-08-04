// components/about-us-section.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AboutUsSection } from '@/types/public';

interface AboutUsSectionProps {
  aboutData: AboutUsSection | null;
}

export default function AboutUsSectionComponent({ aboutData }: AboutUsSectionProps) {
  if (!aboutData) return null;

  return (
    <section className="py-16 lg:py-24 bg-white max-w-7xl mx-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {aboutData.title || 'Tentang Kami'}
            </h2>
            
            <div className="prose prose-lg text-gray-600 mb-8">
              <p className="leading-relaxed">
                {aboutData.short_description}
              </p>
            </div>

            {aboutData.read_more_link && (
              <Button
                asChild
                className="bg-[#07b8b2] hover:bg-[#069691] text-white group"
                size="lg"
              >
                <Link href={aboutData.read_more_link}>
                  Selengkapnya
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            )}
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            {aboutData.image_url ? (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={aboutData.image_url}
                  alt={aboutData.title || 'Tentang Kami'}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-gradient-to-br from-[#07b8b2]/10 to-[#07b8b2]/30 rounded-2xl flex items-center justify-center">
                <div className="text-center text-[#07b8b2]">
                  <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-medium">RS PKU Muhammadiyah Boja</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
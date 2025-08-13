// components/hero-section.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/types/public';

interface HeroSectionProps {
  heroData: HeroSection[];
}

export default function HeroSectionComponent({ heroData }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || !heroData?.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroData.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [heroData?.length, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroData.length) % heroData.length);
  };

  if (!heroData?.length) return null;

  return (
    <section className="relative h-[70vh] lg:h-[80vh] overflow-hidden">
      {heroData.map((hero, index) => (
        <div
          key={hero.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          style={{ willChange: 'opacity' }}
        >
          {hero.background_image && (
            <Image
              src={hero.background_image}
              alt={hero.headline}
              fill
              className="object-cover"
              priority={index === 0}
            />
          )}
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative container mx-auto px-4 h-full flex flex-col justify-end">
            <div className="text-white max-w-2xl mb-16">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {hero.headline}
              </h1>
              {hero.subheading && (
                <p className="text-lg lg:text-lg mb-8 opacity-90">
                  {hero.subheading}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {hero.cta_button_text_1 && hero.cta_button_link_1 && (
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#07b8b2] hover:bg-[#069691] text-white px-8 z-50"
                  >
                    <Link href={hero.cta_button_link_1}>
                      {hero.cta_button_text_1}
                    </Link>
                  </Button>
                )}

                {hero.cta_button_text_2 && hero.cta_button_link_2 && (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="bg-[#07b8b2] hover:bg-[#069691] text-white px-8 z-50"
                  >
                    <Link href={hero.cta_button_link_2}>
                      {hero.cta_button_text_2}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {heroData.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="fixed left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 z-[90] backdrop-blur-sm"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            style={{ position: 'absolute' }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="fixed right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 z-[9999] backdrop-blur-sm"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            style={{ position: 'absolute' }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {heroData.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {heroData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 relative z-50 ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
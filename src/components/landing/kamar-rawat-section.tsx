// components/info-kamar-section.tsx
"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, FileImage } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoomInfoSectionProps } from '@/types/halaman';
import { createExcerpt } from '@/lib/utils';
import { isValidImageUrl } from '@/lib/validators';

export function RoomInfoSection({ roomInfoPages, autoSlide = true }: RoomInfoSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 3; // Desktop: 3 cards

  const totalSlides = Math.ceil(roomInfoPages.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (!autoSlide || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => clearInterval(interval);
  }, [totalSlides, autoSlide]);

  if (!roomInfoPages.length) return null;

  return (
    <section className="py-8 lg:py-12 max-w-7xl mx-auto">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Info Kamar Rawat Inap
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Informasi lengkap mengenai fasilitas dan layanan kamar rawat inap di rumah sakit kami
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {roomInfoPages
                    .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                    .map((page) => (
                      <Card
                        key={page.id_halaman.toString()}
                        className="hover:shadow-lg transition-all duration-300 group"
                      >
                        <CardContent className="p-0">
                          {/* Image Section */}
                          <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-gray-200">
                            {page.gambar && isValidImageUrl(page.gambar) ? (
                              <Image
                                src={page.gambar}
                                alt={page.judul}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#07b8b2]/10 flex items-center justify-center text-[#07b8b2]">
                                <FileImage className="w-12 h-12" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          </div>

                          {/* Content Section */}
                          <div className="p-6">
                            <div className="mb-3">
                              <Badge
                                variant="secondary"
                                className="bg-[#07b8b2]/10 text-[#07b8b2] hover:bg-[#07b8b2]/20"
                              >
                                {page.kategori?.nama_kategori || 'Info Kamar Rawat Inap'}
                              </Badge>
                            </div>

                            <h3 className="font-semibold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-[#07b8b2] transition-colors duration-200">
                              {page.judul}
                            </h3>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {createExcerpt(page.konten, 100)}
                            </p>

                            <Link
                              href={`/${page.kategori?.slug_kategori || 'info-kamar-rawat-inap'}/${page.slug}`}
                              className="inline-flex items-center text-[#07b8b2] hover:text-[#059691] font-medium text-sm transition-colors duration-200"
                            >
                              Selengkapnya
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-[#07b8b2] p-3 rounded-full transition-all duration-200 border z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-[#07b8b2] p-3 rounded-full transition-all duration-200 border z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentSlide ? 'bg-[#07b8b2] w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function RoomInfoStaticSection({ roomInfoPages }: Omit<RoomInfoSectionProps, 'autoSlide'>) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 3;

  const totalSlides = Math.ceil(roomInfoPages.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  if (!roomInfoPages.length) return null;

  return (
    <section className="py-16 lg:py-24 bg-white max-w-7xl mx-auto">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Info Kamar Rawat Inap
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Informasi lengkap mengenai fasilitas dan layanan kamar rawat inap di rumah sakit kami
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {roomInfoPages
                    .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                    .map((page) => (
                      <Card
                        key={page.id_halaman.toString()}
                        className="hover:shadow-lg transition-all duration-300 group"
                      >
                        <CardContent className="p-0">
                          <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-gray-200">
                            {page.gambar && isValidImageUrl(page.gambar) ? (
                              <Image
                                src={page.gambar}
                                alt={page.judul}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#07b8b2]/10 flex items-center justify-center text-[#07b8b2]">
                                <FileImage className="w-12 h-12" />
                              </div>
                            )}
                          </div>

                          <div className="p-6">
                            <div className="mb-3">
                              <Badge
                                variant="secondary"
                                className="bg-[#07b8b2]/10 text-[#07b8b2] hover:bg-[#07b8b2]/20"
                              >
                                {page.kategori?.nama_kategori || 'Info Kamar Rawat Inap'}
                              </Badge>
                            </div>

                            <h3 className="font-semibold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-[#07b8b2] transition-colors duration-200">
                              {page.judul}
                            </h3>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {createExcerpt(page.konten, 100)}
                            </p>

                            <Link
                              href={`/${page.kategori?.slug_kategori || 'info-kamar-rawat-inap'}/${page.slug}`}
                              className="inline-flex items-center text-[#07b8b2] hover:text-[#059691] font-medium text-sm transition-colors duration-200"
                            >
                              Selengkapnya
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Manual Navigation hanya jika ada lebih dari 1 slide */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-[#07b8b2] p-3 rounded-full transition-all duration-200 border z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-[#07b8b2] p-3 rounded-full transition-all duration-200 border z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentSlide ? 'bg-[#07b8b2] w-6' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
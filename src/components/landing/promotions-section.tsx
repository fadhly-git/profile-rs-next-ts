// components/promotions-section.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CalendarDays, 
  Clock, 
  ExternalLink, 
  Tag,
  Gift,
  ChevronRight,
  Filter,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Promotion {
  id: number;
  title: string;
  description?: string | null;
  image_url?: string | null;
  link_url?: string | null;
  start_date?: Date | null;
  end_date?: Date | null;
  is_active?: boolean | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

interface PromotionsSectionProps {
  promotions: Promotion[];
}

export default function PromotionsSection({ promotions }: PromotionsSectionProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'expired'>('all');

  // Filter promotions
  const filteredPromotions = promotions.filter(promotion => {
    if (!promotion.is_active) return false;
    
    const now = new Date();
    const startDate = promotion.start_date ? new Date(promotion.start_date) : null;
    const endDate = promotion.end_date ? new Date(promotion.end_date) : null;

    switch (filter) {
      case 'active':
        return (!startDate || startDate <= now) && (!endDate || endDate >= now);
      case 'upcoming':
        return startDate && startDate > now;
      case 'expired':
        return endDate && endDate < now;
      default:
        return true;
    }
  });

  // Don't render if no promotions
  if (!promotions || promotions.length === 0) {
    return null;
  }

  const getPromotionStatus = (promotion: Promotion) => {
    if (!promotion.is_active) return 'inactive';
    
    const now = new Date();
    const startDate = promotion.start_date ? new Date(promotion.start_date) : null;
    const endDate = promotion.end_date ? new Date(promotion.end_date) : null;

    if (startDate && startDate > now) return 'upcoming';
    if (endDate && endDate < now) return 'expired';
    return 'active';
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return null;
    try {
      return format(new Date(date), 'dd MMMM yyyy', { locale: id });
    } catch {
      return null;
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#07b8b2] bg-opacity-10 rounded-full mb-6">
            <Gift className="w-8 h-8 text-[#07b8b2]" />
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Promo & Penawaran Khusus
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dapatkan berbagai penawaran menarik untuk layanan kesehatan terbaik di RS PKU Muhammadiyah Boja
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { key: 'all', label: 'Semua', icon: Tag },
            { key: 'active', label: 'Berlangsung', icon: Clock },
            { key: 'upcoming', label: 'Akan Datang', icon: Calendar },
            { key: 'expired', label: 'Berakhir', icon: CalendarDays }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              size="sm"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setFilter(key as any)}
              className={`flex items-center gap-2 ${
                filter === key 
                  ? 'bg-[#07b8b2] hover:bg-[#069691] text-white' 
                  : 'hover:bg-[#07b8b2]/10 hover:text-[#07b8b2] hover:border-[#07b8b2]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* No Results */}
        {filteredPromotions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Filter className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tidak Ada Promo
            </h3>
            <p className="text-gray-600">
              Belum ada promo untuk kategori yang dipilih saat ini
            </p>
          </div>
        )}

        {/* Promotions Grid */}
        {filteredPromotions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPromotions.map((promotion) => {
              const status = getPromotionStatus(promotion);
              
              return (
                <Card 
                  key={promotion.id} 
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white"
                >
                  <div className="relative">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#07b8b2]/10 to-[#07b8b2]/20 rounded-tl-xl rounded-tr-xl">
                      {promotion.image_url ? (
                        <Image
                          src={promotion.image_url}
                          alt={promotion.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 rounded-tl-lg rounded-tr-lg"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-[#07b8b2]">
                            <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-full flex items-center justify-center shadow-md">
                              <Gift className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-medium">Promo Spesial</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge 
                        variant="secondary"
                        className={`
                          font-medium text-xs px-3 py-1 rounded-full shadow-lg
                          ${status === 'active' 
                            ? 'bg-green-500 text-white hover:bg-green-600' 
                            : status === 'upcoming'
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : status === 'expired'
                            ? 'bg-gray-500 text-white hover:bg-gray-600'
                            : 'bg-gray-500 text-white hover:bg-gray-600'
                          }
                        `}
                      >
                        {status === 'active' && '🔥 Aktif'}
                        {status === 'upcoming' && '⏳ Segera'}
                        {status === 'expired' && '⏰ Berakhir'}
                        {status === 'inactive' && '❌ Nonaktif'}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#07b8b2] transition-colors">
                      {promotion.title}
                    </h3>

                    {/* Description */}
                    {promotion.description && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {promotion.description}
                      </p>
                    )}

                    {/* Date Range */}
                    {(promotion.start_date || promotion.end_date) && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <CalendarDays className="w-4 h-4 text-[#07b8b2]" />
                        <span>
                          {promotion.start_date && promotion.end_date ? (
                            `${formatDate(promotion.start_date)} - ${formatDate(promotion.end_date)}`
                          ) : promotion.start_date ? (
                            `Mulai ${formatDate(promotion.start_date)}`
                          ) : promotion.end_date ? (
                            `Hingga ${formatDate(promotion.end_date)}`
                          ) : null}
                        </span>
                      </div>
                    )}

                    {/* Action Button */}
                    {promotion.link_url && (
                      <Button
                        asChild
                        className="w-full bg-[#07b8b2] hover:bg-[#069691] text-white group/btn"
                        size="sm"
                      >
                        <Link 
                          href={promotion.link_url}
                          target={promotion.link_url.startsWith('http') ? '_blank' : '_self'}
                          rel={promotion.link_url.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          Lihat Detail
                          {promotion.link_url.startsWith('http') ? (
                            <ExternalLink className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          ) : (
                            <ChevronRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          )}
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {filteredPromotions.length > 0 && (
          <div className="text-center mt-12">
            <div className="inline-flex items-center justify-center p-6 bg-gradient-to-r from-[#07b8b2]/10 to-teal-100 rounded-2xl">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tertarik dengan promo kami?
                </h3>
                <p className="text-gray-600 mb-4">
                  Hubungi kami untuk informasi lebih lengkap
                </p>
                <Button
                  asChild
                  className="bg-[#07b8b2] hover:bg-[#069691] text-white"
                >
                  <Link href="/hubungi-kami">
                    Hubungi Kami
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
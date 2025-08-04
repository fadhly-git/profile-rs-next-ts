// components/news-section.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, Tag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Berita } from '@/types/public';

interface NewsCardProps {
  article: Berita;
}

// Alternative version dengan layout yang lebih robust
function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="group bg-white rounded-xl border border-gray-200 hover:border-[#07b8b2] hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      {article.thumbnail && (
        <div className="aspect-video bg-gray-100 overflow-hidden flex-shrink-0">
          <Image
            src={article.thumbnail}
            alt={article?.judul_berita ?? 'Berita'}
            width={400}
            height={225}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        {article.kategori && (
          <div className="flex items-center space-x-2 mb-3 flex-shrink-0">
            <Tag className="w-4 h-4 text-[#07b8b2]" />
            <span className="text-sm text-[#07b8b2] font-medium truncate">
              {article.kategori.nama_kategori}
            </span>
          </div>
        )}
        
        <h3 className="font-semibold text-gray-900 group-hover:text-[#07b8b2] transition-colors line-clamp-2 mb-2 flex-shrink-0">
          <Link href={`/berita/${article.slug_berita}`} className="hover:underline">
            {article.judul_berita}
          </Link>
        </h3>
        
        {article.isi && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
            {article.isi.replace(/<[^>]*>/g, '').substring(0, 150)}...
          </p>
        )}
        
        {/* Footer dengan layout yang lebih terstruktur */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex-shrink-0">
          {/* Info row */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {article.tanggal_post && (
                <div className="flex items-center space-x-1 min-w-0">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate text-xs">
                    {new Date(article.tanggal_post).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>
              )}
              
              {article.hits !== null && article.hits !== undefined && (
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <Eye className="w-3 h-3" />
                  <span className="text-xs">{article.hits}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Read more button */}
          <Link 
            href={`/berita/${article.slug_berita}`}
            className="text-[#07b8b2] hover:text-teal-700 font-medium transition-colors text-xs flex items-center justify-between group/link w-full"
          >
            <span>Baca selengkapnya</span>
            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}

interface NewsSectionProps {
  news: Berita[];
}

export default function NewsSection({ news }: NewsSectionProps) {
  if (!news?.length) return null;

  return (
    <section className="py-16 lg:py-24 bg-gray-50 max-w-7xl mx-auto">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Berita Terbaru
            </h2>
            <p className="text-lg text-gray-600">
              Informasi dan berita terkini dari RS PKU Muhammadiyah Boja
            </p>
          </div>
          
          <Button
            asChild
            variant="outline"
            className="hidden md:flex border-[#07b8b2] text-[#07b8b2] hover:bg-[#07b8b2] hover:text-white group"
          >
            <Link href="/berita">
              Lihat Semua
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {news.slice(0, 4).map((article) => (
            <NewsCard key={article.id_berita.toString()} article={article} />
          ))}
        </div>

        {/* Mobile "Lihat Semua" button */}
        <div className="text-center md:hidden">
          <Button
            asChild
            variant="outline"
            className="border-[#07b8b2] text-[#07b8b2] hover:bg-[#07b8b2] hover:text-white group"
          >
            <Link href="/berita">
              Lihat Semua Berita
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
// components/services-section-masonry.tsx (Alternative)
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { FeatureBlock } from '@/types/public';

interface ServicesSectionProps {
  services: FeatureBlock[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const activeServices = services
    .filter(service => service.is_active)
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  if (!activeServices.length) return null;

  return (
    <section className="py-16 lg:py-24 bg-gray-50 max-w-7xl justify-center mx-auto">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Layanan Kami
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kami menyediakan berbagai layanan kesehatan terpadu dengan standar kualitas terbaik
          </p>
        </div>

        {/* CSS Grid Masonry Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 lg:gap-6 space-y-4 lg:space-y-6">
          {activeServices.map((service, index) => {
            // Vary card heights for better masonry effect
            const heightVariations = ['auto', 'auto', 'auto'];
            const heightClass = heightVariations[index % heightVariations.length];
            
            return (
              <Card
                key={service.id}
                className="group hover:shadow-xl transition-all duration-500 border-0 shadow-md hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden break-inside-avoid mb-4 lg:mb-6"
                style={{ height: heightClass }}
              >
                <CardContent className="p-6">
                  {/* Icon/Image Container */}
                  <div className="flex items-center mb-4">
                    {service.image_url ? (
                      <div className="w-12 h-12 overflow-hidden rounded-lg bg-[#07b8b2]/5 p-2 mr-3 flex-shrink-0">
                        <Image
                          src={service.image_url}
                          alt={service.title}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded"
                        />
                      </div>
                    ) : service.icon ? (
                      <div className="w-12 h-12 overflow-hidden rounded-lg bg-[#07b8b2]/5 p-2 mr-3 flex-shrink-0">
                        <Image
                          src={service.icon}
                          alt={service.title}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-[#07b8b2]/10 to-[#07b8b2]/20 rounded-lg flex items-center justify-center group-hover:from-[#07b8b2]/20 group-hover:to-[#07b8b2]/30 transition-all duration-300 mr-3 flex-shrink-0">
                        <div className="w-5 h-5 bg-[#07b8b2] rounded"></div>
                      </div>
                    )}
                    
                    <h3 className="font-bold text-gray-900 group-hover:text-[#07b8b2] transition-colors duration-300 leading-tight text-lg">
                      {service.title}
                    </h3>
                  </div>
                  
                  {service.description && (
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {service.description}
                    </p>
                  )}

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#07b8b2]/5 to-transparent rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 border border-[#07b8b2] opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
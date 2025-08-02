// app/page.tsx
import HeroSection from '@/components/landing/hero-section';
import ServicesSection from '@/components/landing/services-section';
import DoctorScheduleSection from '@/components/landing/doctor-schedule-section';
import AboutUsSection from '@/components/landing/about-us-section';
import NewsSection from '@/components/landing/news-section';
import { getAboutUsData, getDoctorsWithSchedule, getHeroData, getLatestNews, getPromotions, getServicesData } from '@/lib/public/landing-page';
import PromotionsSection from '@/components/landing/promotions-section';


export default async function HomePage() {
  // Fetch all data
  const [heroData, servicesData, doctorsData, aboutData, newsData, promotionsData] = await Promise.all([
    getHeroData(),
    getServicesData(), 
    getDoctorsWithSchedule(),
    getAboutUsData(),
    getLatestNews(),
    getPromotions()
  ]);

  return (
    <main className="min-h-screen">
      <HeroSection heroData={heroData} />
      <ServicesSection services={servicesData} />
      <DoctorScheduleSection doctorsWithSchedule={doctorsData} />
      <AboutUsSection aboutData={aboutData} />
      <PromotionsSection promotions={promotionsData} />
      <NewsSection news={newsData} />
    </main>
  );
}
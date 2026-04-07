'use client';

import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategoriesSection from '@/components/CategoriesSection';
import LookbookSection from '@/components/LookbookSection';
import PromoBanner from '@/components/PromoBanner';
import WhyChooseUs from '@/components/WhyChooseUs';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="bg-[#f9f9f9] min-h-screen">
      <main>
        <HeroSection />
        <FeaturedProducts />
        <LookbookSection />
        <CategoriesSection />
        <PromoBanner />
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
}

import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoriesSection from "@/components/CategoriesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import PromoBanner from "@/components/PromoBanner";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
   <>
    <HeroSection />
    <FeaturedProducts />
    <CategoriesSection />
    <PromoBanner />
    <WhyChooseUs />
    <Testimonials />
    <Newsletter />
   </>
  );
}

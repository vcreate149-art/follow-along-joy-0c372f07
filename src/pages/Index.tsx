import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import HeroSection from "@/components/home/HeroSection";
import IntroSection from "@/components/home/IntroSection";
import CoursesSection from "@/components/home/CoursesSection";
import VocationalTestSection from "@/components/home/VocationalTestSection";
import CTASection from "@/components/home/CTASection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BlogSection from "@/components/home/BlogSection";
import GallerySection from "@/components/home/GallerySection";
import StatsSection from "@/components/home/StatsSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <IntroSection />
        <CoursesSection />
        <VocationalTestSection />
        <CTASection />
        <TestimonialsSection />
        <BlogSection />
        <GallerySection />
        <StatsSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;

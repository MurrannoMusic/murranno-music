import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { WhySection } from "@/components/landing/WhySection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PlaylistCTASection } from "@/components/landing/PlaylistCTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const DesktopLanding = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <HeroSection />
      <ServicesSection />
      <WhySection />
      <TestimonialsSection />
      <PlaylistCTASection />
      <LandingFooter />
    </div>
  );
};

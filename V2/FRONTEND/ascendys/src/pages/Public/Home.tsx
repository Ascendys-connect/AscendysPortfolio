import PageMeta from "@/components/common/PageMeta";
import PublicNavbar from "@/components/public/PublicNavbar";
import HeroSection from "@/components/public/HeroSection";
import ServicesSection from "@/components/public/ServicesSection";
import AboutSection from "@/components/public/AboutSection";
import TrainingsSection from "@/components/public/TrainingsSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import PartnersSection from "@/components/public/PartnersSection";
import CTASection from "@/components/public/CTASection";
import PublicFooter from "@/components/public/PublicFooter";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Ascendys Connect - Formation Professionnelle au Togo"
        description="Organisme de formation professionnelle spécialisé dans les métiers du digital, de la gestion et du management au Togo."
      />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        <PublicNavbar />
        <main>
          <HeroSection />
          <ServicesSection />
          <AboutSection />
          <TrainingsSection />
          <TestimonialsSection />
          <PartnersSection />
          <CTASection />
        </main>
        <PublicFooter />
      </div>
    </>
  );
}

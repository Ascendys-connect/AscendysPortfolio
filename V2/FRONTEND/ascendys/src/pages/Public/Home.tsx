import PageMeta from "@/components/common/PageMeta";
import PublicNavbar from "@/components/public/PublicNavbar";
import HeroSection from "@/components/public/HeroSection";
import StatsSection from "@/components/public/StatsSection";
import ServicesSection from "@/components/public/ServicesSection";
import ApproachSection from "@/components/public/ApproachSection";
import AboutSection from "@/components/public/AboutSection";
import TrainingsSection from "@/components/public/TrainingsSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import ClientsSection from "@/components/public/ClientsSection";
import PartnersSection from "@/components/public/PartnersSection";
import CTASection from "@/components/public/CTASection";
import PublicFooter from "@/components/public/PublicFooter";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import FeaturedTrainingPopup from "@/components/public/FeaturedTrainingPopup";
import NewsletterPopup from "@/components/public/NewsletterPopup";

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
          <StatsSection />
          <ServicesSection />
          <ApproachSection />
          <AboutSection />
          <TrainingsSection />
          <TestimonialsSection />
          <ClientsSection />
          <PartnersSection />
          <CTASection />
        </main>
        <PublicFooter />
        <WhatsAppButton />
        {/* Popup formation en vedette après 30s */}
        <FeaturedTrainingPopup />
        {/* Popup abonnement newsletter après 90s */}
        <NewsletterPopup />
      </div>
    </>
  );
}


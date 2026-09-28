import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ApprochSection from "@/components/sections/ApprochSection";
import FormationsSection from "@/components/sections/FormationsSection";
import ClientsSection from "@/components/sections/ClientsSection";
import CTASection from "@/components/sections/CTASection";
import StatsSection from "@/components/sections/StatsSection";

export const metadata: Metadata = {
  title: "ASCENDYS CONNECT — Pour plus de Valeur",
  description:
    "Solutions IT & Digitales spécialisées dans l'audit, le conseil, l'ingénierie technique, la sécurité informatique, les télécommunications et la formation professionnelle à Lomé, Togo.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <ApprochSection />
      <FormationsSection />
      <ClientsSection />
      <CTASection />
    </>
  );
}

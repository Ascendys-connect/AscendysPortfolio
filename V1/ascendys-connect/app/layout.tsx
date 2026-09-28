import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ascendys-group.com"),
  title: {
    default: "ASCENDYS CONNECT — Pour plus de Valeur",
    template: "%s | ASCENDYS CONNECT",
  },
  description:
    "ASCENDYS CONNECT est une entreprise de solutions IT & Digitales spécialisée dans l'audit, le conseil, l'ingénierie technique, la sécurité informatique, les télécommunications, le support et la formation professionnelle.",
  keywords: [
    "IT",
    "Digital",
    "conseil IT",
    "sécurité informatique",
    "formation IT",
    "réseau",
    "CCNA",
    "Lomé",
    "Togo",
    "ASCENDYS",
    "transformation digitale",
  ],
  authors: [{ name: "ASCENDYS CONNECT" }],
  creator: "ASCENDYS CONNECT",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.ascendys-group.com",
    siteName: "ASCENDYS CONNECT",
    title: "ASCENDYS CONNECT — Pour plus de Valeur",
    description:
      "Solutions IT & Digitales : audit, conseil, ingénierie, sécurité informatique, télécommunications et formation professionnelle.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASCENDYS CONNECT — Pour plus de Valeur",
    description:
      "Solutions IT & Digitales : audit, conseil, ingénierie, sécurité et formation.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}

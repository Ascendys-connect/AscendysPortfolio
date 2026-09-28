"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

const footerLinks = {
  entreprise: [
    { label: "À propos", href: "/a-propos" },
    { label: "Notre Histoire", href: "/a-propos#histoire" },
    { label: "Filiales", href: "/a-propos#filiales" },
    { label: "Impact Local", href: "/a-propos#impact" },
    { label: "Carrières", href: "/contact" },
  ],
  services: [
    { label: "Conseil IT", href: "/services#conseil" },
    { label: "Infrastructure", href: "/services#infrastructure" },
    { label: "Sécurité", href: "/services#securite" },
    { label: "Cloud Solutions", href: "/services#cloud" },
    { label: "Projets", href: "/services#projets" },
  ],
  formations: [
    { label: "Insights", href: "/formations#insights" },
    { label: "Cas d'études", href: "/formations#cas-etudes" },
    { label: "Actualités", href: "/formations#actualites" },
    { label: "Certifications", href: "/formations#certifications" },
    { label: "Ressources", href: "/formations#ressources" },
    { label: "Formations", href: "/formations" },
  ],
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Politique de confidentialité", href: "/politique-confidentialite" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Logique d'inscription à la newsletter ici
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="bg-[#0a0d1e] text-white w-full" >
      {/* Newsletter Section */}
      <div className="border-b border-white/10 w-full">
        <div className="w-full px-12 md:px-24 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-white/60 text-lg md:text-xl whitespace-nowrap" style={{ marginLeft: "12px", marginRight: "12px" , marginBottom: "24px", marginTop: "24px"}}>
                Restez informé de la transformation digitale en Afrique.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto" style={{ marginRight: "48px" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email professionnel"
                className="px-6 py-4 bg-[#151929] border-2 border-white/10 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-[#4a7cff] transition-all w-full md:w-96 text-center"
                required
              />
              <button
                type="submit"
                className="btn-primary text-sm px-6 py-3"
              >
                {isSubscribed ? "✓ Inscrit" : "S'abonner"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="w-full px-12 md:px-24 py-20 md:py-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-3">
            <div className="mb-10">
              <Image
                src="/ascendys_logo-removebg-preview.png"
                alt="ASCENDYS CONNECT"
                width={420}
                height={135}
                className="h-[120px] w-auto brightness-0 invert"
              />
            </div>
            <p className="text-white/60 text-base leading-relaxed mb-8" style={{ marginLeft: "12px", marginRight: "12px" }}>
              Construire le futur digital de l'Afrique de l'Ouest.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 mt-6" style={{ marginLeft: "12px" }}>
              <a
                href="https://www.linkedin.com/company/ascendys-group"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-[18px] h-[18px] text-white/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com/ascendysgroup"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-[18px] h-[18px] text-white/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Entreprise Column */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-widest uppercase mb-7" style={{ color: "#FFC000", marginBottom: "20px" , marginTop: "18px"  }}>
              Entreprise
            </h3>
            <ul className="flex flex-col gap-5">
              {footerLinks.entreprise.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-widest uppercase mb-7" style={{ color: "#FFC000", marginBottom: "18px" , marginTop: "18px"  }}>
              Services
            </h3>
            <ul className="flex flex-col gap-5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Knowledge Column */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-widest uppercase mb-7" style={{ color: "#FFC000", marginBottom: "18px" , marginTop: "18px"  }}>
              Connaissances
            </h3>
            <ul className="flex flex-col gap-5">
              {footerLinks.formations.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold tracking-widest uppercase mb-7" style={{ color: "#FFC000", marginBottom: "18px" , marginTop: "18px"  }}>
              Nous Contacter
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-[#FFC000]" />
                <span className="text-sm text-white/60 leading-relaxed">
                  Lomé, Kpota colas<br />
                  Collés à la pharmacie MAELYS<br />
                  Togo
                </span>
              </li>
              <li>
                <a
                  href="mailto:contact@ascendys-group.com"
                  className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Mail size={16} className="flex-shrink-0 text-[#FFC000]" />
                  <span>contact@ascendys-group.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+22896498282"
                  className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Phone size={16} className="flex-shrink-0 text-[#FFC000]" />
                  <span>+228 96 49 82 82</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 w-full">
        <div className="w-full px-12 md:px-24 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs text-center sm:text-left"  style={{ marginLeft: "18px" , marginBottom: "28px" , marginTop: "28px"}}>
            © {new Date().getFullYear()} ASCENDYS CONNECT. Tous droits réservés.
          </p>
          <div className="flex items-center gap-5"  style={{ marginRight: "18px" }}>
            {footerLinks.legal.map((link, index) => (
              <span key={link.href} className="flex items-center gap-5">
                <Link
                  href={link.href}
                  className="text-white/40 text-xs hover:text-white/70 transition-colors"
                >
                  {link.label}
                </Link>
                {index < footerLinks.legal.length - 1 && (
                  <span className="text-white/20">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

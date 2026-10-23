import { useState } from "react";
import { Link } from "react-router";
import { useCompany } from "@/context/CompanyContext";
import SocialIcon from "@/components/common/SocialIcon";
import api from "@/services/api.service";
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();
  const { company, email, phones, fullAddress, socialLinks } = useCompany();

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setNewsletterStatus("error");
      setNewsletterMessage("Veuillez saisir une adresse email valide.");
      return;
    }

    setNewsletterStatus("loading");
    try {
      await api.post("/contact/newsletter/", { email: newsletterEmail.trim() });
      setNewsletterStatus("success");
      setNewsletterMessage("Merci ! Votre inscription à la newsletter a été enregistrée.");
      setNewsletterEmail("");
    } catch (err: any) {
      setNewsletterStatus("error");
      const errorMsg =
        err?.response?.data?.email?.[0] ||
        err?.response?.data?.message ||
        err?.message ||
        "Une erreur est survenue lors de l'inscription.";
      setNewsletterMessage(errorMsg);
    }
  };

  const footerLinks = {
    formation: {
      title: "Formations",
      links: [
        { name: "Digital & Tech", href: "/trainings" },
        { name: "Management", href: "/trainings" },
        { name: "Marketing", href: "/trainings" },
        { name: "Finance & Gestion", href: "/trainings" },
      ],
    },
    entreprise: {
      title: "Entreprise",
      links: [
        { name: "À propos", href: "/about" },
        { name: "Nos services", href: "/services" },
        { name: "Galerie", href: "/gallery" },
        { name: "Contact", href: "/contact" },
      ],
    },
    ressources: {
      title: "Ressources",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Formations certifiantes", href: "/trainings" },
        { name: "FAQ", href: "/contact" },
        { name: "Support", href: "/contact" },
      ],
    },
    legal: {
      title: "Légal",
      links: [
        { name: "Mentions légales", href: "/legal-notice" },
        { name: "Politique de confidentialité", href: "/privacy-policy" },
        { name: "CGU", href: "/terms-of-use" },
        { name: "Cookies", href: "/cookies" },
      ],
    },
  };

  return (
    <footer className="border-t border-gray-700 bg-gray-900 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Top Section */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Brand & Direct Contact Column */}
          <div className="lg:col-span-5">
            <Link to="/" className="mb-6 inline-flex items-center gap-3">
              <img
                src="/ascendys_logo-removebg-preview.png"
                alt="Ascendys Connect"
                className="h-16 w-auto brightness-0 invert"
              />
            </Link>
            <p className=" text-justify mb-6 text-sm leading-relaxed text-gray-300">
              {company?.short_description ||
                company?.description ||
                "Votre partenaire de confiance pour la formation professionnelle et les solutions IT & Digitales."}
            </p>

            {/* Direct Contact from DB */}
            <div className="mb-6 space-y-3">
              {phones.length > 0 && (
                <div className="flex items-start gap-3 text-sm text-gray-300">
                  <Phone className="mt-0.5 size-4 shrink-0 text-brand-400" />
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {phones.map((phone, idx) => (
                      <a
                        key={idx}
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className="transition-colors hover:text-brand-400"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {email && (
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Mail className="size-4 shrink-0 text-brand-400" />
                  <a
                    href={`mailto:${email}`}
                    className="transition-colors hover:text-brand-400"
                  >
                    {email}
                  </a>
                </div>
              )}

              {fullAddress && (
                <div className="flex items-start gap-3 text-sm text-gray-300">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" />
                  <span>{fullAddress}</span>
                </div>
              )}
            </div>

            {/* Social Links from DB */}
            {socialLinks.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Suivez-nous
                </p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-10 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-300 transition-all hover:border-brand-500 hover:bg-brand-600 hover:text-white"
                      aria-label={social.name}
                      title={social.name}
                    >
                      <SocialIcon platform={social.platform} className="size-5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-7">
            {Object.values(footerLinks).map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-300 transition-colors hover:text-brand-400"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="my-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white lg:p-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <h3 className="mb-2 text-2xl font-bold">
                Restez informé de nos actualités
              </h3>
              <p className="text-brand-100">
                Inscrivez-vous à notre newsletter pour recevoir nos dernières
                formations et opportunités professionnelles.
              </p>
            </div>
            <div>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    required
                    className="flex-1 rounded-lg border-0 bg-white/10 px-4 py-3 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === "loading"}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-gold-400 hover:shadow-lg disabled:opacity-50"
                  >
                    <Send className="size-4" />
                    <span>{newsletterStatus === "loading" ? "Envoi..." : "S'inscrire"}</span>
                  </button>
                </div>
                {newsletterStatus === "success" && (
                  <div className="flex items-center gap-2 text-sm text-green-300">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>{newsletterMessage}</span>
                  </div>
                )}
                {newsletterStatus === "error" && (
                  <div className="flex items-center gap-2 text-sm text-rose-300">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{newsletterMessage}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">
              © {currentYear} {company?.name || "Ascendys Connect"}. Tous droits réservés.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
              <Link to="/legal-notice" className="hover:text-gray-200">
                Mentions Légales
              </Link>
              <span>•</span>
              <Link to="/privacy-policy" className="hover:text-gray-200">
                Confidentialité
              </Link>
              <span>•</span>
              <Link to="/terms-of-use" className="hover:text-gray-200">
                CGU
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

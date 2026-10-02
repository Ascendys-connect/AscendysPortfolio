import { Link } from "react-router";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    formation: {
      title: "Formations",
      links: [
        { name: "Digital & Tech", href: "#formations" },
        { name: "Management", href: "#formations" },
        { name: "Marketing", href: "#formations" },
        { name: "Finance & Gestion", href: "#formations" },
      ],
    },
    entreprise: {
      title: "Entreprise",
      links: [
        { name: "À propos", href: "#a-propos" },
        { name: "Nos services", href: "#services" },
        { name: "Partenaires", href: "#" },
        { name: "Témoignages", href: "#" },
      ],
    },
    ressources: {
      title: "Ressources",
      links: [
        { name: "Blog", href: "#" },
        { name: "Documentation", href: "#" },
        { name: "FAQ", href: "#" },
        { name: "Support", href: "#" },
      ],
    },
    legal: {
      title: "Légal",
      links: [
        { name: "Mentions légales", href: "#" },
        { name: "Politique de confidentialité", href: "#" },
        { name: "CGV", href: "#" },
        { name: "Cookies", href: "#" },
      ],
    },
  };

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Top Section */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="mb-6 flex items-center gap-3">
              <img
                src="/ascendys_logo-removebg-preview.png"
                alt="Ascendys Connect"
                className="h-12 w-auto"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Ascendys Connect
              </span>
            </Link>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Votre partenaire de confiance pour la formation professionnelle au
              Togo. Développez vos compétences avec des experts et
              obtenez des certifications reconnues.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { name: "Facebook", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                { name: "Twitter", icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                { name: "LinkedIn", icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" },
                { name: "Instagram", icon: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-11C20 6.12 18.88 5 17.5 5h-11C5.12 5 4 6.12 4 7.5v11C4 19.88 5.12 21 6.5 21z" },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="flex size-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-brand-700 dark:hover:bg-brand-950/30 dark:hover:text-brand-400"
                  aria-label={social.name}
                >
                  <svg
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={social.icon}
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {Object.values(footerLinks).map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-600 transition-colors hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="my-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white lg:p-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div>
              <h3 className="mb-2 text-2xl font-bold">
                Restez informé de nos actualités
              </h3>
              <p className="text-brand-100">
                Inscrivez-vous à notre newsletter pour recevoir nos dernières
                formations et actualités
              </p>
            </div>
            <div>
              <form className="flex gap-3">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 rounded-lg border-0 bg-white/10 px-4 py-3 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-gold-500 px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-gold-400 hover:shadow-lg"
                >
                  S'inscrire
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 dark:border-gray-800">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Ascendys Connect. Tous droits réservés.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link
                to="/signin"
                className="text-sm text-gray-600 transition-colors hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
              >
                Connexion Administrateur
              </Link>
              <a
                href="#"
                className="text-sm text-gray-600 transition-colors hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
              >
                Plan du site
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

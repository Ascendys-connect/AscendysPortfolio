import { Building2, TrendingUp, Briefcase, Rocket, Lightbulb } from "lucide-react";

export default function ClientsSection() {
  const clientTypes = [
    {
      icon: <Building2 size={28} />,
      title: "Institutions & Programmes",
      description: "Organisations publiques, ONG et programmes de développement qui ont besoin d'une infrastructure IT fiable.",
    },
    {
      icon: <Briefcase size={28} />,
      title: "Organisations structurées",
      description: "Entreprises établies cherchant à optimiser, sécuriser ou moderniser leur système d'information.",
    },
    {
      icon: <TrendingUp size={28} />,
      title: "PME & Structures en croissance",
      description: "Entreprises en pleine expansion qui ont besoin d'un IT évolutif et performant.",
    },
    {
      icon: <Rocket size={28} />,
      title: "Projets digitaux",
      description: "Équipes qui développent des produits ou services digitaux et cherchent un partenaire technique.",
    },
    {
      icon: <Lightbulb size={28} />,
      title: "Entrepreneurs & Porteurs de projets",
      description: "Fondateurs et dirigeants qui souhaitent bâtir des bases IT solides dès le départ.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 dark:bg-gray-900 lg:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-0 top-0 size-96 rounded-full bg-brand-200 blur-3xl dark:bg-brand-900/20"></div>
        <div className="absolute bottom-0 right-0 size-96 rounded-full bg-purple-200 blur-3xl dark:bg-purple-900/20"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
            Nos clients
          </span>
          <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Nous <span className="text-brand-600 dark:text-brand-400">accompagnons</span>
          </h2>
          <div className="mx-auto mb-8 h-1 w-12 rounded bg-[#FFC000]"></div>
        </div>

        {/* Clients Grid - All in one row with split design */}
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {clientTypes.map((client, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-md transition-all duration-300 hover:scale-105 hover:border-brand-400 hover:shadow-xl dark:border-gray-800 dark:bg-gray-950 dark:hover:border-brand-600"
            >
              {/* Top Section - Colored with Icon */}
              <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 to-purple-600 p-6 text-center">
                {/* Decorative circles */}
                <div className="absolute -right-4 -top-4 size-16 rounded-full bg-white/10"></div>
                <div className="absolute -bottom-2 -left-2 size-12 rounded-full bg-white/10"></div>
                
                {/* Icon */}
                <div className="relative z-10 mx-auto mb-2 inline-flex size-16 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#FFC000] group-hover:text-gray-900">
                  {client.icon}
                </div>
                
                {/* Title */}
                <h3 className="relative z-10 text-sm font-bold text-white">
                  {client.title}
                </h3>
              </div>

              {/* Bottom Section - White with Description */}
              <div className="p-4">
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                  {client.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-purple-600 to-brand-800 p-12 text-center shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute left-0 top-0 size-32 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute bottom-0 right-0 size-32 rounded-full bg-white/10 blur-2xl"></div>

            {/* Content */}
            <div className="relative">
              <div className="mb-6 inline-flex items-center justify-center">
                <div className="rounded-full bg-white/20 px-6 py-2 backdrop-blur-sm">
                  <span className="text-sm font-semibold uppercase tracking-wider text-white">
                    Notre Promesse
                  </span>
                </div>
              </div>

              <h3 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                ASCENDYS CONNECT
              </h3>
              <div className="mb-6 flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-[#FFC000]"></div>
                <p className="text-2xl font-semibold text-[#FFC000]">
                  Pour plus de Valeur
                </p>
                <div className="h-px w-12 bg-[#FFC000]"></div>
              </div>
              <p className="mx-auto max-w-2xl text-lg text-white/90">
                Une promesse concrète, mesurable, à chaque mission.
              </p>

              {/* Decorative dots */}
              <div className="mt-8 flex items-center justify-center gap-2">
                <div className="size-2 rounded-full bg-white/40"></div>
                <div className="size-2 rounded-full bg-white/60"></div>
                <div className="size-2 rounded-full bg-[#FFC000]"></div>
                <div className="size-2 rounded-full bg-white/60"></div>
                <div className="size-2 rounded-full bg-white/40"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import {
  Check,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";
import PageMeta from "@/components/common/PageMeta";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { useApi } from "@/hooks/useApi";
import type { Service } from "@/services/services.service";
import { getMediaUrl } from "@/utils/media";

export default function Services() {
  // Fetch services from API
  const { data: services, isLoading, error, refetch } = useApi<Service[]>(
    "/services/?is_active=true",
    { defaultValue: [] }
  );

  // Default icon SVG (book icon)
  const defaultIcon = (
    <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
  return (
    <>
      <PageMeta
        title="Services — Nos domaines d'intervention"
        description="Ingénierie technique, conseil IT, sécurité informatique, solutions digitales et formation : découvrez les 5 domaines d'expertise d'ASCENDYS CONNECT."
      />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        <PublicNavbar />

        <main className="pt-20">
          {/* Hero Section */}
          <section className="relative py-20 text-white lg:py-28">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: 'url(/services.jpg)' }}
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />
            
            <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <h1 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
                Nos Services
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-brand-100">
                Des solutions IT & digitales complètes pour transformer votre entreprise
              </p>
            </div>
          </section>

          {/* Services detail */}
          <section className="bg-white py-16 lg:py-20">
            <div className="container-xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-16 flex flex-col items-center text-center">
                <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-[#9800BF]">
                  Nos services
                </span>
                <h1 className="mb-4 w-full text-center text-4xl font-extrabold leading-tight text-[#1A1A1A] md:text-5xl">
                  Nos domaines d&apos;intervention
                </h1>
                <div className="mb-6 h-1 w-12 rounded bg-[#FFC000]"></div>
                <p
                  className="max-w-xl text-center text-lg leading-relaxed text-[#6B6B6B]"
                  style={{ marginBottom: "18px" }}
                >
                  Nous ne vendons pas de technologies. Nous livrons des
                  solutions exploitables, adaptées à vos enjeux réels.
                </p>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col gap-16">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2"
                    >
                      <div className="space-y-4">
                        <div className="h-16 w-16 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700" />
                        <div className="h-8 animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                      </div>
                      <div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Impossible de charger les services
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-700"
                  >
                    Réessayer
                  </button>
                </div>
              )}

              {/* Services List */}
              {!isLoading && !error && (
                <div className="flex flex-col gap-16">
                  {services.map((service, i) => {
                    const iconUrl = getMediaUrl(service.icon);
                    const iconElement = iconUrl ? (
                      <img src={iconUrl} className="size-7" alt="" />
                    ) : defaultIcon;

                    return (
                      <div
                        key={service.id}
                        className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 ${
                          i % 2 === 1 ? "lg:flex-row-reverse" : ""
                        }`}
                      >
                        {/* Content */}
                        <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                          <div
                            className="mb-6 flex size-16 items-center justify-center rounded-2xl"
                            style={{
                              background:
                                "linear-gradient(135deg, #4208A1, #9800BF)",
                              color: "white",
                            }}
                          >
                            {iconElement}
                          </div>
                          <h2
                            className="text-2xl font-bold text-[#1A1A1A] md:text-3xl"
                            style={{ marginBottom: "18px" }}
                          >
                            {service.title}
                          </h2>
                          <p className="mb-7 mt-6 leading-relaxed text-[#6B6B6B]">
                            {service.description}
                          </p>
                          <ul className="flex flex-col gap-3">
                            {(service.features || []).map((feature, j) => (
                              <li key={j} className="flex items-start gap-3">
                                <Check
                                  size={16}
                                  className="mt-0.5 flex-shrink-0"
                                  style={{ color: "#9800BF" }}
                                />
                                <span className="text-sm font-medium text-[#1A1A1A]">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Visual card */}
                        <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                          <div
                            className="flex min-h-[280px] flex-col justify-between rounded-2xl"
                            style={{
                              background:
                                i % 2 === 0
                                  ? "linear-gradient(135deg, #1a0050 0%, #4208A1 100%)"
                                  : "#F9F7FF",
                              border:
                                i % 2 === 0
                                  ? "none"
                                  : "2px solid rgba(152,0,191,0.1)",
                              padding: "40px",
                            }}
                          >
                            <div>
                              <div
                                className="mb-2 text-xs font-semibold uppercase tracking-widest"
                                style={{
                                  color: i % 2 === 0 ? "#FFC000" : "#9800BF",
                                }}
                              >
                                Domaine {String(i + 1).padStart(2, "0")}
                              </div>
                              <h3
                                className="mb-3 text-xl font-bold"
                                style={{
                                  color: i % 2 === 0 ? "white" : "#1A1A1A",
                                }}
                              >
                                {service.title}
                              </h3>
                            </div>
                            <p
                              className={`text-sm leading-relaxed ${
                                i % 2 === 0 ? "text-white/65" : "text-[#6B6B6B]"
                              }`}
                            >
                              {service.short_description || service.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* CTA */}
          <section
            className="py-12"
            style={{
              background:
                "linear-gradient(135deg, #1a0050 0%, #4208A1 50%, #9800BF 100%)",
            }}
          >
            <div className="container-xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center text-center">
                <h2 className="mb-2 text-3xl font-extrabold text-white">
                  Un besoin spécifique ?
                </h2>
                <p className="mb-5 max-w-xl text-white/80">
                  Décrivez votre situation et nous trouverons ensemble la
                  solution adaptée.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#FFC000] px-8 py-4 text-base font-semibold text-gray-900 shadow-xl transition-all hover:bg-[#ffcc33] hover:shadow-2xl hover:-translate-y-0.5"
                >
                  Parler à un expert <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        </main>

        <PublicFooter />
        <WhatsAppButton />
      </div>
    </>
  );
}

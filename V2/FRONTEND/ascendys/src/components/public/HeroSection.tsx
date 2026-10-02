import { Link } from "react-router";

export default function HeroSection() {
  return (
    <section
      id="accueil"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/Hero background.jpeg"
          alt="Hero Background"
          className="size-full object-cover"
        />
        {/* Gradient Overlay - Using Ascendys violet brand colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4208a1]/95 via-[#9800bf]/90 to-[#4208a1]/95" />
        {/* Additional pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            <span className="flex size-2 rounded-full bg-gold-500 animate-pulse" />
            Organisme de formation certifié
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Construisez une carrière qui{" "}
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              vous unifiera
            </span>{" "}
            au futur du travail
          </h1>

          {/* Subheading */}
          <p className="mb-10 text-lg leading-relaxed text-gray-100 sm:text-xl">
            Formations professionnelles de qualité en digital, gestion et
            management. Développez vos compétences avec des experts et obtenez
            des certifications reconnues.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#formations"
              className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-8 py-4 text-base font-semibold text-gray-900 shadow-xl transition-all hover:bg-gold-400 hover:shadow-2xl hover:-translate-y-0.5"
            >
              Découvrir nos formations
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-xl"
            >
              Contactez-nous
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/20 pt-10 sm:grid-cols-4">
            <div>
              <div className="text-3xl font-bold text-gold-400 sm:text-4xl">
                500+
              </div>
              <div className="mt-2 text-sm text-gray-200">
                Étudiants formés
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-400 sm:text-4xl">
                50+
              </div>
              <div className="mt-2 text-sm text-gray-200">
                Formations disponibles
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-400 sm:text-4xl">
                95%
              </div>
              <div className="mt-2 text-sm text-gray-200">
                Taux de satisfaction
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-400 sm:text-4xl">
                20+
              </div>
              <div className="mt-2 text-sm text-gray-200">
                Partenaires certifiés
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center">
        <a
          href="#services"
          className="animate-bounce text-white transition-opacity hover:opacity-70"
        >
          <svg
            className="size-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}

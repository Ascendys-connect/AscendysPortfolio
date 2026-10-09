import PageMeta from "@/components/common/PageMeta";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import { Target, Users, Lightbulb, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function About() {
  const pillars = [
    {
      icon: <Target size={22} />,
      title: "Analyse réelle des besoins métiers",
      desc: "Nous partons toujours de vos enjeux concrets, pas d'une liste de technologies.",
    },
    {
      icon: <CheckCircle2 size={22} />,
      title: "Solutions pragmatiques et mesurables",
      desc: "Chaque livrable est défini, documenté et évaluable.",
    },
    {
      icon: <Lightbulb size={22} />,
      title: "Offres packagées et lisibles",
      desc: "Des offres claires, sans jargon.",
    },
    {
      icon: <CheckCircle2 size={22} />,
      title: "Accompagnement structuré et documenté",
      desc: "Chaque mission suit un processus précis avec livrables, jalons et comptes-rendus.",
    },
    {
      icon: <Users size={22} />,
      title: "Un interlocuteur unique",
      desc: "Un seul point de contact pour toute votre relation avec ASCENDYS CONNECT.",
    },
  ];

  const clients = [
    "Institutions et programmes",
    "Organisations structurées",
    "PME et structures en croissance",
    "Projets digitaux",
    "Entrepreneurs et porteurs de projets",
  ];

  return (
    <>
      <PageMeta
        title="À propos — Qui sommes-nous"
        description="ASCENDYS CONNECT est une entreprise de solutions IT & Digitales. Découvrez notre mission, notre approche et les organisations que nous accompagnons."
      />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        <PublicNavbar />

        <main className="pt-20">
          {/* Hero Section */}
          <section className="relative py-20 text-white lg:py-28">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/a_propos.jpg)' }}
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
            
            <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <div className="mb-6 inline-block rounded-full bg-brand-600/20 px-5 py-2 backdrop-blur-sm">
                <span className="text-sm font-semibold uppercase tracking-wider text-brand-300">
                  À propos
                </span>
              </div>
              <h1 className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Qui sommes‑nous
              </h1>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-200 lg:text-xl">
                Une entreprise de solutions IT & Digitales à Lomé, engagée pour plus
                de valeur dans chaque mission.
              </p>
            </div>
          </section>

          {/* Présentation */}
          <section className="py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div>
                  <span className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
                    Notre identité
                  </span>
                  <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
                    ASCENDYS CONNECT
                  </h2>
                  <div className="mb-6 h-1 w-12 rounded bg-[#FFC000]"></div>
                  <div className="mt-8 space-y-5">
                    <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                      ASCENDYS Connect est une entreprise de solutions IT &amp;
                      Digitales spécialisée dans l&apos;audit, le conseil, l&apos;ingénierie
                      technique, la sécurité informatique, les télécommunications,
                      le support et la formation professionnelle.
                    </p>
                    <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                      Nous accompagnons les organisations dans la conception, la
                      sécurisation et l&apos;optimisation de leurs systèmes
                      d&apos;information, avec une approche orientée performance et
                      résultats concrets.
                    </p>
                    <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                      Nous fournissons aussi le matériel nécessaire à vos projets
                      IT, installé, configuré et maintenu par nos équipes, afin de
                      garantir performance, compatibilité et sécurité.
                    </p>
                  </div>
                </div>

                {/* Mission card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4208A1] to-[#9800BF] p-8 shadow-2xl lg:p-10">
                  {/* Decorative elements */}
                  <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/5"></div>
                  <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-white/5"></div>

                  <div className="relative">
                    <div className="mb-4">
                      <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#FFC000]">
                        Notre mission
                      </div>
                      <h3 className="text-2xl font-bold leading-snug text-white">
                        Transformer l&apos;IT et le Digital en leviers de performance,
                        de sécurité et de croissance.
                      </h3>
                    </div>
                    <hr className="my-6 border-white/20" />
                    <p className="text-sm leading-relaxed text-white/80">
                      Chaque engagement que nous prenons est orienté vers un résultat
                      mesurable et exploitable pour votre organisation.
                    </p>
                    <p className="mt-6 font-semibold italic text-[#FFC000]">
                      « Pour plus de Valeur. »
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notre approche */}
          <section className="bg-gray-50 py-16 dark:bg-gray-900 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-14 flex flex-col items-center text-center">
                <span className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
                  Notre approche
                </span>
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                  5 piliers fondamentaux
                </h2>
                <div className="h-1 w-12 rounded bg-[#FFC000]"></div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pillars.map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:scale-105 hover:border-brand-400 hover:shadow-xl dark:border-gray-800 dark:bg-gray-950 dark:hover:border-brand-600"
                  >
                    <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#4208A1] to-[#9800BF] text-white">
                      {p.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{p.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{p.desc}</p>
                  </div>
                ))}
                <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-[#4208A1] to-[#9800BF] p-8 text-center">
                  <p className="text-lg font-semibold italic leading-snug text-white">
                    « Nous ne vendons pas de technologies. Nous livrons des
                    solutions exploitables. »
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Nos clients */}
          <section className="py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div>
                  <span className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
                    Nos clients
                  </span>
                  <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
                    Nous accompagnons
                  </h2>
                  <div className="mb-6 h-1 w-12 rounded bg-[#FFC000]"></div>
                  <p className="mb-8 mt-6 leading-relaxed text-gray-600 dark:text-gray-400">
                    Des organisations de toutes tailles, à chaque étape de leur
                    transformation IT et digitale.
                  </p>
                  <ul className="flex flex-col gap-3">
                    {clients.map((c, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 font-medium text-gray-900 dark:text-white"
                      >
                        <span className="size-2 shrink-0 rounded-full bg-[#FFC000]" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-5">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a0050] to-[#4208A1] p-8 shadow-2xl">
                    {/* Decorative elements */}
                    <div className="absolute -right-10 -top-10 size-32 rounded-full bg-white/5"></div>
                    <div className="absolute -bottom-10 -left-10 size-32 rounded-full bg-white/5"></div>

                    <div className="relative">
                      <h3 className="mb-3 text-xl font-bold text-white">
                        Prêt à travailler avec nous ?
                      </h3>
                      <p className="mb-6 text-sm text-white/75">
                        Premier échange offert pour analyser votre situation et
                        définir vos priorités
                      </p>
                      <Link 
                        to="/contact" 
                        className="inline-flex items-center gap-2 rounded-lg bg-[#FFC000] px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-[#FFD633] hover:shadow-lg"
                      >
                        Nous contacter <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <PublicFooter />
      </div>
    </>
  );
}

import type { Metadata } from "next";
import { Target, Users, Lightbulb, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos — Qui sommes-nous",
  description:
    "ASCENDYS CONNECT est une entreprise de solutions IT & Digitales. Découvrez notre mission, notre approche et les organisations que nous accompagnons.",
};

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

export default function AProposPage() {
  return (
    <>
      {/* Header Section */}
      <section className="section-py bg-white">
        <div className="container-xl">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="badge badge-violet mb-5">À propos</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] mb-5 max-w-2xl leading-tight">
              Qui sommes‑nous
            </h1>
            <p className="text-[#6B6B6B] text-lg max-w-xl leading-relaxed">
              Une entreprise de solutions IT & Digitales à Lomé, engagée pour plus
              de valeur dans chaque mission.
            </p>
          </div>
        </div>
      </section>

      {/* Présentation */}
      <section className="py-10 bg-white">
        <div className="container-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge badge-violet mb-4 inline-block">Notre identité</span>
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6 gold-underline"  style={{ marginBottom: "18px" }}>
                ASCENDYS CONNECT
              </h2>
              <div className="prose mt-8">
                <p>
                  ASCENDYS Connect est une entreprise de solutions IT &amp;
                  Digitales spécialisée dans l&apos;audit, le conseil, l&apos;ingénierie
                  technique, la sécurité informatique, les télécommunications,
                  le support et la formation professionnelle.
                </p>
                <p>
                  Nous accompagnons les organisations dans la conception, la
                  sécurisation et l&apos;optimisation de leurs systèmes
                  d&apos;information, avec une approche orientée performance et
                  résultats concrets.
                </p>
                <p>
                  Nous fournissons aussi le matériel nécessaire à vos projets
                  IT, installé, configuré et maintenu par nos équipes, afin de
                  garantir performance, compatibilité et sécurité.
                </p>
              </div>
            </div>

            {/* Mission card */}
            <div
              className="rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, #4208A1 0%, #9800BF 100%)",
                padding: "40px",
              }}
            >
              <div className="mb-6">
                <div
                  className="text-xs font-semibold tracking-widest uppercase mb-3"
                  style={{ color: "#FFC000" }}
                >
                  Notre mission
                </div>
                <h3 className="text-2xl font-bold text-white leading-snug" style={{ color: "#FFFFFF", marginTop: "7px" }}>
                  Transformer l&apos;IT et le Digital en leviers de performance,
                  de sécurité et de croissance.
                </h3>
              </div>
              <hr className="border-white/20 my-6" />
              <p className="text-white/70 text-sm leading-relaxed">
                Chaque engagement que nous prenons est orienté vers un résultat
                mesurable et exploitable pour votre organisation.
              </p>
              <p
                className="mt-6 font-semibold italic"
                style={{ color: "#FFC000" }}
              >
                « Pour plus de Valeur. »
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre approche */}
      <section className="section-py" style={{ background: "#F9F7FF" }}>
        <div className="container-xl">
          <div className="flex flex-col items-center mb-14">
            <span className="badge badge-violet mb-4" >Notre approche</span>
            <h2 className="text-3xl font-bold text-[#1A1A1A] text-center mb-3" >
              5 piliers fondamentaux
            </h2>
            <div
              className="mx-auto"  
              style={{
                width: "48px",
                height: "3px",
                background: "#FFC000",
                borderRadius: "2px",
                marginBottom: "18px"
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" >
            {pillars.map((p, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#E8E8E8] flex flex-col gap-3 card-lift transition-all duration-300 hover:border-[#9800BF]"
                style={{ padding: "32px" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#4208A1,#9800BF)",
                    color: "white",
                  }}
                >
                  {p.icon}
                </div>
                <h3 className="font-semibold text-[#1A1A1A]">{p.title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{p.desc}</p>
              </div>
            ))}
            <div
              className="rounded-xl flex items-center justify-center text-center"
              style={{ 
                background: "linear-gradient(135deg,#4208A1,#9800BF)",
                padding: "32px",
              }}
            >
              <p className="text-white font-semibold text-lg leading-snug italic">
                « Nous ne vendons pas de technologies. Nous livrons des
                solutions exploitables. »
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos clients */}
      <section className="section-py bg-white">
        <div className="container-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge badge-violet mb-4 inline-block">Nos clients</span>
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6 gold-underline">
                Nous accompagnons
              </h2>
              <p className="text-[#6B6B6B] mt-6 leading-relaxed mb-8" style={{ marginTop: "18px" }}>
                Des organisations de toutes tailles, à chaque étape de leur
                transformation IT et digitale.
              </p>
              <ul className="flex flex-col gap-3">
                {clients.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-[#1A1A1A] font-medium"
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: "#FFC000" }}
                    />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-5">
              <div
                className="rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #1a0050 0%, #4208A1 100%)",
                  padding: "32px",
                }}
              >
                <h3 className="text-white font-bold text-xl mb-3" style={{ color: "#FFFFFF"}}>
                  Prêt à travailler avec nous ?
                </h3>
                <p className="text-white/65 text-sm mb-6" style={{ marginBottom: "12px", marginTop:"12px"}}>
                  Premier échange offert pour analyser votre situation et
                  définir vos priorités 
                </p>
                <Link href="/contact" className="btn-gold text-sm" >
                  Nous contacter <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

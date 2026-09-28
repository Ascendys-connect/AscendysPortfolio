import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  ArrowRight,
  ArrowLeft,
  Star,
  AlertCircle,
  CreditCard,
  Zap,
} from "lucide-react";
import formations, { getFormationBySlug } from "@/data/formations";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return formations.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const f = getFormationBySlug(slug);
  if (!f) return {};
  return {
    title: f.title,
    description: `Formation ${f.title} par ASCENDYS CONNECT. ${f.duration}, ${f.price}. ${f.level}.`,
  };
}

const categoryColors: Record<string, string> = {
  "IT & Digital": "#9800BF",
  "Conseil & Transformation": "#4208A1",
  "Transversales & Innovation": "#6b21a8",
};

export default async function FormationDetailPage({ params }: Props) {
  const { slug } = await params;
  const f = getFormationBySlug(slug);
  if (!f) notFound();

  const color = categoryColors[f.category] ?? "#9800BF";

  return (
    <>
      {/* Hero */}
      <section
        className="section-py relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #0d0025 0%, #1a0050 40%, ${color} 100%)` }}
      >
        <div className="container-xl relative z-10">
          <Link
            href="/formations"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={15} />
            Retour au catalogue
          </Link>

          {/* Category + level */}
          <div className="flex flex-wrap gap-2 mb-5"  style={{ marginTop : "18px"}}>
            <span
              className="badge badge-white text-xs"
            >
              {f.category}
            </span>
            <span
              className="badge text-xs"
              style={{ background: "rgba(255,192,0,0.15)", color: "#FFC000", border: "1px solid rgba(255,192,0,0.3)" }}
            >
              {f.level}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-8 max-w-3xl leading-tight" style={{ color: "#FFFFFF" }}>
            {f.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-6 text-white/65 text-sm mb-10" style={{ marginTop : "18px"}}>
            <span className="flex items-center gap-2">
              <Clock size={15} style={{ color: "#FFC000" }} />
              {f.duration}
            </span>
            <span className="flex items-center gap-2">
              <Users size={15} style={{ color: "#FFC000" }} />
              {f.maxPlaces} places maximum
            </span>
            <span className="flex items-center gap-2" >
              <Zap size={15} style={{ color: "#FFC000" }} />
              {f.format}
            </span>
          </div>

          {/* Price + CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-4"  style={{ marginTop : "18px"}}>
            <div>
              <div className="text-white/50 text-xs mb-1 uppercase tracking-wide"  style={{ marginBottom : "18px"}}>Investissement</div>
              <div className="text-3xl font-extrabold" style={{ color: "#FFC000", marginBottom: "18px" }}>
                {f.price}
              </div>
            </div>
            <Link href="/contact" className="btn-gold"  style={{ marginTop : "20px"}}>
              S&apos;inscrire maintenant <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky mini CTA on scroll — visible on desktop */}
      <div className="hidden lg:block sticky top-16 z-30 bg-white border-b border-[#E8E8E8] shadow-sm" style={{marginBottom: "18px" }}>
        <div className="container-xl py-3 flex items-center justify-between">
          <span className="font-semibold text-[#1A1A1A] text-sm truncate" style={{marginTop: "28px" , marginBottom: "28px" }}>{f.shortTitle}</span>
          <div className="flex items-center gap-4">
            <span className="font-bold text-sm" style={{ color }}>
              {f.price}
            </span>
            <Link href="/contact" className="btn-primary text-sm" style={{ padding: "8px 18px", fontSize: "0.8125rem" }}>
              S&apos;inscrire <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="py-16 bg-white">
        <div className="container-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left column: main content */}
            <div className="lg:col-span-2 flex flex-col gap-12">

              {/* Pour qui */}
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6 gold-underline" style={{marginTop: "30px", marginBottom: "28px" }}>
                  Cette formation est pour vous si…
                </h2>
                <ul className="flex flex-col gap-3 mt-6">
                  {f.targetAudience.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#1A1A1A]">
                      <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" style={{ color }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prérequis */}
              {f.prerequisites && (
                <div className="rounded-xl border-l-4 bg-purple-50" style={{ padding: "32px", borderColor: color , marginBottom:"18px" }}>
                  <h3 className="font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                    <AlertCircle size={16} style={{ color }} />
                    Prérequis d&apos;accès
                  </h3>
                  <ul className="flex flex-col gap-2" style={{ marginTop: "18px"}}>
                    {f.prerequisites.map((p, i) => (
                      <li key={i} className="text-sm text-[#555] flex items-start gap-2" >
                        <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"  />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Le problème */}
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6 gold-underline" style={{marginBottom: "18px" }}>
                  Le problème que vous rencontrez
                </h2>
                <p className="text-[#6B6B6B] mt-6 mb-4" style={{marginBottom: "18px" }}>
                  Sans formation structurée, beaucoup de personnes :
                </p>
                <ul className="flex flex-col gap-3">
                  {f.problem.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#555]">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#FFC000" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ce que vous obtiendrez */}
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6 gold-underline" style={{ marginBottom: "18px"  }}>
                  Ce que vous obtiendrez
                </h2>
                <p className="text-[#6B6B6B] mt-6 mb-6">{f.deliverablesTitle}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Livrables */}
                  <div className="rounded-xl border border-[#E8E8E8]" style={{ padding: "32px" }}>
                    <h3 className="font-bold text-[#1A1A1A] mb-4 text-sm uppercase tracking-wider" style={{ color , marginBottom: "18px"}}>
                      Vos livrables professionnels
                    </h3>
                    <ul className="flex flex-col gap-3">
                      {f.deliverables.map((d, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-[#555]">
                          <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" style={{ color }} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Compétences */}
                  <div className="rounded-xl border border-[#E8E8E8]" style={{ padding: "32px" }}>
                    <h3 className="font-bold text-[#1A1A1A] mb-4 text-sm uppercase tracking-wider" style={{ color, marginBottom: "18px" }}>
                      Vos nouvelles compétences
                    </h3>
                    <ul className="flex flex-col gap-3">
                      {f.skills.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-[#555]">
                          <Star size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#FFC000" }} />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Transformation */}
                <div
                  className="rounded-xl"
                  style={{ padding: "32px", background: `linear-gradient(135deg, #1a0050 0%, ${color} 100%)` , marginTop : "18px"}}
                >
                  <div className="text-white/50 text-xs uppercase tracking-wider mb-3"  style={{ marginBottom : "18px"}}>Votre transformation</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white/10 rounded-lg" style={{ padding: "20px" }}>
                      <div className="text-white/50 text-xs mb-2">Avant</div>
                      <p className="text-white font-medium text-sm italic">&ldquo;{f.transformation.from}&rdquo;</p>
                    </div>
                    <div className="rounded-lg" style={{ padding: "20px", background: "rgba(255,192,0,0.15)", border: "1px solid rgba(255,192,0,0.3)" }}>
                      <div className="text-yellow-300/70 text-xs mb-2">Après</div>
                      <p className="font-semibold text-sm italic" style={{ color: "#FFC000" }}>
                        &ldquo;{f.transformation.to}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ce qui est inclus */}
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6 gold-underline" style={{ marginBottom: "18px"  }}>
                  Ce qui est inclus
                </h2>
                <div className="mt-8 rounded-xl bg-[#F9F7FF] border border-[#E8E8E8]" style={{ padding: "32px" }}>
                  <div className="text-xs uppercase tracking-wider font-semibold text-[#6B6B6B] mb-4">
                    {f.sessions} — {f.format}
                  </div>
                  <br />
                  <ul className="flex flex-col gap-3">
                    {f.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color }} />
                        <span className="text-[#1A1A1A] text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Ce qui N'est PAS inclus */}
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-4" style={{ marginBottom: "18px"  }} >
                  Ce qui n&apos;est PAS inclus
                </h2>
                <p className="text-[#6B6B6B] text-sm mb-4"style={{ marginBottom: "10px"  }}>Par souci de transparence :</p>
                <ul className="flex flex-col gap-2">
                  {f.notIncluded.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#6B6B6B] text-sm">
                      <XCircle size={16} className="mt-0.5 flex-shrink-0 text-[#ABABAB]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Positionnement stratégique */}
              {f.strategicPositioning.length > 0 && (
                <div
                  className="rounded-xl"
                  style={{ padding: "32px", background: "linear-gradient(135deg, #4208A1, #9800BF)" }}
                >
                  <h3 className="font-bold text-white mb-4" style={{ marginBottom: "18px" }}>Positionnement stratégique</h3>
                  <ul className="flex flex-col gap-3">
                    {f.strategicPositioning.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/80 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{  marginTop: "18px" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div style={{marginBottom: "18px" }}></div>
                  <div className="mt-6" >
                    <Link href="/contact" className="btn-gold text-sm">
                      {f.ctaText} <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 flex flex-col gap-6">
                {/* Pricing card */}
                <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: color }}>
                  <div style={{ padding: "32px", background: `linear-gradient(135deg, #1a0050, ${color})` }}>
                    <div className="text-white/60 text-xs uppercase tracking-wider mb-1" >Investissement</div>
                    <div className="text-3xl font-extrabold text-white mb-1">{f.price}</div>
                    <div className="text-white/50 text-xs">{f.duration} · {f.maxPlaces} places max</div>
                  </div>
                  <div className="bg-white flex flex-col gap-3" style={{ padding: "32px" }}>
                    <div className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-1 flex items-center gap-2">
                      <CreditCard size={13} /> Modalités de paiement
                    </div>
                    {f.paymentOptions.map((opt, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-[#555]">
                        <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color }} />
                        {opt}
                      </div>
                    ))}
                    <div className="pt-4 border-t border-[#E8E8E8] mt-2">
                      <div className="flex items-center gap-2 text-sm font-semibold mb-1" style={{ color: "#9800BF" }}>
                        <AlertCircle size={14} />
                        Places limitées
                      </div>
                      <p className="text-xs text-[#ABABAB]">
                        {f.maxPlaces} places maximum · Prochaines dates à annoncer
                      </p>
                    </div>
                    <Link href="/contact" className="btn-primary mt-2">
                      S&apos;inscrire <ArrowRight size={16} />
                    </Link>
                    <Link href="/contact" className="text-center text-xs text-[#ABABAB] hover:text-[#9800BF] transition-colors">
                      Des questions ? Nous contacter
                    </Link>
                  </div>
                </div>

                {/* Premium options */}
                {f.premiumOptions.length > 0 && (
                  <div className="rounded-2xl border border-[#E8E8E8] overflow-hidden">
                    <div className="border-b border-[#E8E8E8] bg-[#F9F7FF]" style={{ padding: "20px 32px" }}>
                      <h3 className="font-bold text-sm text-[#1A1A1A]">Options Premium</h3>
                    </div>
                    <div className="divide-y divide-[#E8E8E8]">
                      {f.premiumOptions.map((opt, i) => (
                        <div key={i} style={{ padding: "24px 32px" }}>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h4 className="font-semibold text-sm text-[#1A1A1A]">{opt.title}</h4>
                            {opt.price && (
                              <span className="text-xs font-bold px-2 py-1 rounded-full text-white whitespace-nowrap" style={{ background: color }}>
                                {opt.price}
                              </span>
                            )}
                          </div>
                          <ul className="flex flex-col gap-1.5"  style={{ marginTop : "18px"}}>
                            {opt.items.map((item, j) => (
                              <li key={j} className="text-xs text-[#6B6B6B] flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[#F9F7FF]" style={{ padding: "20px 32px" }}>
                      <Link href="/contact" className="text-xs font-semibold flex items-center gap-1" style={{ color }}>
                        En savoir plus sur les options <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="py-16" style={{marginTop: "20px", background: "linear-gradient(135deg, #1a0050 0%, #4208A1 50%, #9800BF 100%)" }}>
        <div className="container-xl">
          <div className="flex flex-col items-center justify-center text-center">
            <br />
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4" style={{ color: "#FFFFFF" }} >
              Prêt à commencer ?
            </h2>
            <p className="text-white/65 text-sm max-w-lg mb-8"  style={{marginTop: "18px", marginBottom : "18px"}}>
              Places limitées à {f.maxPlaces} participants. Inscrivez-vous maintenant pour réserver votre place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4" style={{ marginBottom: "18px"}}>
              <Link href="/contact" className="btn-gold">
                {f.ctaText} <ArrowRight size={16} />
              </Link>
              <Link href="/formations" className="btn-outline">
                Voir toutes les formations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

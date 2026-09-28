import type { Metadata } from "next";
import { Network, BarChart3, ShieldCheck, Cloud, GraduationCap, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import services from "@/data/services";

export const metadata: Metadata = {
  title: "Services — Nos domaines d'intervention",
  description:
    "Ingénierie technique, conseil IT, sécurité informatique, solutions digitales et formation : découvrez les 5 domaines d'expertise d'ASCENDYS CONNECT.",
};

const iconMap: Record<string, React.ReactNode> = {
  Network: <Network size={28} />,
  BarChart3: <BarChart3 size={28} />,
  ShieldCheck: <ShieldCheck size={28} />,
  Cloud: <Cloud size={28} />,
  GraduationCap: <GraduationCap size={28} />,
};

export default function ServicesPage() {
  return (
    <>
      {/* Services detail */}
      <section className="section-py bg-white">
        <div className="container-xl">
          <div className="mb-16 text-center flex flex-col items-center">
            <span className="badge badge-violet mb-5">Nos services</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] mb-4 max-w-2xl text-center leading-tight">
              Nos domaines d&apos;intervention
            </h1>
            <div className="w-12 h-1 bg-[#FFC000] rounded mb-6"></div>
            <p className="text-[#6B6B6B] text-lg max-w-xl text-center leading-relaxed"  style={{ marginBottom: "18px" }}>
              Nous ne vendons pas de technologies. Nous livrons des solutions
              exploitables, adaptées à vos enjeux réels.
            </p>
          </div>
          
          <div className="flex flex-col gap-16">
          {services.map((service, i) => (
            <div
              key={service.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Content */}
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: "linear-gradient(135deg, #4208A1, #9800BF)",
                    color: "white",
                  }}
                >
                  {iconMap[service.icon]}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] gold-underline" style={{ marginBottom: "18px" }}>
                  {service.title}
                </h2>
                <p className="text-[#6B6B6B] mt-6 leading-relaxed mb-7">
                  {service.description}
                </p>
                <ul className="flex flex-col gap-3">
                  {service.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check
                        size={16}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: "#9800BF" }}
                      />
                      <span className="text-[#1A1A1A] text-sm font-medium">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual card */}
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div
                  className="rounded-2xl min-h-[280px] flex flex-col justify-between"
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
                      className="text-xs font-semibold tracking-widest uppercase mb-2"
                      style={{ color: i % 2 === 0 ? "#FFC000" : "#9800BF" }}
                    >
                      Domaine {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{ color: i % 2 === 0 ? "white" : "#1A1A1A" }}
                    >
                      {service.title}
                    </h3>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      i % 2 === 0 ? "text-white/65" : "text-[#6B6B6B]"
                    }`}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20"
        style={{
          background:
            "linear-gradient(135deg, #1a0050 0%, #4208A1 50%, #9800BF 100%)",
        }}
      >
        <div className="container-xl">
          <div className="flex flex-col items-center justify-center text-center">
            <br />
            <h2 className="text-3xl font-extrabold text-white mb-4" style={{marginBottom: "18px" , color: "#FFFFFF"}}>
              Un besoin spécifique ?
            </h2>
            <Link href="/contact" className="btn-gold">
              Parler à un expert <ArrowRight size={16} />
            </Link>
            <div>
                  <p className="text-white/65 mb-8 max-w-xl">
              Décrivez votre situation et nous trouverons ensemble la solution adaptée.
            </p>
            <br />
            </div>
            
            
          </div>
        </div>
      </section>
    </>
  );
}

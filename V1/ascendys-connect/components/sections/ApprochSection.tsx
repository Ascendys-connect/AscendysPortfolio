"use client";

import { motion } from "framer-motion";
import { Search, Puzzle, Package, BookOpen, User } from "lucide-react";

const pillars = [
  {
    icon: <Search size={22} />,
    title: "Analyse réelle des besoins métiers",
    description:
      "Nous partons toujours de vos enjeux concrets, pas d'une liste de technologies.",
  },
  {
    icon: <Puzzle size={22} />,
    title: "Solutions pragmatiques et mesurables",
    description:
      "Chaque livrable est défini, documenté et évaluable. Pas de promesses vagues.",
  },
  {
    icon: <Package size={22} />,
    title: "Offres packagées et lisibles",
    description:
      "Des offres claires, sans jargon, pour que vous sachiez exactement ce que vous achetez.",
  },
  {
    icon: <BookOpen size={22} />,
    title: "Accompagnement structuré et documenté",
    description:
      "Chaque mission suit un processus précis avec livrables, jalons et comptes-rendus.",
  },
  {
    icon: <User size={22} />,
    title: "Un interlocuteur unique",
    description:
      "Un seul point de contact pour toute votre relation avec ASCENDYS CONNECT.",
  },
];

export default function ApprochSection() {
  return (
    <section
      className="section-py"
      style={{ background: "#F9F7FF" }}
      id="approche"
    >
      <div className="container-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: content */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4" style={{ marginBottom: "18px" }}>
              <span className="badge badge-violet">Notre approche</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-5 gold-underline" style={{ marginBottom: "18px" }} >
              Méthode,
              <br />
              pas improvisation
            </h2>
            <p className="text-[#6B6B6B] mt-6 text-lg leading-relaxed mb-6"  style={{ marginBottom: "18px" }} >
              Notre approche repose sur 5 piliers fondamentaux qui garantissent
              des résultats concrets et mesurables pour votre organisation.
            </p>
            <blockquote
              className="border-l-4 pl-5 italic text-[#1A1A1A] font-semibold text-lg"
              style={{ borderColor: "#FFC000" }}
            >
              « Nous ne vendons pas de technologies.
              <br />
              Nous livrons des solutions exploitables. »
            </blockquote>
          </motion.div>

          {/* Right: pillars */}
          <div className="flex flex-col gap-4">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-start gap-5 rounded-xl bg-white border border-[#E8E8E8] card-lift transition-all duration-300 hover:border-[#9800BF]"
                style={{ padding: "24px" }}
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #55318e, #9800BF)",
                    color: "white",
                  }}
                >
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A1A1A] mb-1 text-sm">
                    {pillar.title}
                  </h3>
                  <p className="text-[#6B6B6B] text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

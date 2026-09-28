"use client";

import { motion } from "framer-motion";
import { Building2, Globe, TrendingUp, Monitor, Lightbulb } from "lucide-react";

const clients = [
  {
    icon: Building2,
    title: "Institutions & Programmes",
    description:
      "Organisations publiques, ONG et programmes de développement qui ont besoin d'une infrastructure IT fiable.",
  },
  {
    icon: Globe,
    title: "Organisations structurées",
    description:
      "Entreprises établies cherchant à optimiser, sécuriser ou moderniser leur système d'information.",
  },
  {
    icon: TrendingUp,
    title: "PME & Structures en croissance",
    description:
      "Entreprises en pleine expansion qui ont besoin d'un IT évolutif et performant.",
  },
  {
    icon: Monitor,
    title: "Projets digitaux",
    description:
      "Équipes qui développent des produits ou services digitaux et cherchent un partenaire technique.",
  },
  {
    icon: Lightbulb,
    title: "Entrepreneurs & Porteurs de projets",
    description:
      "Fondateurs et dirigeants qui souhaitent bâtir des bases IT solides dès le départ.",
  },
];

export default function ClientsSection() {
  return (
    <section className="section-py bg-[#FAFAFA]" id="clients">
      <div className="container-xl">
        {/* Header */}
        <div className="mb-14 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <span className="badge badge-violet mb-4"  style={{ marginBottom: "18px" }}>Nos clients</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Nous accompagnons
            </h2>
            <div className="w-12 h-1 bg-[#FFC000] rounded mb-6"  style={{ marginBottom: "18px" }}></div>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {clients.map((client, i) => {
            const Icon = client.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="block h-full rounded-2xl border-2 border-[#E8E8E8] card-lift group bg-white transition-all duration-300 hover:border-[#9800BF]"
              >
                <div className="flex flex-col h-full" style={{ padding: "32px" }}>
                  {/* Icon */}
                  <div
                    className="rounded-2xl flex items-center justify-center mb-6"
                    style={{
                      width: "64px",
                      height: "64px",
                      background: "linear-gradient(135deg, #9800BF 0%, #4208A1 100%)",
                    }}
                  >
                    <Icon size={28} className="text-white" strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-4 group-hover:text-[#9800BF] transition-colors">
                    {client.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">
                    {client.description}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* Promise Card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="block h-full rounded-2xl border-2 border-[#FFC000] bg-white transition-all duration-300 hover:border-[#9800BF]"
          >
            <div className="flex flex-col h-full justify-center" style={{ padding: "32px" }}>
              {/* Quote decoration */}
              <div
                className="font-serif leading-none mb-4"
                style={{ 
                  color: "#FFC000",
                  fontSize: "56px",
                }}
              >
                &ldquo;
              </div>

              {/* Promise text */}
              <p className="text-lg font-bold text-[#1A1A1A] mb-3 leading-snug">
                ASCENDYS CONNECT — Pour plus de Valeur.
              </p>

              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Une promesse concrète, mesurable, à chaque mission.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

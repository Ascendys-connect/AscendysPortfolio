"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Network, BarChart3, ShieldCheck, Cloud, GraduationCap, ArrowRight } from "lucide-react";
import services from "@/data/services";

const iconMap: Record<string, React.ReactNode> = {
  Network: <Network size={26} />,
  BarChart3: <BarChart3 size={26} />,
  ShieldCheck: <ShieldCheck size={26} />,
  Cloud: <Cloud size={26} />,
  GraduationCap: <GraduationCap size={26} />,
};

export default function ServicesSection() {
  return (
    <section className="section-py bg-white" id="services">
      <div className="container-xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center flex flex-col items-center"
        >
          <span className="badge badge-violet mb-4">Nos services</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
            Nos domaines d&apos;intervention
          </h2>
          <div className="w-12 h-1 bg-[#FFC000] rounded mb-6"></div>
          <p className="text-[#6B6B6B] text-lg leading-relaxed max-w-2xl">
            Nous ne vendons pas de technologies.{" "}
            <strong className="text-[#1A1A1A]">
              Nous livrons des solutions exploitables.
            </strong>
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`card-lift group rounded-2xl border border-[#E8E8E8] bg-white transition-all duration-300 hover:border-[#9800BF] ${
                i === 0 ? "lg:col-span-1" : ""
              }`}
              style={{ padding: "32px" }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-[#9800BF]"
                style={{ background: "rgba(152, 0, 191, 0.08)", color: "#9800BF" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "white";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#9800BF";
                }}
              >
                {iconMap[service.icon]}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-3 leading-tight">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#6B6B6B] leading-relaxed mb-5">
                {service.description}
              </p>

              {/* Items */}
              <ul className="flex flex-col gap-2">
                {service.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-[#555]">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#FFC000" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl flex flex-col justify-between"
            style={{ 
              background: "linear-gradient(135deg, #4208A1 0%, #9800BF 100%)",
              padding: "32px",
            }}
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                Un besoin IT spécifique ?
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Discutons de votre projet et construisons ensemble la solution
                adaptée à vos enjeux.
              </p>
            </div>
            <Link
              href="/contact"
              className="mt-8 flex items-center gap-2 font-semibold text-sm"
              style={{ color: "#FFC000" }}
            >
              Nous contacter <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Full services link */}
        <div style={{ marginTop: "40px" }} className="flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/services" className="btn-outline-dark">
              Voir tous nos services <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

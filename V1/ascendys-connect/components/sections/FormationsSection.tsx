"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Users } from "lucide-react";
import formations from "@/data/formations";

const featured = formations.slice(0, 3);

const categoryColors: Record<string, string> = {
  "IT & Digital": "#9800BF",
  "Conseil & Transformation": "#4208A1",
  "Transversales & Innovation": "#6b21a8",
};

export default function FormationsSection() {
  return (
    <section className="section-py bg-white" id="formations">
      <div className="container-xl">
        {/* Header */}
        <div className="mb-14 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginTop: "18px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <span className="badge badge-violet mb-4">Formations</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4" style={{ marginTop: "18px" }}>
              Renforcer vos
              <br />
              compétences IT
            </h2>
            <div className="w-12 h-1 bg-[#FFC000] rounded mb-8" ></div>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {featured.map((f, i) => (
            <motion.div
              key={f.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              style={{ marginTop: "24px" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/formations/${f.slug}`}
                className="block h-full rounded-2xl border border-[#E8E8E8] overflow-hidden card-lift group bg-white transition-all duration-300 hover:border-[#9800BF]"
              >
                {/* Top colored stripe */}
                <div
                  className="h-2"
                  style={{
                    background: `linear-gradient(90deg, ${categoryColors[f.category]}, #FFC000)`,
                  }}
                />

                <div className="flex flex-col h-full" style={{ padding: "32px" }}>
                  {/* Category badge */}
                  <span
                    className="badge mb-4 text-xs self-start"
                    style={{
                      background: `${categoryColors[f.category]}15`,
                      color: categoryColors[f.category],
                      border: `1px solid ${categoryColors[f.category]}30`,
                    }}
                  >
                    {f.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-4 group-hover:text-[#9800BF] transition-colors" style={{ lineHeight: "1.6" }}>
                    {f.shortTitle}
                  </h3>

                  {/* Level */}
                  <p className="text-xs text-[#ABABAB] font-medium uppercase tracking-wider mb-5" style={{ lineHeight: "1.8" }}>
                    {f.level}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-[#6B6B6B] mb-6" style={{ lineHeight: "1.8" }}>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-[#9800BF]" />
                      {f.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={13} className="text-[#9800BF]" />
                      {f.maxPlaces} places max
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-auto pt-5 border-t border-[#E8E8E8] flex items-center justify-between">
                    <span className="text-xl font-extrabold text-[#9800BF]">
                      {f.price}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-[#9800BF] group-hover:gap-2 transition-all">
                      Découvrir <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: "18px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-[#6B6B6B] text-sm mb-4 style"  style={{ marginBottom: "18px" }} >
            7 formations disponibles · IT, Réseau, IA, Conseil
          </p>
          <Link href="/formations" className="btn-primary">
            Voir tout le catalogue de formations
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

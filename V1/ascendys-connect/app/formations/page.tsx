"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock, Users, ArrowRight, Filter } from "lucide-react";
import formations, { categories } from "@/data/formations";
import type { Formation } from "@/data/formations";

const categoryColors: Record<string, string> = {
  "IT & Digital": "#9800BF",
  "Conseil & Transformation": "#4208A1",
  "Transversales & Innovation": "#6b21a8",
};

export default function FormationsPage() {
  const [active, setActive] = useState<string>("Toutes");

  const filtered =
    active === "Toutes"
      ? formations
      : formations.filter((f) => f.category === active);

  return (
    <>
      {/* Header Section */}
      <section className="section-py bg-white">
        <div className="container-xl">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="badge badge-violet mb-5">Formations</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] mb-5 max-w-2xl leading-tight">
              Catalogue des formations
            </h1>
            <p className="text-[#6B6B6B] text-lg max-w-xl leading-relaxed">
              7 formations professionnelles intensives, orientées terrain et
              axées sur les livrables concrets.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((f) => (
              <FormationCard key={f.slug} formation={f} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="py-16"
        style={{
          background:
            "linear-gradient(135deg, #1a0050 0%, #4208A1 50%, #9800BF 100%)",
        }}
      >
        <div className="container-xl text-center" style={{ marginTop: "18px" }}>
          <br></br>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 mt-[18px]" style={{marginBottom: "18px" }}>
            Des questions sur nos formations ?
          </h2>
          <Link href="/contact" className="btn-gold mb-8">
            Nous contacter <ArrowRight size={16} />
          </Link>
          <div>
              <p className="text-white/65 mb-[18px] text-sm  mt-[18px]" style={{marginBottom: "px" }}>
                Nous sommes là pour vous orienter vers la formation la plus adaptée
                à votre profil et vos objectifs.
              </p>
          <br />
          </div>
          
        </div>
      </section>
    </>
  );
}

function FormationCard({ formation: f }: { formation: Formation }) {
  const color = categoryColors[f.category] ?? "#9800BF";
  return (
    <Link
      href={`/formations/${f.slug}`}
      className="block h-full rounded-2xl border border-[#E8E8E8] overflow-hidden card-lift group bg-white transition-all duration-300 hover:border-[#9800BF]"
    >
      {/* Top stripe */}
      <div
        className="h-2"
        style={{ background: `linear-gradient(90deg, ${color}, #FFC000)` }}
      />
      <div className="flex flex-col h-full" style={{ padding: "32px" }}>
        {/* Category */}
        <span
          className="badge mb-4 text-xs self-start"
          style={{
            background: `${color}15`,
            color,
            border: `1px solid ${color}30`,
          }}
        >
          {f.category}
        </span>

        {/* Title */}
        <h2 className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-[#9800BF] transition-colors" style={{ lineHeight: "1.6" }}>
          {f.shortTitle}
        </h2>
        <p className="text-xs text-[#ABABAB] uppercase tracking-wider font-medium mb-5" style={{ lineHeight: "1.8" }}>
          {f.level}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-[#6B6B6B] mb-5" style={{ lineHeight: "1.8" }}>
          <span className="flex items-center gap-1">
            <Clock size={12} style={{ color }} />
            {f.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} style={{ color }} />
            {f.maxPlaces} places max
          </span>
        </div>

        {/* Format */}
        <p className="text-xs text-[#ABABAB] mb-6" style={{ lineHeight: "1.8" }}>{f.format}</p>

        {/* Price */}
        <div className="mt-auto pt-5 border-t border-[#E8E8E8] flex items-center justify-between">
          <span className="text-xl font-extrabold" style={{ color }}>
            {f.price}
          </span>
          <span
            className="flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all"
            style={{ color }}
          >
            Voir <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}
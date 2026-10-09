import { Link } from "react-router";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative flex h-screen flex-col items-center justify-start overflow-hidden pt-20">
      {/* ── VIDEO BACKGROUND ─────────────────────────────────────────── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 size-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/short.mp4" type="video/mp4" />
      </video>

      {/* ── OVERLAYS ─────────────────────────────────────────────────── */}
      {/* Deep dark gradient overlay for readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(13,0,37,0.92) 0%, rgba(26,0,80,0.88) 40%, rgba(66,8,161,0.82) 75%, rgba(152,0,191,0.72) 100%)",
          zIndex: 1,
        }}
      />
      {/* Bottom fade for section transition */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(13,0,37,0.6))",
          zIndex: 2,
        }}
      />

      {/* ── DECORATIVE ELEMENTS ──────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {/* Gold accent line — top left */}
        <motion.div
          className="absolute left-0 top-32 h-px w-32 md:w-64"
          style={{ background: "linear-gradient(90deg, #FFC000, transparent)" }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        />
        {/* Floating hex — top right */}
        <motion.div
          className="absolute right-12 top-24 opacity-25 md:right-24"
          animate={{ y: [0, -14, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
            <polygon
              points="45,5 80,25 80,65 45,85 10,65 10,25"
              stroke="#FFC000"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
        </motion.div>
        {/* Floating hex — bottom left */}
        <motion.div
          className="absolute bottom-32 left-12 opacity-15"
          animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <svg width="55" height="55" viewBox="0 0 90 90" fill="none">
            <polygon
              points="45,5 80,25 80,65 45,85 10,65 10,25"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </motion.div>
        {/* Vertical gold line — right edge */}
        <motion.div
          className="absolute right-0 top-1/4 hidden h-40 w-px lg:block"
          style={{
            background:
              "linear-gradient(to bottom, transparent, #FFC000, transparent)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div
        className="relative flex w-full flex-1 flex-col items-center justify-center px-4 text-center"
        style={{ zIndex: 3 }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-3"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#FFC000]">
            Solutions IT &amp; Digitales
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-3 w-full text-4xl font-extrabold leading-[1.05] tracking-wider text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          style={{ textShadow: "0 4px 40px rgba(0,0,0,0.4)", letterSpacing: "0.02em" }}
        >
          <span className="text-white">
            Nous transformons
            <br />
            l&apos;IT en levier
          </span>
          <div className="mx-auto my-3 h-px w-32 bg-[#FFC000]" />
          <span
            style={{
              background:
                "linear-gradient(90deg, #FFC000 0%, #ffe566 60%, #FFC000 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% auto",
            }}
          >
            de croissance.
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mb-2 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base"
        >
          Audit · Conseil · Ingénierie · Sécurité · Télécommunications ·
          Formation.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-lg bg-[#FFC000] px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-xl transition-all hover:-translate-y-0.5 hover:bg-[#ffcc33] hover:shadow-2xl md:px-7 md:py-3"
          >
            Discuter de votre projet
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            to="/trainings"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-transparent px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10 md:px-7 md:py-3"
          >
            Voir les formations
          </Link>
        </motion.div>
      </div>

      {/* ── SCROLL INDICATOR ─────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1"
        style={{ zIndex: 3 }}
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] uppercase tracking-widest text-white/30">
          Défiler
        </span>
        <ChevronDown size={18} className="text-white/30" />
      </motion.div>
    </section>
  );
}

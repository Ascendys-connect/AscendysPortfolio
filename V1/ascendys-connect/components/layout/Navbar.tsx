"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  { label: "Services", href: "/services" },
  { label: "Formations", href: "/formations" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // On homepage, navbar starts transparent; elsewhere always has white bg
  const navBg = isHome
    ? scrolled
      ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
      : "bg-transparent"
    : "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100";

  const logoColor = isHome && !scrolled ? "text-white" : "text-[#1A1A1A]";
  const linkColor = isHome && !scrolled ? "text-white/90 hover:text-white" : "text-[#1A1A1A]/80 hover:text-[#1A1A1A]";
  const activeLinkColor = isHome && !scrolled ? "text-white font-semibold" : "text-[#9800BF] font-semibold";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="container-xl">
        <nav className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/ascendys_logo-removebg-preview.png"
              alt="ASCENDYS CONNECT"
              width={480}
              height={156}
              className={`h-[120px] w-auto transition-all duration-300 ${
                isHome && !scrolled
                  ? "brightness-0 invert"
                  : "brightness-100"
              }`}
              priority
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive ? activeLinkColor : linkColor
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/formations"
              className="btn-gold text-sm px-5 py-2.5"
              style={{ padding: "10px 20px", fontSize: "0.875rem" }}
            >
              Nos formations
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-md transition-colors ${
              isHome && !scrolled
                ? "text-white hover:bg-white/10"
                : "text-[#1A1A1A] hover:bg-gray-100"
            }`}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="container-xl py-4">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-purple-50 text-[#9800BF] font-semibold"
                          : "text-[#1A1A1A]/80 hover:bg-gray-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="mt-2 pt-2 border-t border-gray-100">
                <Link href="/formations" className="btn-gold block text-center text-sm" style={{ padding: "12px 20px" }}>
                  Voir nos formations
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}



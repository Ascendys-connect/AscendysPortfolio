import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import AnnouncementTicker from "./AnnouncementTicker";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Formations", href: "/trainings" },
  { label: "Blog", href: "/blog" },
  { label: "Galerie", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

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

  const linkColor =
    isHome && !scrolled
      ? "text-white/90 hover:text-white"
      : "text-[#1A1A1A]/80 hover:text-[#1A1A1A]";
  const activeLinkColor =
    isHome && !scrolled
      ? "text-white font-semibold"
      : "text-[#9800BF] font-semibold";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 transition-all duration-300">
      <div className={`transition-all duration-300 ${navBg}`}>
        <div className="container-xl px-4 md:px-8">
          <nav className="flex h-16 items-center justify-between md:h-18">
            {/* Logo */}
            <Link to="/" className="flex flex-shrink-0 items-center">
              <img
                src="/ascendys_logo-removebg-preview.png"
                alt="ASCENDYS CONNECT"
                className={`h-[28px] w-auto transition-all duration-300 ${isHome && !scrolled ? "brightness-0 invert" : "brightness-100"
                  }`}
              />
            </Link>

            {/* Desktop links */}
            <ul className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className={`rounded-md px-4 py-2 text-base font-medium transition-colors duration-200 ${isActive ? activeLinkColor : linkColor
                        }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* CTA Desktop */}
            <div className="hidden items-center gap-3 md:flex mr-4">
              <Link
                to="/trainings"
                className="rounded-lg bg-[#FFC000] px-5 py-2.5 text-sm font-semibold text-gray-900 transition-all hover:bg-[#ffcc33] hover:shadow-lg"
              >
                Nos formations
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(!open)}
              className={`rounded-md p-2 transition-colors md:hidden ${isHome && !scrolled
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
          <div className="border-t border-gray-100 bg-white shadow-xl md:hidden">
            <div className="container-xl py-4">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${isActive
                          ? "bg-purple-50 text-[#9800BF] font-semibold"
                          : "text-[#1A1A1A]/80 hover:bg-gray-50"
                          }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
                <li className="mt-2 border-t border-gray-100 pt-2">
                  <Link
                    to="/trainings"
                    className="block rounded-lg bg-[#FFC000] px-5 py-3 text-center text-sm font-semibold text-gray-900 transition-all hover:bg-[#ffcc33]"
                  >
                    Voir nos formations
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Barre À la une (AnnouncementTicker) : apparaît au même moment que la navbar devient opaque au scroll */}
      {isHome && (
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden shadow-lg ${scrolled
            ? "max-h-16 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
            }`}
        >
          <AnnouncementTicker />
        </div>
      )}
    </header>
  );
}

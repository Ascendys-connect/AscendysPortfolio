import { useState, useEffect } from "react";
import { Link } from "react-router";

export default function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Formations", href: "/trainings" },
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-md backdrop-blur-sm dark:bg-gray-900/95"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/ascendys_logo-removebg-preview.png"
              alt="Ascendys Connect"
              className="h-12 w-auto"
            />
            <span
              className={`text-xl font-bold transition-colors ${
                isScrolled
                  ? "text-gray-900 dark:text-white"
                  : "text-white drop-shadow-lg"
              }`}
            >
              Ascendys Connect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-brand-500 ${
                  isScrolled
                    ? "text-gray-700 dark:text-gray-300"
                    : "text-white drop-shadow-md"
                }`}
              >
                {link.name}
              </a>
            ))}
            <Link
              to="/trainings"
              className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-600 hover:shadow-lg"
            >
              Nos formations
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden ${
              isScrolled
                ? "text-gray-900 dark:text-white"
                : "text-white drop-shadow-lg"
            }`}
          >
            <svg
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-900 md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-500 dark:text-gray-300"
                >
                  {link.name}
                </a>
              ))}
              <Link
                to="/trainings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg bg-brand-500 px-6 py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-brand-600"
              >
                Nos formations
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

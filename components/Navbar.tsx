"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Galerie" },
  { href: "/about", label: "À propos" },
  { href: "/commissions", label: "Tarifs & Devis" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#080808]/90 backdrop-blur-md border-b border-[#c9a84c]/10" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-3xl font-light tracking-[0.1em] text-[#c9a84c] hover:text-[#e2c97e] transition-colors">
          Art of <span className="text-[#e8e0d0]">LoryAline</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-10">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-base tracking-widest uppercase transition-all duration-300 relative group ${
                  pathname === href ? "text-[#c9a84c]" : "text-[#8a8070] hover:text-[#e8e0d0]"
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-[#c9a84c] transition-all duration-300 ${
                    pathname === href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className={`block w-6 h-px bg-[#c9a84c] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-px bg-[#c9a84c] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-px bg-[#c9a84c] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-64 border-b border-[#c9a84c]/10" : "max-h-0"
        } bg-[#080808]/95 backdrop-blur-md`}
      >
        <ul className="flex flex-col px-6 py-4 gap-4">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`text-base tracking-widest uppercase ${
                  pathname === href ? "text-[#c9a84c]" : "text-[#8a8070]"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

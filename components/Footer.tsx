import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#c9a84c]/10 mt-32">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="font-serif text-xl font-light tracking-[0.1em] text-[#c9a84c]">
          Art of <span className="text-[#e8e0d0]">LoryAline</span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs tracking-widest uppercase">
          <Link href="/" className="text-[#8a8070] hover:text-[#c9a84c] transition-colors">Galerie</Link>
          <Link href="/about" className="text-[#8a8070] hover:text-[#c9a84c] transition-colors">À propos</Link>
          <Link href="/commissions" className="text-[#8a8070] hover:text-[#c9a84c] transition-colors">Tarifs & Devis</Link>
          <a href="https://www.instagram.com/artofloryaline/" target="_blank" rel="noopener noreferrer" className="text-[#8a8070] hover:text-[#c9a84c] transition-colors">Instagram</a>
          <Link href="/mentions-legales" className="text-[#8a8070] hover:text-[#c9a84c] transition-colors">Mentions légales</Link>
          <Link href="/cgv" className="text-[#8a8070] hover:text-[#c9a84c] transition-colors">CGV</Link>
          <Link href="/confidentialite" className="text-[#8a8070] hover:text-[#c9a84c] transition-colors">Confidentialité</Link>
        </nav>
      </div>
      <div className="border-t border-[#c9a84c]/5">
        <p className="max-w-7xl mx-auto px-6 py-5 text-center text-[10px] tracking-widest uppercase text-[#5a5040]">
          © {new Date().getFullYear()} Art of LoryAline — Chênerève Editions · Tous droits réservés · Création 100% humaine, sans IA générative
        </p>
      </div>
    </footer>
  );
}

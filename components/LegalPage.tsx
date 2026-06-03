import Link from "next/link";

export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      <article className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-xs tracking-[0.15em] uppercase text-[#8a8070] hover:text-[#c9a84c] transition-colors"
        >
          ← Retour à l&apos;accueil
        </Link>

        <h1 className="font-serif text-5xl md:text-6xl font-light text-[#e8e0d0] mt-8 mb-2 leading-tight">
          {title}
        </h1>
        {updated && (
          <p className="text-xs text-[#5a5040] italic mb-12">Dernière mise à jour : {updated}</p>
        )}

        <div className="legal-content text-[#c2b8a4] leading-relaxed">{children}</div>
      </article>
    </main>
  );
}

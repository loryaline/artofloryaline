"use client";

import Image from "next/image";

export interface Client {
  src: string;
  name: string;
}

function LogoRow({ clients }: { clients: Client[] }) {
  return (
    <>
      {clients.map((c) => (
        <div
          key={c.name}
          className="shrink-0 mx-8 sm:mx-12 flex items-center justify-center h-20 w-40"
          title={c.name}
        >
          <Image
            src={c.src}
            alt={c.name}
            width={160}
            height={80}
            className="max-h-16 w-auto object-contain opacity-45 [filter:brightness(0)_invert(1)] hover:opacity-90 transition-opacity duration-500"
            unoptimized
          />
        </div>
      ))}
    </>
  );
}

export default function ClientCarousel({ clients }: { clients: Client[] }) {
  if (!clients.length) return null;
  return (
    <div className="relative overflow-hidden py-4">
      {/* Fondus latéraux */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#080808] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#080808] to-transparent pointer-events-none" />

      {/* Piste défilante (dupliquée pour boucle continue) */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        <LogoRow clients={clients} />
        <LogoRow clients={clients} />
      </div>
    </div>
  );
}

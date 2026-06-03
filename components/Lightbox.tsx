"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { isVideo } from "@/lib/pricing";

interface Artwork {
  src: string;
  title: string;
  category: string;
  year?: string;
}

interface LightboxProps {
  artwork: Artwork;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({ artwork, onClose, onPrev, onNext }: LightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-[#8a8070] hover:text-[#c9a84c] transition-colors z-10"
      >
        <X size={28} />
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 md:left-8 text-[#8a8070] hover:text-[#c9a84c] transition-colors z-10 bg-[#0f0f0f]/60 rounded-full p-2"
      >
        <ChevronLeft size={32} />
      </button>

      {/* Image */}
      <div
        className="relative max-h-[85vh] max-w-[85vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo(artwork.src) ? (
          <video
            src={artwork.src}
            controls
            autoPlay
            loop
            playsInline
            className="max-h-[80vh] max-w-[80vw] w-auto h-auto object-contain"
            style={{ boxShadow: "0 0 80px rgba(201,168,76,0.08)" }}
          />
        ) : (
          <Image
            src={artwork.src}
            alt={artwork.title}
            width={900}
            height={1200}
            className="max-h-[80vh] max-w-[80vw] w-auto h-auto object-contain"
            style={{ boxShadow: "0 0 80px rgba(201,168,76,0.08)" }}
          />
        )}
        <div className="mt-4 text-center">
          <p className="font-serif text-xl text-[#e8e0d0]">{artwork.title}</p>
          <p className="text-xs tracking-widest uppercase text-[#c9a84c] mt-1">
            {artwork.category}{artwork.year ? ` · ${artwork.year}` : ""}
          </p>
        </div>
      </div>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 md:right-8 text-[#8a8070] hover:text-[#c9a84c] transition-colors z-10 bg-[#0f0f0f]/60 rounded-full p-2"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
}

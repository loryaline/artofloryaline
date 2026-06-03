import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Art of LoryAline — Illustrations Fantasy & Portraits",
  description: "Art of LoryAline — Portraits semi-réalistes claroscuro. Fantasy · Médiéval · Aventure.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-[#080808] text-[#e8e0d0]">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

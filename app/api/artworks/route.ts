import { NextRequest, NextResponse } from "next/server";
import { readArtworks, writeArtworks } from "@/lib/storage";

type Artwork = { id: number; [k: string]: unknown };

export async function GET() {
  return NextResponse.json(await readArtworks());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const artworks = (await readArtworks()) as Artwork[];
  const newArtwork = {
    id: Date.now(),
    src: body.src,
    title: body.title || "Sans titre",
    category: body.category || "Autres",
    year: body.year || new Date().getFullYear().toString(),
    tall: body.tall ?? false,
    usage: body.usage || "both",
    exampleFor: body.exampleFor || "",
  };
  artworks.unshift(newArtwork);
  await writeArtworks(artworks);
  return NextResponse.json(newArtwork);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const artworks = (await readArtworks()) as Artwork[];
  const idx = artworks.findIndex((a) => a.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  artworks[idx] = { ...artworks[idx], ...body };
  await writeArtworks(artworks);
  return NextResponse.json(artworks[idx]);
}

// Réordonne la galerie selon un tableau d'ids
export async function PATCH(req: NextRequest) {
  const { order } = await req.json();
  if (!Array.isArray(order)) return NextResponse.json({ error: "order requis" }, { status: 400 });
  const artworks = (await readArtworks()) as Artwork[];
  const byId = new Map(artworks.map((a) => [a.id, a]));
  const reordered = order.map((id: number) => byId.get(id)).filter(Boolean);
  for (const a of artworks) if (!order.includes(a.id)) reordered.push(a);
  await writeArtworks(reordered);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const artworks = (await readArtworks()) as Artwork[];
  await writeArtworks(artworks.filter((a) => a.id !== id));
  return NextResponse.json({ ok: true });
}

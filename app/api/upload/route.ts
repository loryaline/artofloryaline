import { NextRequest, NextResponse } from "next/server";
import { saveImage } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!["jpg", "jpeg", "png", "webp", "gif", "mp4", "webm", "mov"].includes(ext ?? "")) {
    return NextResponse.json({ error: "Format non supporté" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const url = await saveImage(safeName, bytes);

  return NextResponse.json({ filename: safeName, url });
}

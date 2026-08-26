import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

// Upload direct navigateur → Vercel Blob (contourne la limite 4,5 Mo des routes serveur).
// La page /admin est protégée par mot de passe ; cette route délivre un token d'upload
// (uploads uniquement, restreints aux formats image/vidéo, taille max 200 Mo).

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "image/jpeg", "image/png", "image/webp", "image/gif",
          "video/mp4", "video/webm", "video/quicktime",
        ],
        addRandomSuffix: true,
        maximumSizeInBytes: 200 * 1024 * 1024, // 200 Mo
      }),
      onUploadCompleted: async () => {
        // Rien à faire : les métadonnées sont enregistrées côté admin via /api/artworks.
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from "next/server";

// Trellis — powerful image-to-3D model (generates .glb + .ply)
const MODEL_VERSION = "e8f6c45206993f297372f5436b90350817bd9b4a0d52d2a76df50c1c8afa2b3c";

export async function POST(req: NextRequest) {
  const apiToken = process.env.REPLICATE_API_TOKEN;

  try {
    const body = await req.json();
    const { images } = body;

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "Nenhuma imagem enviada" }, { status: 400 });
    }

    if (!apiToken) {
      return NextResponse.json({
        status: "demo",
        error: "REPLICATE_API_TOKEN não configurado.",
      });
    }

    // Start Replicate prediction with Trellis model
    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          images: images.slice(0, 4), // Trellis accepts up to 4 images
          generate_model: true,
          generate_color: true,
          mesh_simplify: 0.95,
          texture_size: 1024,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: `Replicate: ${err}` },
        { status: res.status }
      );
    }

    const prediction = await res.json();
    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  const predictionId = req.nextUrl.searchParams.get("id");

  if (!apiToken || !predictionId) {
    return NextResponse.json({ error: "Missing token or id" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: { Authorization: `Bearer ${apiToken}` },
    });

    const prediction = await res.json();
    return NextResponse.json({
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

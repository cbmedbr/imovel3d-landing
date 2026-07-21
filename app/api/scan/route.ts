import { NextRequest, NextResponse } from "next/server";

// Replicate model for Gaussian Splatting from images
// Using a splat generation model
const REPLICATE_MODEL_VERSION = "a]"; // Will be set when we find the right model

export async function POST(req: NextRequest) {
  const apiToken = process.env.REPLICATE_API_TOKEN;

  try {
    const body = await req.json();
    const { images, totalImages } = body;

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "Nenhuma imagem enviada" }, { status: 400 });
    }

    // If no API token, return demo mode with a sample splat
    if (!apiToken) {
      return NextResponse.json({
        status: "demo",
        message: "Modo demo — REPLICATE_API_TOKEN não configurado. Usando scan de exemplo.",
        // Demo: using a GLB model since splats need GPU
        splatUrl: "demo-glb",
        glbUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb",
      });
    }

    // Start Replicate prediction
    // For now, using TripoSR (single image to 3D) as a starting point
    // In production, use a proper multi-image gaussian splatting model
    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "625ce945c5eb59e5637ccdb52702c8d8ddb264f0fac6e38185ebc21bde004c57",
        input: {
          image: images[0],
          output_format: "glb",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Replicate: ${err}` }, { status: res.status });
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

import { NextRequest, NextResponse } from "next/server";

// TripoSR model on Replicate — converts single image to 3D mesh (.glb)
const REPLICATE_MODEL = "camenduru/triposr:625ce945c5eb59e5637ccdb52702c8d8ddb264f0fac6e38185ebc21bde004c57";

export async function POST(req: NextRequest) {
  const apiToken = process.env.REPLICATE_API_TOKEN;

  if (!apiToken) {
    return NextResponse.json(
      { error: "REPLICATE_API_TOKEN não configurado. Adicione no .env.local" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl é obrigatório" },
        { status: 400 }
      );
    }

    // Start prediction
    const startRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: REPLICATE_MODEL.split(":")[1],
        input: {
          image: imageUrl,
          output_format: "glb",
          mc_resolution: 256,
          render_size: 512,
        },
      }),
    });

    if (!startRes.ok) {
      const err = await startRes.text();
      return NextResponse.json(
        { error: `Replicate error: ${err}` },
        { status: startRes.status }
      );
    }

    const prediction = await startRes.json();

    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
      urls: prediction.urls,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro interno" },
      { status: 500 }
    );
  }
}

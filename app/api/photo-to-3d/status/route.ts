import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  const predictionId = req.nextUrl.searchParams.get("id");

  if (!apiToken) {
    return NextResponse.json({ error: "API token não configurado" }, { status: 500 });
  }

  if (!predictionId) {
    return NextResponse.json({ error: "id é obrigatório" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: { Authorization: `Bearer ${apiToken}` },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Falha ao buscar status" }, { status: res.status });
    }

    const prediction = await res.json();

    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

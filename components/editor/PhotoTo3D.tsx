"use client";

import { useState, useRef } from "react";
import { FurnitureItem } from "./types";

interface PhotoTo3DProps {
  onModelReady: (item: FurnitureItem) => void;
}

type Status = "idle" | "uploading" | "processing" | "done" | "error";

export default function PhotoTo3D({ onModelReady }: PhotoTo3DProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConvert = async () => {
    if (!preview) return;

    setStatus("uploading");
    setError(null);
    setProgress("Enviando foto...");

    try {
      // Start conversion
      const res = await fetch("/api/photo-to-3d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: preview }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falha ao iniciar conversão");
      }

      setStatus("processing");
      setProgress("Convertendo foto em 3D... (pode levar 30-60s)");

      // Poll for result
      const predictionId = data.id;
      let attempts = 0;
      const maxAttempts = 60;

      while (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 3000));
        attempts++;

        const statusRes = await fetch(`/api/photo-to-3d/status?id=${predictionId}`);
        const statusData = await statusRes.json();

        if (statusData.status === "succeeded") {
          setStatus("done");
          setProgress("Modelo 3D pronto!");

          // Get the GLB URL from output
          const glbUrl = Array.isArray(statusData.output)
            ? statusData.output.find((u: string) => u.endsWith(".glb")) || statusData.output[0]
            : statusData.output;

          if (glbUrl) {
            const newItem: FurnitureItem = {
              id: `photo3d_${Date.now()}`,
              name: "Modelo da Foto",
              category: "Foto→3D",
              parts: [{ shape: "box", size: [0.5, 0.5, 0.5], position: [0, 0, 0], color: "#888" }],
              boundingSize: [1, 1, 1],
              defaultY: 0.5,
              glbUrl: glbUrl,
              glbScale: 1,
              glbOffsetY: 0,
            };
            onModelReady(newItem);
          }
          return;
        }

        if (statusData.status === "failed") {
          throw new Error(statusData.error || "Conversão falhou");
        }

        setProgress(`Processando... (${attempts * 3}s)`);
      }

      throw new Error("Timeout — conversão demorou demais");
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
    }
  };

  const reset = () => {
    setStatus("idle");
    setPreview(null);
    setError(null);
    setProgress("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Foto → Modelo 3D</h3>
      <p className="text-xs text-slate-400">
        Tire uma foto de um móvel e converta em modelo 3D para usar na cena.
      </p>

      {status === "idle" && (
        <>
          {preview ? (
            <div className="space-y-2">
              <img
                src={preview}
                alt="Preview"
                className="w-full rounded-lg border border-slate-600"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleConvert}
                  className="flex-1 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm font-medium transition-colors"
                >
                  Converter em 3D
                </button>
                <button
                  onClick={reset}
                  className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <label className="block cursor-pointer">
              <div className="w-full py-6 rounded-lg border-2 border-dashed border-slate-600 hover:border-blue-500 transition-colors flex flex-col items-center gap-2">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-slate-400">Clique para selecionar foto</span>
                <span className="text-xs text-slate-600">JPG, PNG — máx 10MB</span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </>
      )}

      {(status === "uploading" || status === "processing") && (
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-blue-400">{progress}</p>
        </div>
      )}

      {status === "done" && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
          <p className="text-sm text-green-400 mb-2">Modelo adicionado à cena!</p>
          <button
            onClick={reset}
            className="px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm transition-colors"
          >
            Converter outra foto
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-sm text-red-400 mb-2">{error}</p>
          <button
            onClick={reset}
            className="px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <p className="text-xs text-slate-600">
        Requer chave REPLICATE_API_TOKEN no .env.local
      </p>
    </div>
  );
}

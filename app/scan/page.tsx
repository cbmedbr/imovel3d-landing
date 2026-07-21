"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Status = "upload" | "processing" | "done" | "error";

export default function ScanPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("upload");
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | File[]) => {
    const imageFiles = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...imageFiles]);

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length < 3) {
      setError("Envie pelo menos 3 fotos do imóvel.");
      return;
    }

    setStatus("processing");
    setError("");
    setProgress("Enviando fotos...");

    try {
      // Resize image to max 1024px and convert to base64
      const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxSize = 1024;
            let w = img.width, h = img.height;
            if (w > h) { if (w > maxSize) { h = h * maxSize / w; w = maxSize; } }
            else { if (h > maxSize) { w = w * maxSize / h; h = maxSize; } }
            canvas.width = w;
            canvas.height = h;
            canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL("image/jpeg", 0.8));
          };
          img.src = URL.createObjectURL(file);
        });
      };

      setProgress("Preparando fotos...");
      // Resize up to 4 images
      const imagesToSend = files.slice(0, 4);
      const resizedImages = await Promise.all(imagesToSend.map(resizeImage));

      setProgress("Enviando para processamento 3D...");

      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: resizedImages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao processar");
      }

      if (data.status === "demo") {
        setStatus("error");
        setError(
          "O processamento 3D requer a API key do Replicate (REPLICATE_API_TOKEN). " +
          "Crie uma conta gratuita em replicate.com e adicione o token no .env.local para ativar o processamento real das fotos."
        );
        return;
      }

      // Poll for result
      const predictionId = data.id;
      let attempts = 0;

      while (attempts < 60) {
        await new Promise((r) => setTimeout(r, 3000));
        attempts++;

        const statusRes = await fetch(`/api/scan?id=${predictionId}`);
        const statusData = await statusRes.json();

        if (statusData.status === "succeeded") {
          let outputUrl = "";
          const out = statusData.output;
          if (typeof out === "string") {
            outputUrl = out;
          } else if (out?.model_file) {
            outputUrl = out.model_file;
          } else if (out?.gaussian_ply) {
            outputUrl = out.gaussian_ply;
          } else if (Array.isArray(out)) {
            outputUrl = out.find((u: string) => u.endsWith(".glb")) || out[0];
          }
          setResultUrl(outputUrl);
          setStatus("done");
          setProgress("");
          return;
        }

        if (statusData.status === "failed") {
          throw new Error(statusData.error || "Processamento falhou");
        }

        const elapsed = attempts * 3;
        setProgress(`Processando scan 3D... (${elapsed}s)`);
      }

      throw new Error("Timeout — processamento demorou demais");
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
    }
  };

  const handleEdit = () => {
    if (resultUrl) {
      // Save splat URL to localStorage for the editor to pick up
      localStorage.setItem("imovel3d_pending_splat", resultUrl);
      router.push("/editor");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <nav className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Imóvel 3D
          </a>
          <a href="/editor" className="text-sm text-slate-400 hover:text-white transition-colors">
            Editor
          </a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Scan 3D do Imóvel</h1>
        <p className="text-slate-400 mb-8">
          Envie fotos do imóvel e nosso sistema gera um modelo 3D navegável.
        </p>

        {/* Upload */}
        {status === "upload" && (
          <div className="space-y-6">
            {/* Drop zone */}
            <div
              className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-8 text-center transition-colors cursor-pointer"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("border-cyan-400", "bg-cyan-500/5");
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove("border-cyan-400", "bg-cyan-500/5");
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("border-cyan-400", "bg-cyan-500/5");
                handleFiles(e.dataTransfer.files);
              }}
            >
              <svg className="w-12 h-12 text-slate-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-lg text-slate-300 mb-1">Arraste as fotos do imóvel aqui</p>
              <p className="text-sm text-slate-500">ou clique para selecionar</p>
              <p className="text-xs text-slate-600 mt-2">Mínimo 3 fotos. Quanto mais fotos, melhor o resultado.</p>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
              />
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-slate-400">{files.length} foto{files.length !== 1 ? "s" : ""} selecionada{files.length !== 1 ? "s" : ""}</span>
                  <button
                    onClick={() => { setFiles([]); setPreviews([]); }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Limpar tudo
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden">
                      <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-sm text-red-400">{error}</p>}

            {/* Tips */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <h3 className="text-sm font-medium mb-2">Dicas para um bom scan:</h3>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Tire fotos de todos os ângulos do cômodo</li>
                <li>• Boa iluminação (sem flash)</li>
                <li>• Sobreposição de 60-70% entre fotos consecutivas</li>
                <li>• Mínimo 10 fotos para resultado bom, 30+ para excelente</li>
              </ul>
            </div>

            {/* Process button */}
            <button
              onClick={handleProcess}
              disabled={files.length < 3}
              className="w-full py-4 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-lg font-semibold transition-colors"
            >
              {files.length < 3
                ? `Adicione pelo menos ${3 - files.length} foto${3 - files.length !== 1 ? "s" : ""}`
                : `Gerar Scan 3D (${files.length} fotos)`
              }
            </button>
          </div>
        )}

        {/* Processing */}
        {status === "processing" && (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-xl text-slate-300 mb-2">{progress}</p>
            <p className="text-sm text-slate-500">Não feche esta página.</p>
          </div>
        )}

        {/* Done */}
        {status === "done" && (
          <div className="text-center py-16 space-y-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Scan 3D pronto!</h2>
            <p className="text-slate-400">Seu imóvel foi renderizado em 3D com sucesso.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={() => {
                  if (resultUrl) {
                    localStorage.setItem("imovel3d_viewer_splat", resultUrl);
                    router.push("/viewer");
                  }
                }}
                className="px-8 py-3 border border-white/20 hover:border-white/40 rounded-xl font-medium transition-colors"
              >
                Visualizar 3D (Grátis)
              </button>
              <button
                onClick={handleEdit}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors"
              >
                Editar Imóvel — R$29,90
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-4">
              A edição permite adicionar móveis, trocar materiais, paredes e compartilhar.
            </p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="text-center py-16">
            <p className="text-lg text-red-400 mb-4">{error}</p>
            <button
              onClick={() => setStatus("upload")}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

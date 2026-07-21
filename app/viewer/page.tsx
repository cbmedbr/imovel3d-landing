"use client";

import { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import GaussianSplat from "@/components/editor/GaussianSplat";

export default function ViewerPage() {
  const [splatUrl, setSplatUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get splat URL from localStorage (set by scan page)
    const url = localStorage.getItem("imovel3d_viewer_splat");
    if (url) {
      setSplatUrl(url);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!splatUrl) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">Nenhum scan para visualizar.</p>
        <a href="/scan" className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors">
          Fazer Scan
        </a>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <nav className="h-14 border-b border-white/5 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4">
        <a href="/" className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Imóvel 3D
        </a>
        <div className="flex items-center gap-3">
          <a href="/scan" className="text-sm text-slate-400 hover:text-white transition-colors">
            Novo Scan
          </a>
          <a
            href="/editor"
            onClick={() => {
              localStorage.setItem("imovel3d_pending_splat", splatUrl);
            }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
          >
            Editar — R$29,90
          </a>
        </div>
      </nav>

      {/* 3D Viewer */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [3, 3, 3], fov: 50 }}
          className="w-full h-full"
          gl={{ preserveDrawingBuffer: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 8, 5]} intensity={1} />

          <Suspense fallback={null}>
            <GaussianSplat url={splatUrl} />
          </Suspense>

          <OrbitControls makeDefault />
        </Canvas>

        {/* Controls hint */}
        <div className="absolute bottom-4 left-4 text-xs text-slate-500 space-y-1">
          <div>Arraste para rotacionar | Scroll para zoom</div>
          <div>Clique direito + arraste para mover</div>
        </div>

        {/* CTA */}
        <div className="absolute bottom-4 right-4">
          <a
            href="/editor"
            onClick={() => {
              localStorage.setItem("imovel3d_pending_splat", splatUrl);
            }}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/25"
          >
            Editar Imóvel — R$29,90
          </a>
        </div>
      </div>
    </div>
  );
}

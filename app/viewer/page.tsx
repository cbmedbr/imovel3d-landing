"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function SplatLoader({ url }: { url: string }) {
  const { scene } = useThree();
  const viewerRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let disposed = false;

    async function load() {
      try {
        const GS = await import("@mkkellogg/gaussian-splats-3d");

        if (disposed) return;

        const viewer = new GS.DropInViewer({
          gpuAcceleratedSort: true,
          sharedMemoryForWorkers: false,
        });

        await viewer.addSplatScene(url, {
          splatAlphaRemovalThreshold: 5,
        });

        if (disposed) return;

        scene.add(viewer);
        viewerRef.current = viewer;
        setLoaded(true);
      } catch (err) {
        console.error("Splat load error:", err);
        if (!disposed) setError(true);
      }
    }

    load();

    return () => {
      disposed = true;
      if (viewerRef.current) {
        scene.remove(viewerRef.current);
        try { viewerRef.current.dispose?.(); } catch {}
      }
    };
  }, [scene, url]);

  return null;
}

export default function ViewerPage() {
  const [splatUrl, setSplatUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = localStorage.getItem("imovel3d_viewer_splat");
    if (url) setSplatUrl(url);
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
      <nav className="h-14 border-b border-white/5 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0">
        <a href="/" className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Imóvel 3D
        </a>
        <div className="flex items-center gap-3">
          <a href="/scan" className="text-sm text-slate-400 hover:text-white transition-colors">
            Novo Scan
          </a>
          <a
            href="/editor"
            onClick={() => localStorage.setItem("imovel3d_pending_splat", splatUrl)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
          >
            Editar — R$29,90
          </a>
        </div>
      </nav>

      <div className="flex-1 relative">
        {/* Loading overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none" id="splat-loading">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-400">Carregando modelo 3D...</span>
          </div>
        </div>

        <Canvas
          camera={{ position: [5, 3, 5], fov: 50 }}
          className="w-full h-full"
          gl={{ preserveDrawingBuffer: true }}
          onCreated={() => {
            // Hide loading after a few seconds (splat loads async)
            setTimeout(() => {
              const el = document.getElementById("splat-loading");
              if (el) el.style.display = "none";
            }, 5000);
          }}
        >
          <ambientLight intensity={0.3} />
          <SplatLoader url={splatUrl} />
          <OrbitControls makeDefault />
        </Canvas>

        <div className="absolute bottom-4 left-4 text-xs text-slate-500 space-y-1">
          <div>Arraste para rotacionar | Scroll para zoom</div>
          <div>Clique direito + arraste para mover</div>
        </div>

        <div className="absolute bottom-4 right-4">
          <a
            href="/editor"
            onClick={() => localStorage.setItem("imovel3d_pending_splat", splatUrl)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/25"
          >
            Editar Imóvel — R$29,90
          </a>
        </div>
      </div>
    </div>
  );
}

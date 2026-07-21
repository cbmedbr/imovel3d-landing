"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

function GlbViewer({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    // Center and scale model
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 3 / maxDim;

    scene.scale.setScalar(scale);
    scene.position.set(-center.x * scale, -center.y * scale + 0.5, -center.z * scale);
  }, [scene]);

  // Slow rotation
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2;
  });

  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  );
}

function SplatViewer({ url }: { url: string }) {
  const { scene } = useThree();
  const viewerRef = useRef<any>(null);

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

        await viewer.addSplatScene(url, { splatAlphaRemovalThreshold: 5 });
        if (disposed) return;

        scene.add(viewer);
        viewerRef.current = viewer;
      } catch (err) {
        console.error("Splat error:", err);
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

function Scene({ url }: { url: string }) {
  const isGlb = url.endsWith(".glb") || url.endsWith(".gltf");

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-3, 4, -3]} intensity={0.4} />

      {isGlb ? (
        <Suspense fallback={null}>
          <GlbViewer url={url} />
          {/* Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#1a1a2e" roughness={1} />
          </mesh>
        </Suspense>
      ) : (
        <SplatViewer url={url} />
      )}

      <OrbitControls makeDefault autoRotate={!isGlb} autoRotateSpeed={0.5} />
    </>
  );
}

export default function ViewerPage() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = localStorage.getItem("imovel3d_viewer_splat");
    if (url) setModelUrl(url);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!modelUrl) {
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
            onClick={() => localStorage.setItem("imovel3d_pending_splat", modelUrl)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
          >
            Editar — R$29,90
          </a>
        </div>
      </nav>

      <div className="flex-1 relative">
        <Canvas
          shadows
          camera={{ position: [4, 3, 4], fov: 50 }}
          className="w-full h-full"
          gl={{ preserveDrawingBuffer: true }}
        >
          <Scene url={modelUrl} />
        </Canvas>

        <div className="absolute bottom-4 left-4 text-xs text-slate-500 space-y-1">
          <div>Arraste para rotacionar | Scroll para zoom</div>
        </div>

        <div className="absolute bottom-4 right-4">
          <a
            href="/editor"
            onClick={() => localStorage.setItem("imovel3d_pending_splat", modelUrl)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/25"
          >
            Editar Imóvel — R$29,90
          </a>
        </div>

        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-800/80 backdrop-blur rounded-lg text-sm text-slate-300">
          Visualização 3D do seu imóvel
        </div>
      </div>
    </div>
  );
}

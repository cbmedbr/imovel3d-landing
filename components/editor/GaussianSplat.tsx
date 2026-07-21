"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

interface GaussianSplatProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number, number];
  scale?: [number, number, number];
}

export default function GaussianSplat({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0, 1],
  scale = [1, 1, 1],
}: GaussianSplatProps) {
  const { scene } = useThree();
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    let disposed = false;

    async function loadSplat() {
      try {
        const GaussianSplats3D = await import("@mkkellogg/gaussian-splats-3d");

        if (disposed) return;

        const viewer = new GaussianSplats3D.DropInViewer({
          gpuAcceleratedSort: true,
          sharedMemoryForWorkers: false,
        });

        viewer.addSplatScene(url, {
          splatAlphaRemovalThreshold: 5,
          position: position,
          rotation: rotation,
          scale: scale,
        });

        scene.add(viewer);
        viewerRef.current = viewer;
      } catch (err) {
        console.error("Failed to load Gaussian Splat:", err);
      }
    }

    loadSplat();

    return () => {
      disposed = true;
      if (viewerRef.current) {
        scene.remove(viewerRef.current);
        try {
          viewerRef.current.dispose?.();
        } catch {}
      }
    };
  }, [scene, url, position, rotation, scale]);

  return null;
}

"use client";

import { useEffect, useRef, useState } from "react";

export default function Demo3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    setLoaded(true);

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#0c1222");
      grad.addColorStop(1, "#0a0f1a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      const perspective = 300;
      const roomSize = 120;
      angle += 0.003;

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const vertices = [
        [-roomSize, -roomSize, -roomSize],
        [roomSize, -roomSize, -roomSize],
        [roomSize, roomSize, -roomSize],
        [-roomSize, roomSize, -roomSize],
        [-roomSize, -roomSize, roomSize],
        [roomSize, -roomSize, roomSize],
        [roomSize, roomSize, roomSize],
        [-roomSize, roomSize, roomSize],
      ];

      const sofaVerts = [
        [-60, 20, -40], [60, 20, -40], [60, 50, -40], [-60, 50, -40],
        [-60, 20, -80], [60, 20, -80], [60, 70, -80], [-60, 70, -80],
      ];

      const tableVerts = [
        [-40, 40, 10], [40, 40, 10], [40, 42, 10], [-40, 42, 10],
        [-40, 40, 50], [40, 40, 50], [40, 42, 50], [-40, 42, 50],
      ];

      const project = (x: number, y: number, z: number) => {
        const rx = x * cosA - z * sinA;
        const rz = x * sinA + z * cosA;
        const scale = perspective / (perspective + rz + 200);
        return { x: cx + rx * scale, y: cy + y * scale, scale };
      };

      const drawEdges = (verts: number[][], edges: number[][], color: string, lineWidth: number) => {
        const projected = verts.map((v) => project(v[0], v[1], v[2]));
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        edges.forEach(([a, b]) => {
          ctx.moveTo(projected[a].x, projected[a].y);
          ctx.lineTo(projected[b].x, projected[b].y);
        });
        ctx.stroke();
      };

      const boxEdges: number[][] = [
        [0,1],[1,2],[2,3],[3,0],
        [4,5],[5,6],[6,7],[7,4],
        [0,4],[1,5],[2,6],[3,7],
      ];

      drawEdges(vertices, boxEdges, "rgba(59, 130, 246, 0.3)", 1.5);
      drawEdges(sofaVerts, boxEdges, "rgba(6, 182, 212, 0.5)", 1.2);
      drawEdges(tableVerts, boxEdges, "rgba(6, 182, 212, 0.4)", 1);

      ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
      ctx.lineWidth = 0.5;
      for (let i = -roomSize; i <= roomSize; i += 30) {
        const p1 = project(i, roomSize, -roomSize);
        const p2 = project(i, roomSize, roomSize);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const p3 = project(-roomSize, roomSize, i);
        const p4 = project(roomSize, roomSize, i);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }

      for (let i = 0; i < 20; i++) {
        const px = Math.sin(angle * 2 + i * 1.3) * 150;
        const py = Math.cos(angle * 1.5 + i * 0.9) * 80;
        const pz = Math.sin(angle + i * 2.1) * 150;
        const p = project(px, py, pz);
        const alpha = Math.max(0, Math.min(0.6, p.scale));
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 * p.scale, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener("resize", resize);

    let isDragging = false;
    let lastX = 0;

    const onDown = (e: PointerEvent) => { isDragging = true; lastX = e.clientX; };
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      angle += (e.clientX - lastX) * 0.005;
      lastX = e.clientX;
    };
    const onUp = () => { isDragging = false; };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <section id="demo" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Experimente{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ao vivo
            </span>
          </h2>
          <p className="text-slate-400">
            Arraste para rotacionar. Assim que seu cliente vai navegar pelo imóvel.
          </p>
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ touchAction: "none" }}
          />
        </div>

        <p className="text-center text-sm text-slate-600 mt-4">
          * Esta é uma cena demonstrativa. Tours reais usam modelos 3D fotorrealistas do imóvel.
        </p>
      </div>
    </section>
  );
}

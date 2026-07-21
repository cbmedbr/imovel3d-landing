"use client";

import { useState, useEffect } from "react";
import { FURNITURE_CATALOG, FurnitureItem, RoomConfig, SplatConfig, InternalWall } from "./types";
import { TEMPLATES } from "./templates";
import PhotoTo3D from "./PhotoTo3D";
import CloudProjects from "./CloudProjects";
import AuthModal from "./AuthModal";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface SidebarProps {
  onAddFurniture: (item: FurnitureItem) => void;
  wallColor: string;
  onWallColorChange: (color: string) => void;
  floorColor: string;
  onFloorColorChange: (color: string) => void;
  room: RoomConfig;
  onRoomChange: (room: RoomConfig) => void;
  splat: SplatConfig | null;
  onSplatChange: (splat: SplatConfig | null) => void;
  onLoadTemplate: (template: { objects: any[]; walls?: InternalWall[]; room: RoomConfig; wallColor: string; floorColor: string }) => void;
  onGetCurrentState: () => any;
  walls: InternalWall[];
  onAddWall: () => void;
  onDeleteWall: (id: string) => void;
  onWallsChange: (walls: InternalWall[]) => void;
  selectedWallId: string | null;
}

const wallColors = ["#e8e4df", "#f5f0eb", "#d4cfc7", "#c9d6df", "#d5c4a1", "#bfc9c3", "#e8d5d5", "#ffffff"];
const floorColors = ["#c4b8a8", "#8B7355", "#a0522d", "#6B5B4B", "#d2b48c", "#808080", "#c0c0c0", "#3c3c3c"];

type Tab = "moveis" | "materiais" | "sala";

export default function Sidebar({
  onAddFurniture,
  wallColor, onWallColorChange,
  floorColor, onFloorColorChange,
  room, onRoomChange,
  splat, onSplatChange,
  onLoadTemplate,
  walls, onAddWall, onDeleteWall, onWallsChange, selectedWallId,
  onGetCurrentState,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>("moveis");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Sala de Estar");
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const updateRoom = (key: keyof RoomConfig, value: number | boolean) => {
    onRoomChange({ ...room, [key]: value });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "moveis", label: "Móveis" },
    { id: "materiais", label: "Materiais" },
    { id: "sala", label: "Sala" },
  ];

  return (
    <div className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <a href="/" className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Imóvel 3D
        </a>
        <p className="text-xs text-slate-500 mt-1">Editor</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "moveis" && (
          <div className="p-2">
            {/* Photo to 3D */}
            <div className="p-3 mb-2">
              <PhotoTo3D onModelReady={onAddFurniture} />
            </div>

            <div className="border-t border-slate-700 my-2" />

            {Object.entries(FURNITURE_CATALOG).map(([category, items]) => (
              <div key={category} className="mb-1">
                <button
                  onClick={() =>
                    setExpandedCategory(expandedCategory === category ? null : category)
                  }
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <span className="text-sm font-medium">{category}</span>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      expandedCategory === category ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedCategory === category && (
                  <div className="grid grid-cols-2 gap-1 p-1">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onAddFurniture(item)}
                        className="flex flex-col items-center p-3 rounded-lg bg-slate-700/50 hover:bg-slate-600 transition-colors border border-transparent hover:border-blue-500/30"
                      >
                        <div
                          className="w-10 h-10 rounded-md mb-2 flex items-center justify-center text-lg"
                          style={{ backgroundColor: item.parts[0]?.color ?? "#666" }}
                        >
                          {item.glbUrl ? "3D" : ""}
                        </div>
                        <span className="text-xs text-center text-slate-300 leading-tight">
                          {item.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "materiais" && (
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Cor das Paredes</h3>
              <div className="grid grid-cols-4 gap-2">
                {wallColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onWallColorChange(color)}
                    className={`w-full aspect-square rounded-lg border-2 transition-all ${
                      wallColor === color
                        ? "border-blue-400 scale-110"
                        : "border-transparent hover:border-slate-500"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={wallColor}
                onChange={(e) => onWallColorChange(e.target.value)}
                className="mt-2 w-full h-8 rounded cursor-pointer"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Cor do Piso</h3>
              <div className="grid grid-cols-4 gap-2">
                {floorColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onFloorColorChange(color)}
                    className={`w-full aspect-square rounded-lg border-2 transition-all ${
                      floorColor === color
                        ? "border-blue-400 scale-110"
                        : "border-transparent hover:border-slate-500"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={floorColor}
                onChange={(e) => onFloorColorChange(e.target.value)}
                className="mt-2 w-full h-8 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === "sala" && (
          <div className="p-4 space-y-6">
            {/* Templates (shown when available) */}
            {TEMPLATES.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">Plantas Prontas</h3>
                <div className="space-y-2">
                  {TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => onLoadTemplate(tmpl.create())}
                      className="w-full p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 hover:border-blue-400/50 transition-colors text-left"
                    >
                      <div className="text-sm font-medium text-white">{tmpl.name}</div>
                      <div className="text-xs text-slate-400 mt-1">{tmpl.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Internal Walls */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Paredes Internas</h3>
                <button
                  onClick={onAddWall}
                  className="px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-xs font-medium transition-colors"
                >
                  + Parede
                </button>
              </div>
              {walls.length === 0 ? (
                <p className="text-xs text-slate-500">Nenhuma parede interna. Clique + para adicionar.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {walls.map((w, i) => (
                    <div
                      key={w.id}
                      className={`p-2 rounded-lg text-xs border transition-colors ${
                        selectedWallId === w.id
                          ? "bg-blue-500/20 border-blue-500/50"
                          : "bg-slate-700/50 border-transparent"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Parede {i + 1}</span>
                        <button
                          onClick={() => onDeleteWall(w.id)}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          Remover
                        </button>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-400">
                          <span>Comprimento</span>
                          <span>{w.length.toFixed(1)}m</span>
                        </div>
                        <input
                          type="range" min={0.5} max={15} step={0.1}
                          value={w.length}
                          onChange={(e) => {
                            const updated = walls.map((ww) =>
                              ww.id === w.id ? { ...ww, length: parseFloat(e.target.value) } : ww
                            );
                            onWallsChange(updated);
                          }}
                          className="w-full"
                        />
                        <div className="flex justify-between text-slate-400">
                          <span>Posição X</span>
                          <span>{w.position[0].toFixed(1)}m</span>
                        </div>
                        <input
                          type="range" min={-10} max={10} step={0.1}
                          value={w.position[0]}
                          onChange={(e) => {
                            const x = parseFloat(e.target.value);
                            const updated = walls.map((ww) =>
                              ww.id === w.id ? { ...ww, position: [x, ww.position[1], ww.position[2]] as [number, number, number] } : ww
                            );
                            onWallsChange(updated);
                          }}
                          className="w-full"
                        />
                        <div className="flex justify-between text-slate-400">
                          <span>Posição Z</span>
                          <span>{w.position[2].toFixed(1)}m</span>
                        </div>
                        <input
                          type="range" min={-10} max={10} step={0.1}
                          value={w.position[2]}
                          onChange={(e) => {
                            const z = parseFloat(e.target.value);
                            const updated = walls.map((ww) =>
                              ww.id === w.id ? { ...ww, position: [ww.position[0], ww.position[1], z] as [number, number, number] } : ww
                            );
                            onWallsChange(updated);
                          }}
                          className="w-full"
                        />
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => {
                              const updated = walls.map((ww) =>
                                ww.id === w.id ? { ...ww, rotationY: 0 } : ww
                              );
                              onWallsChange(updated);
                            }}
                            className={`flex-1 py-1 rounded text-xs ${
                              Math.abs(w.rotationY) < 0.1 ? "bg-blue-500 text-white" : "bg-slate-600 text-slate-300"
                            }`}
                          >
                            Horizontal
                          </button>
                          <button
                            onClick={() => {
                              const updated = walls.map((ww) =>
                                ww.id === w.id ? { ...ww, rotationY: Math.PI / 2 } : ww
                              );
                              onWallsChange(updated);
                            }}
                            className={`flex-1 py-1 rounded text-xs ${
                              Math.abs(w.rotationY - Math.PI / 2) < 0.1 ? "bg-blue-500 text-white" : "bg-slate-600 text-slate-300"
                            }`}
                          >
                            Vertical
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="text-sm font-medium mb-3">Dimensões da Sala</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 flex justify-between">
                    <span>Largura</span>
                    <span>{room.width.toFixed(1)}m</span>
                  </label>
                  <input
                    type="range"
                    min={3}
                    max={20}
                    step={0.5}
                    value={room.width}
                    onChange={(e) => updateRoom("width", parseFloat(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 flex justify-between">
                    <span>Profundidade</span>
                    <span>{room.depth.toFixed(1)}m</span>
                  </label>
                  <input
                    type="range"
                    min={3}
                    max={20}
                    step={0.5}
                    value={room.depth}
                    onChange={(e) => updateRoom("depth", parseFloat(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 flex justify-between">
                    <span>Altura (pé-direito)</span>
                    <span>{room.height.toFixed(1)}m</span>
                  </label>
                  <input
                    type="range"
                    min={2.4}
                    max={5}
                    step={0.1}
                    value={room.height}
                    onChange={(e) => updateRoom("height", parseFloat(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Walls toggle */}
            <div>
              <h3 className="text-sm font-medium mb-3">Paredes</h3>
              <div className="space-y-2">
                {([
                  ["showWallBack", "Parede Fundo"],
                  ["showWallLeft", "Parede Esquerda"],
                  ["showWallRight", "Parede Direita"],
                  ["showWallFront", "Parede Frente"],
                  ["showCeiling", "Teto"],
                ] as [keyof RoomConfig, string][]).map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-slate-300 group-hover:text-white">{label}</span>
                    <button
                      onClick={() => updateRoom(key, !room[key])}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        room[key] ? "bg-blue-500" : "bg-slate-600"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          room[key] ? "left-5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>

            {/* Area info */}
            <div className="p-3 rounded-lg bg-slate-700/50">
              <div className="text-xs text-slate-400">Área total</div>
              <div className="text-lg font-bold text-white">
                {(room.width * room.depth).toFixed(1)} m²
              </div>
            </div>

            {/* Gaussian Splat */}
            <div>
              <h3 className="text-sm font-medium mb-3">Scan 3D do Imóvel</h3>
              <p className="text-xs text-slate-400 mb-3">
                Carregue um arquivo .splat ou .ply para visualizar o imóvel real em 3D.
              </p>

              {splat ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                    <div className="text-xs text-green-400 font-medium">Scan carregado</div>
                    <div className="text-xs text-slate-400 mt-1 truncate">{splat.url}</div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 flex justify-between">
                      <span>Escala</span>
                      <span>{splat.scale[0].toFixed(1)}x</span>
                    </label>
                    <input
                      type="range"
                      min={0.1}
                      max={5}
                      step={0.1}
                      value={splat.scale[0]}
                      onChange={(e) => {
                        const s = parseFloat(e.target.value);
                        onSplatChange({ ...splat, scale: [s, s, s] });
                      }}
                      className="w-full mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 flex justify-between">
                      <span>Altura (Y)</span>
                      <span>{splat.position[1].toFixed(1)}m</span>
                    </label>
                    <input
                      type="range"
                      min={-3}
                      max={5}
                      step={0.1}
                      value={splat.position[1]}
                      onChange={(e) => {
                        const y = parseFloat(e.target.value);
                        onSplatChange({ ...splat, position: [splat.position[0], y, splat.position[2]] });
                      }}
                      className="w-full mt-1"
                    />
                  </div>

                  <button
                    onClick={() => onSplatChange(null)}
                    className="w-full py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
                  >
                    Remover Scan
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onSplatChange({
                        url: "https://huggingface.co/cakewalk/splat-data/resolve/main/nike.splat",
                        position: [0, 0, 0],
                        rotation: [0, 0, 0, 1],
                        scale: [1, 1, 1],
                      });
                    }}
                    className="w-full py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors"
                  >
                    Carregar Demo (Teste)
                  </button>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cole URL do .splat ou .ply"
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 text-sm text-white placeholder-slate-500 border border-slate-600 focus:border-blue-500 focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const url = (e.target as HTMLInputElement).value.trim();
                          if (url) {
                            onSplatChange({
                              url,
                              position: [0, 0, 0],
                              rotation: [0, 0, 0, 1],
                              scale: [1, 1, 1],
                            });
                          }
                        }
                      }}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Pressione Enter para carregar
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cloud Projects / Auth */}
      <div className="border-t border-slate-700 p-3">
        {user ? (
          <CloudProjects
            user={user}
            onLoad={onLoadTemplate}
            onGetCurrentState={onGetCurrentState}
          />
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="w-full py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors"
          >
            Entrar para salvar na nuvem
          </button>
        )}
        {user && (
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full mt-2 py-1.5 rounded-lg text-xs text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
          >
            Sair ({user.email})
          </button>
        )}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={() => {}} />}
    </div>
  );
}

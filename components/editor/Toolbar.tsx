"use client";

import { useState } from "react";
import { EditorMode } from "./types";

type SnapTarget = "floor" | "ceiling" | "wall-back" | "wall-left" | "wall-right";

interface ToolbarProps {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onClear: () => void;
  onSnap: (target: SnapTarget) => void;
  onRotate90: (direction: "left" | "right" | "up" | "down") => void;
  onScreenshot: () => void;
  onShare: () => void;
  hasSelection: boolean;
  objectCount: number;
}

export default function Toolbar({
  mode, onModeChange, onDelete, onDuplicate,
  onUndo, onRedo, onSave, onClear, onSnap, onRotate90,
  onScreenshot, onShare, hasSelection, objectCount,
}: ToolbarProps) {
  const [showSnap, setShowSnap] = useState(false);

  const tools: { mode: EditorMode; label: string; shortcut: string }[] = [
    { mode: "translate", label: "Mover", shortcut: "G" },
    { mode: "rotate", label: "Rotacionar", shortcut: "R" },
    { mode: "scale", label: "Escalar", shortcut: "S" },
  ];

  const snapOptions: { target: SnapTarget; label: string }[] = [
    { target: "floor", label: "Chão" },
    { target: "ceiling", label: "Teto" },
    { target: "wall-back", label: "Parede Fundo" },
    { target: "wall-left", label: "Parede Esquerda" },
    { target: "wall-right", label: "Parede Direita" },
  ];

  return (
    <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-1">
        {/* Transform tools */}
        {tools.map((tool) => (
          <button
            key={tool.mode}
            onClick={() => onModeChange(tool.mode)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === tool.mode
                ? "bg-blue-500 text-white"
                : "text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
            title={`${tool.label} (${tool.shortcut})`}
          >
            {tool.label}
          </button>
        ))}

        <div className="w-px h-6 bg-slate-700 mx-2" />

        {/* Snap */}
        <div className="relative">
          <button
            onClick={() => setShowSnap(!showSnap)}
            disabled={!hasSelection}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              hasSelection
                ? showSnap
                  ? "bg-cyan-500 text-white"
                  : "text-cyan-400 hover:bg-cyan-500/20"
                : "text-slate-600 cursor-not-allowed"
            }`}
            title="Colar em superfície"
          >
            Colar
          </button>

          {showSnap && hasSelection && (
            <div className="absolute top-full left-0 mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-xl z-50 py-1 min-w-[160px]">
              {snapOptions.map((opt) => (
                <button
                  key={opt.target}
                  onClick={() => {
                    onSnap(opt.target);
                    setShowSnap(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rotate 90° */}
        <button
          onClick={() => onRotate90("left")}
          disabled={!hasSelection}
          className={`px-2 py-1.5 rounded-md text-sm transition-colors ${
            hasSelection ? "text-slate-300 hover:bg-slate-700" : "text-slate-600 cursor-not-allowed"
          }`}
          title="Girar 90° esquerda (Q)"
        >
          ↶ 90°
        </button>
        <button
          onClick={() => onRotate90("right")}
          disabled={!hasSelection}
          className={`px-2 py-1.5 rounded-md text-sm transition-colors ${
            hasSelection ? "text-slate-300 hover:bg-slate-700" : "text-slate-600 cursor-not-allowed"
          }`}
          title="Girar 90° direita (E)"
        >
          ↷ 90°
        </button>
        <button
          onClick={() => onRotate90("up")}
          disabled={!hasSelection}
          className={`px-2 py-1.5 rounded-md text-sm transition-colors ${
            hasSelection ? "text-slate-300 hover:bg-slate-700" : "text-slate-600 cursor-not-allowed"
          }`}
          title="Girar 90° pra cima (W)"
        >
          ↑ 90°
        </button>
        <button
          onClick={() => onRotate90("down")}
          disabled={!hasSelection}
          className={`px-2 py-1.5 rounded-md text-sm transition-colors ${
            hasSelection ? "text-slate-300 hover:bg-slate-700" : "text-slate-600 cursor-not-allowed"
          }`}
          title="Girar 90° pra baixo (X)"
        >
          ↓ 90°
        </button>

        <div className="w-px h-6 bg-slate-700 mx-2" />

        {/* Object actions */}
        <button
          onClick={onDuplicate}
          disabled={!hasSelection}
          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
            hasSelection ? "text-slate-300 hover:bg-slate-700" : "text-slate-600 cursor-not-allowed"
          }`}
          title="Duplicar (Ctrl+D)"
        >
          Duplicar
        </button>
        <button
          onClick={onDelete}
          disabled={!hasSelection}
          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
            hasSelection ? "text-red-400 hover:bg-red-500/20" : "text-slate-600 cursor-not-allowed"
          }`}
          title="Deletar (Del)"
        >
          Deletar
        </button>

        <div className="w-px h-6 bg-slate-700 mx-2" />

        {/* History */}
        <button onClick={onUndo} className="px-2 py-1.5 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white text-sm" title="Desfazer (Ctrl+Z)">
          Desfazer
        </button>
        <button onClick={onRedo} className="px-2 py-1.5 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white text-sm" title="Refazer (Ctrl+Shift+Z)">
          Refazer
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">
          {objectCount} objeto{objectCount !== 1 ? "s" : ""}
        </span>

        <div className="w-px h-6 bg-slate-700" />

        <button
          onClick={onScreenshot}
          className="px-3 py-1.5 rounded-md text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
          title="Baixar imagem da cena"
        >
          Foto
        </button>
        <button
          onClick={onShare}
          className="px-3 py-1.5 rounded-md text-sm bg-green-600 hover:bg-green-700 text-white font-medium"
          title="Compartilhar via WhatsApp"
        >
          Compartilhar
        </button>

        <div className="w-px h-6 bg-slate-700" />

        <button
          onClick={onClear}
          className="px-3 py-1.5 rounded-md text-sm text-slate-400 hover:bg-slate-700 hover:text-white"
          title="Limpar tudo"
        >
          Limpar
        </button>
        <button
          onClick={onSave}
          className="px-3 py-1.5 rounded-md text-sm bg-blue-500 hover:bg-blue-600 text-white font-medium"
          title="Salvar (auto-save ativo)"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}

"use client";

import { EditorMode } from "./types";

interface ToolbarProps {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  onDelete: () => void;
  hasSelection: boolean;
  objectCount: number;
}

export default function Toolbar({ mode, onModeChange, onDelete, hasSelection, objectCount }: ToolbarProps) {
  const tools: { mode: EditorMode; label: string; shortcut: string }[] = [
    { mode: "translate", label: "Mover", shortcut: "G" },
    { mode: "rotate", label: "Rotacionar", shortcut: "R" },
    { mode: "scale", label: "Escalar", shortcut: "S" },
  ];

  return (
    <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-1">
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

        <button
          onClick={onDelete}
          disabled={!hasSelection}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            hasSelection
              ? "text-red-400 hover:bg-red-500/20"
              : "text-slate-600 cursor-not-allowed"
          }`}
          title="Deletar (Del)"
        >
          Deletar
        </button>
      </div>

      <div className="text-sm text-slate-500">
        {objectCount} objeto{objectCount !== 1 ? "s" : ""} na cena
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { FURNITURE_CATALOG, FurnitureItem } from "./types";

interface SidebarProps {
  onAddFurniture: (item: FurnitureItem) => void;
  wallColor: string;
  onWallColorChange: (color: string) => void;
  floorColor: string;
  onFloorColorChange: (color: string) => void;
}

const wallColors = ["#e8e4df", "#f5f0eb", "#d4cfc7", "#c9d6df", "#d5c4a1", "#bfc9c3", "#e8d5d5", "#ffffff"];
const floorColors = ["#c4b8a8", "#8B7355", "#a0522d", "#6B5B4B", "#d2b48c", "#808080", "#c0c0c0", "#3c3c3c"];

export default function Sidebar({
  onAddFurniture,
  wallColor,
  onWallColorChange,
  floorColor,
  onFloorColorChange,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"moveis" | "materiais">("moveis");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Sala de Estar");

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
        <button
          onClick={() => setActiveTab("moveis")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "moveis"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Móveis
        </button>
        <button
          onClick={() => setActiveTab("materiais")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "materiais"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Materiais
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "moveis" && (
          <div className="p-2">
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
                          className="w-10 h-10 rounded-md mb-2"
                          style={{ backgroundColor: item.parts[0]?.color ?? "#666" }}
                        />
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
            {/* Wall colors */}
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

            {/* Floor colors */}
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
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-700 text-xs text-slate-500 text-center">
        Clique num móvel para adicionar à cena
      </div>
    </div>
  );
}

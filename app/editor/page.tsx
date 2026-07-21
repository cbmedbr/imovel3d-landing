"use client";

import { useState, useEffect, useCallback } from "react";
import EditorViewport from "@/components/editor/EditorViewport";
import Sidebar from "@/components/editor/Sidebar";
import Toolbar from "@/components/editor/Toolbar";
import { FurnitureItem, PlacedObject, EditorMode, EditorState, RoomConfig, DEFAULT_ROOM } from "@/components/editor/types";
import { useHistory } from "@/components/editor/useHistory";

const STORAGE_KEY = "imovel3d_project";

function loadProject(): EditorState | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveProject(state: EditorState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export default function EditorPage() {
  const saved = loadProject();
  const history = useHistory<PlacedObject[]>(saved?.objects ?? []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<EditorMode>("translate");
  const [wallColor, setWallColor] = useState(saved?.wallColor ?? "#e8e4df");
  const [floorColor, setFloorColor] = useState(saved?.floorColor ?? "#c4b8a8");
  const [room, setRoom] = useState<RoomConfig>(saved?.room ?? DEFAULT_ROOM);
  const [showSaved, setShowSaved] = useState(false);

  // Auto-save on changes
  useEffect(() => {
    saveProject({ objects: history.state, wallColor, floorColor, room });
  }, [history.state, wallColor, floorColor, room]);

  const handleAddFurniture = useCallback((item: FurnitureItem) => {
    const newObj: PlacedObject = {
      id: `obj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      furniture: item,
      position: [
        (Math.random() - 0.5) * 2,
        item.defaultY ?? 0,
        (Math.random() - 0.5) * 2,
      ],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    };
    history.set([...history.state, newObj]);
    setSelectedId(newObj.id);
  }, [history]);

  const handleUpdateObject = useCallback((id: string, updates: Partial<PlacedObject>) => {
    history.setDirect(
      history.state.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj))
    );
  }, [history]);

  const handleDeleteSelected = useCallback(() => {
    if (!selectedId) return;
    history.set(history.state.filter((obj) => obj.id !== selectedId));
    setSelectedId(null);
  }, [selectedId, history]);

  const handleDuplicate = useCallback(() => {
    const obj = history.state.find((o) => o.id === selectedId);
    if (!obj) return;
    const newObj: PlacedObject = {
      ...obj,
      id: `obj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      position: [obj.position[0] + 0.5, obj.position[1], obj.position[2] + 0.5],
    };
    history.set([...history.state, newObj]);
    setSelectedId(newObj.id);
  }, [selectedId, history]);

  const handleSave = useCallback(() => {
    saveProject({ objects: history.state, wallColor, floorColor, room });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  }, [history.state, wallColor, floorColor]);

  const handleClearAll = useCallback(() => {
    history.set([]);
    setSelectedId(null);
  }, [history]);

  const handleRotate90 = useCallback((direction: "left" | "right" | "up" | "down") => {
    const obj = history.state.find((o) => o.id === selectedId);
    if (!obj) return;
    const angle = (direction === "left" || direction === "up") ? Math.PI / 2 : -Math.PI / 2;
    const newRotation: [number, number, number] = [...obj.rotation];
    if (direction === "left" || direction === "right") {
      newRotation[1] += angle;
    } else {
      newRotation[0] += angle;
    }
    history.set(
      history.state.map((o) => (o.id === selectedId ? { ...o, rotation: newRotation } : o))
    );
  }, [selectedId, history]);

  const handleSnap = useCallback((target: "floor" | "ceiling" | "wall-back" | "wall-left" | "wall-right") => {
    const obj = history.state.find((o) => o.id === selectedId);
    if (!obj) return;
    const bs = obj.furniture.boundingSize;
    const sy = obj.scale[1];
    const sx = obj.scale[0];
    const sz = obj.scale[2];
    let pos: [number, number, number] = [...obj.position];

    switch (target) {
      case "floor":
        pos[1] = (bs[1] * sy) / 2;
        break;
      case "ceiling":
        pos[1] = room.height - (bs[1] * sy) / 2;
        break;
      case "wall-back":
        pos[2] = -room.depth / 2 + (bs[2] * sz) / 2;
        break;
      case "wall-left":
        pos[0] = -room.width / 2 + (bs[0] * sx) / 2;
        break;
      case "wall-right":
        pos[0] = room.width / 2 - (bs[0] * sx) / 2;
        break;
    }

    history.set(
      history.state.map((o) => (o.id === selectedId ? { ...o, position: pos } : o))
    );
  }, [selectedId, history, room]);

  const handleScreenshot = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    // Deselect to hide transform controls in screenshot
    setSelectedId(null);
    setTimeout(() => {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `imovel3d_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }, 100);
  }, []);

  const handleShare = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    setSelectedId(null);
    setTimeout(async () => {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.share) {
          const file = new File([blob], "imovel3d.png", { type: "image/png" });
          try {
            await navigator.share({
              title: "Meu projeto - Imóvel 3D",
              text: "Veja como ficou o imóvel personalizado!",
              files: [file],
            });
          } catch {}
        } else {
          // Fallback: open WhatsApp with text
          window.open(
            "https://wa.me/?text=Veja%20meu%20projeto%20no%20Im%C3%B3vel%203D%21%20" +
              encodeURIComponent(window.location.href),
            "_blank"
          );
        }
      }, "image/png");
    }, 100);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (e.key === "Delete" || e.key === "Backspace") {
        handleDeleteSelected();
      } else if (e.key === "g" || e.key === "G") {
        setMode("translate");
      } else if (e.key === "r" && !e.ctrlKey) {
        setMode("rotate");
      } else if (e.key === "s" && !e.ctrlKey) {
        setMode("scale");
      } else if (e.key === "d" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleDuplicate();
      } else if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        history.undo();
      } else if (
        (e.key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
        (e.key === "y" && (e.ctrlKey || e.metaKey))
      ) {
        e.preventDefault();
        history.redo();
      } else if (e.key === "q" || e.key === "Q") {
        handleRotate90("left");
      } else if (e.key === "e" || e.key === "E") {
        handleRotate90("right");
      } else if (e.key === "w" || e.key === "W") {
        handleRotate90("up");
      } else if (e.key === "x" || e.key === "X") {
        handleRotate90("down");
      } else if (e.key === "Escape") {
        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleDeleteSelected, handleDuplicate, handleRotate90, history]);

  return (
    <div className="h-screen w-screen flex bg-slate-900 text-white overflow-hidden">
      <Sidebar
        onAddFurniture={handleAddFurniture}
        wallColor={wallColor}
        onWallColorChange={setWallColor}
        floorColor={floorColor}
        onFloorColorChange={setFloorColor}
        room={room}
        onRoomChange={setRoom}
      />

      <div className="flex-1 flex flex-col">
        <Toolbar
          mode={mode}
          onModeChange={setMode}
          onDelete={handleDeleteSelected}
          onDuplicate={handleDuplicate}
          onUndo={history.undo}
          onRedo={history.redo}
          onSave={handleSave}
          onClear={handleClearAll}
          onSnap={handleSnap}
          onRotate90={handleRotate90}
          onScreenshot={handleScreenshot}
          onShare={handleShare}
          hasSelection={!!selectedId}
          objectCount={history.state.length}
        />

        <div className="flex-1 relative">
          <EditorViewport
            placedObjects={history.state}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onUpdateObject={handleUpdateObject}
            mode={mode}
            wallColor={wallColor}
            floorColor={floorColor}
            room={room}
          />

          {/* Saved toast */}
          {showSaved && (
            <div className="absolute top-4 right-4 px-4 py-2 bg-green-500/90 rounded-lg text-sm font-medium animate-fade-in">
              Projeto salvo!
            </div>
          )}

          {/* Help */}
          <div className="absolute bottom-4 left-4 text-xs text-slate-500 space-y-1">
            <div>G = Mover | R = Rotacionar | S = Escalar</div>
            <div>Q/E = Girar ←→ | W/X = Girar ↑↓</div>
            <div>Ctrl+D = Duplicar | Del = Deletar | Esc = Deselecionar</div>
            <div>Ctrl+Z = Desfazer | Ctrl+Shift+Z = Refazer</div>
          </div>
        </div>
      </div>
    </div>
  );
}

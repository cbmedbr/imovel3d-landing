"use client";

import { useState } from "react";
import EditorViewport from "@/components/editor/EditorViewport";
import Sidebar from "@/components/editor/Sidebar";
import Toolbar from "@/components/editor/Toolbar";
import { FurnitureItem, PlacedObject, EditorMode } from "@/components/editor/types";

export default function EditorPage() {
  const [placedObjects, setPlacedObjects] = useState<PlacedObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<EditorMode>("translate");
  const [wallColor, setWallColor] = useState("#e8e4df");
  const [floorColor, setFloorColor] = useState("#c4b8a8");

  const handleAddFurniture = (item: FurnitureItem) => {
    const newObj: PlacedObject = {
      id: `obj_${Date.now()}`,
      furniture: item,
      position: [0, item.defaultY ?? 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    };
    setPlacedObjects((prev) => [...prev, newObj]);
    setSelectedId(newObj.id);
  };

  const handleUpdateObject = (id: string, updates: Partial<PlacedObject>) => {
    setPlacedObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj))
    );
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    setPlacedObjects((prev) => prev.filter((obj) => obj.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <div className="h-screen w-screen flex bg-slate-900 text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        onAddFurniture={handleAddFurniture}
        wallColor={wallColor}
        onWallColorChange={setWallColor}
        floorColor={floorColor}
        onFloorColorChange={setFloorColor}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <Toolbar
          mode={mode}
          onModeChange={setMode}
          onDelete={handleDeleteSelected}
          hasSelection={!!selectedId}
          objectCount={placedObjects.length}
        />

        {/* 3D Viewport */}
        <div className="flex-1 relative">
          <EditorViewport
            placedObjects={placedObjects}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onUpdateObject={handleUpdateObject}
            mode={mode}
            wallColor={wallColor}
            floorColor={floorColor}
          />
        </div>
      </div>
    </div>
  );
}

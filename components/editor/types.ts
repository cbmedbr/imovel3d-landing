export type EditorMode = "translate" | "rotate" | "scale";

export interface FurniturePart {
  shape: "box" | "cylinder" | "sphere";
  size: [number, number, number];
  position: [number, number, number];
  color: string;
}

export interface FurnitureItem {
  id: string;
  name: string;
  category: string;
  parts: FurniturePart[];
  boundingSize: [number, number, number];
  defaultY?: number;
  glbUrl?: string;
  glbScale?: number;
  glbOffsetY?: number;
}

export interface PlacedObject {
  id: string;
  furniture: FurnitureItem;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface RoomConfig {
  width: number;
  depth: number;
  height: number;
  showWallBack: boolean;
  showWallLeft: boolean;
  showWallRight: boolean;
  showWallFront: boolean;
  showCeiling: boolean;
}

export const DEFAULT_ROOM: RoomConfig = {
  width: 8,
  depth: 6,
  height: 3,
  showWallBack: true,
  showWallLeft: true,
  showWallRight: true,
  showWallFront: false,
  showCeiling: false,
};

export interface InternalWall {
  id: string;
  position: [number, number, number];
  length: number;
  height: number;
  thickness: number;
  rotationY: number; // 0 = along X axis, PI/2 = along Z axis
}

export interface SplatConfig {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number, number];
  scale: [number, number, number];
}

export interface EditorState {
  objects: PlacedObject[];
  wallColor: string;
  floorColor: string;
  room?: RoomConfig;
  splat?: SplatConfig | null;
  walls?: InternalWall[];
}

// Multi-part furniture (fallback when no .glb)
function multi(
  id: string,
  name: string,
  category: string,
  parts: FurniturePart[],
  boundingSize: [number, number, number],
  defaultY?: number,
  glbUrl?: string,
  glbScale?: number,
  glbOffsetY?: number,
): FurnitureItem {
  return { id, name, category, parts, boundingSize, defaultY, glbUrl, glbScale, glbOffsetY };
}

function simple(
  id: string,
  name: string,
  category: string,
  shape: "box" | "cylinder" | "sphere",
  size: [number, number, number],
  color: string,
  defaultY?: number,
  glbUrl?: string,
  glbScale?: number,
  glbOffsetY?: number,
): FurnitureItem {
  return {
    id, name, category,
    parts: [{ shape, size, position: [0, 0, 0], color }],
    boundingSize: size,
    defaultY, glbUrl, glbScale, glbOffsetY,
  };
}

// GLB URLs from Khronos glTF-Sample-Assets (CC0/Apache 2.0)
const KHRONOS = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models";

export const FURNITURE_CATALOG: Record<string, FurnitureItem[]> = {
  "Sala de Estar": [
    multi("sofa-glb", "Sofá Veludo", "Sala de Estar", [
      { shape: "box", size: [2.2, 0.35, 0.9], position: [0, -0.12, 0], color: "#4a5568" },
      { shape: "box", size: [2.2, 0.45, 0.15], position: [0, 0.12, -0.38], color: "#3d4756" },
      { shape: "box", size: [0.15, 0.5, 0.9], position: [-1.1, 0, 0], color: "#3d4756" },
      { shape: "box", size: [0.15, 0.5, 0.9], position: [1.1, 0, 0], color: "#3d4756" },
    ], [2.4, 0.8, 0.9], 0,
      `${KHRONOS}/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb`, 1.0, 0,
    ),

    multi("sofa-leather", "Sofá Couro", "Sala de Estar", [
      { shape: "box", size: [2.2, 0.35, 0.9], position: [0, -0.12, 0], color: "#5C3A1E" },
      { shape: "box", size: [2.2, 0.45, 0.15], position: [0, 0.12, -0.38], color: "#4C2A0E" },
      { shape: "box", size: [0.15, 0.5, 0.9], position: [-1.1, 0, 0], color: "#4C2A0E" },
      { shape: "box", size: [0.15, 0.5, 0.9], position: [1.1, 0, 0], color: "#4C2A0E" },
    ], [2.4, 0.8, 0.9], 0,
      `${KHRONOS}/SheenWoodLeatherSofa/glTF-Binary/SheenWoodLeatherSofa.glb`, 1.0, 0,
    ),

    multi("poltrona", "Poltrona", "Sala de Estar", [
      { shape: "box", size: [0.8, 0.3, 0.8], position: [0, -0.05, 0], color: "#5a6678" },
      { shape: "box", size: [0.8, 0.5, 0.12], position: [0, 0.15, -0.34], color: "#4e5a6a" },
      { shape: "box", size: [0.12, 0.4, 0.8], position: [-0.4, 0, 0], color: "#4e5a6a" },
      { shape: "box", size: [0.12, 0.4, 0.8], position: [0.4, 0, 0], color: "#4e5a6a" },
    ], [0.9, 0.7, 0.8], 0.35),

    multi("mesa-centro", "Mesa de Centro", "Sala de Estar", [
      { shape: "box", size: [1.2, 0.04, 0.6], position: [0, 0, 0], color: "#8B6914" },
      { shape: "box", size: [0.06, 0.35, 0.06], position: [-0.5, -0.19, 0.22], color: "#6B4914" },
      { shape: "box", size: [0.06, 0.35, 0.06], position: [0.5, -0.19, 0.22], color: "#6B4914" },
      { shape: "box", size: [0.06, 0.35, 0.06], position: [-0.5, -0.19, -0.22], color: "#6B4914" },
      { shape: "box", size: [0.06, 0.35, 0.06], position: [0.5, -0.19, -0.22], color: "#6B4914" },
    ], [1.2, 0.4, 0.6], 0.37),

    multi("rack-tv", "Rack TV", "Sala de Estar", [
      { shape: "box", size: [1.8, 0.04, 0.4], position: [0, 0, 0], color: "#5C4033" },
      { shape: "box", size: [1.8, 0.35, 0.04], position: [0, -0.19, -0.18], color: "#4C3023" },
      { shape: "box", size: [0.04, 0.35, 0.4], position: [-0.88, -0.19, 0], color: "#4C3023" },
      { shape: "box", size: [0.04, 0.35, 0.4], position: [0.88, -0.19, 0], color: "#4C3023" },
    ], [1.8, 0.4, 0.4], 0.37),

    multi("tv", "TV 55\"", "Sala de Estar", [
      { shape: "box", size: [1.2, 0.7, 0.03], position: [0, 0, 0], color: "#1a1a2e" },
      { shape: "box", size: [0.3, 0.02, 0.2], position: [0, -0.36, 0.08], color: "#2a2a2a" },
    ], [1.2, 0.7, 0.2], 1.0),

    simple("luminaria-chao", "Luminária de Chão", "Sala de Estar", "cylinder", [0.15, 1.5, 0.15], "#f0e68c", 0.75),
  ],

  "Quarto": [
    multi("cama-casal", "Cama Casal", "Quarto", [
      { shape: "box", size: [1.6, 0.25, 2.0], position: [0, 0, 0], color: "#e8e0d8" },
      { shape: "box", size: [1.7, 0.15, 2.1], position: [0, -0.15, 0], color: "#654321" },
      { shape: "box", size: [1.7, 0.6, 0.08], position: [0, 0.2, -1.0], color: "#5C3A1E" },
      { shape: "box", size: [1.4, 0.08, 1.8], position: [0, 0.15, 0], color: "#f0f0f0" },
    ], [1.7, 0.8, 2.1], 0.27),

    multi("cama-solteiro", "Cama Solteiro", "Quarto", [
      { shape: "box", size: [1.0, 0.2, 2.0], position: [0, 0, 0], color: "#d8d0c8" },
      { shape: "box", size: [1.1, 0.12, 2.1], position: [0, -0.12, 0], color: "#654321" },
      { shape: "box", size: [1.1, 0.5, 0.06], position: [0, 0.2, -1.0], color: "#5C3A1E" },
    ], [1.1, 0.6, 2.1], 0.22),

    multi("criado-mudo", "Criado-Mudo", "Quarto", [
      { shape: "box", size: [0.5, 0.03, 0.4], position: [0, 0, 0], color: "#8B7355" },
      { shape: "box", size: [0.5, 0.45, 0.03], position: [0, -0.21, -0.18], color: "#7B6345" },
      { shape: "box", size: [0.03, 0.45, 0.4], position: [-0.24, -0.21, 0], color: "#7B6345" },
      { shape: "box", size: [0.03, 0.45, 0.4], position: [0.24, -0.21, 0], color: "#7B6345" },
    ], [0.5, 0.48, 0.4], 0.48),

    multi("guarda-roupa", "Guarda-Roupa", "Quarto", [
      { shape: "box", size: [2.0, 2.2, 0.6], position: [0, 0, 0], color: "#6B5B4B" },
      { shape: "box", size: [0.03, 1.8, 0.01], position: [0, 0, 0.3], color: "#5B4B3B" },
      { shape: "cylinder", size: [0.03, 0.12, 0.03], position: [-0.3, 0, 0.32], color: "#c0c0c0" },
      { shape: "cylinder", size: [0.03, 0.12, 0.03], position: [0.3, 0, 0.32], color: "#c0c0c0" },
    ], [2.0, 2.2, 0.6], 1.1),

    multi("comoda", "Cômoda", "Quarto", [
      { shape: "box", size: [1.2, 0.8, 0.5], position: [0, 0, 0], color: "#7B6B5B" },
      { shape: "box", size: [1.1, 0.01, 0.01], position: [0, 0.15, 0.25], color: "#5B4B3B" },
      { shape: "box", size: [1.1, 0.01, 0.01], position: [0, -0.05, 0.25], color: "#5B4B3B" },
      { shape: "box", size: [1.1, 0.01, 0.01], position: [0, -0.25, 0.25], color: "#5B4B3B" },
    ], [1.2, 0.8, 0.5], 0.4),
  ],

  "Cozinha": [
    multi("geladeira", "Geladeira", "Cozinha", [
      { shape: "box", size: [0.7, 1.8, 0.7], position: [0, 0, 0], color: "#c0c0c0" },
      { shape: "box", size: [0.02, 0.6, 0.01], position: [0.33, 0.3, 0.35], color: "#909090" },
      { shape: "box", size: [0.02, 0.5, 0.01], position: [0.33, -0.35, 0.35], color: "#909090" },
      { shape: "box", size: [0.68, 0.01, 0.68], position: [0, 0, 0], color: "#a0a0a0" },
    ], [0.7, 1.8, 0.7], 0.9),

    multi("fogao", "Fogão", "Cozinha", [
      { shape: "box", size: [0.6, 0.9, 0.6], position: [0, 0, 0], color: "#d0d0d0" },
      { shape: "cylinder", size: [0.08, 0.02, 0.08], position: [-0.15, 0.46, -0.15], color: "#333" },
      { shape: "cylinder", size: [0.08, 0.02, 0.08], position: [0.15, 0.46, -0.15], color: "#333" },
      { shape: "cylinder", size: [0.06, 0.02, 0.06], position: [-0.15, 0.46, 0.12], color: "#333" },
      { shape: "cylinder", size: [0.06, 0.02, 0.06], position: [0.15, 0.46, 0.12], color: "#333" },
    ], [0.6, 0.9, 0.6], 0.45),

    multi("bancada", "Bancada", "Cozinha", [
      { shape: "box", size: [2.0, 0.05, 0.6], position: [0, 0, 0], color: "#808080" },
      { shape: "box", size: [2.0, 0.8, 0.58], position: [0, -0.42, 0], color: "#a0a0a0" },
    ], [2.0, 0.9, 0.6], 0.45),

    multi("mesa-jantar", "Mesa de Jantar", "Cozinha", [
      { shape: "box", size: [1.4, 0.04, 0.9], position: [0, 0, 0], color: "#8B6914" },
      { shape: "box", size: [0.06, 0.7, 0.06], position: [-0.6, -0.37, 0.35], color: "#6B4914" },
      { shape: "box", size: [0.06, 0.7, 0.06], position: [0.6, -0.37, 0.35], color: "#6B4914" },
      { shape: "box", size: [0.06, 0.7, 0.06], position: [-0.6, -0.37, -0.35], color: "#6B4914" },
      { shape: "box", size: [0.06, 0.7, 0.06], position: [0.6, -0.37, -0.35], color: "#6B4914" },
    ], [1.4, 0.75, 0.9], 0.72),

    multi("cadeira", "Cadeira", "Cozinha", [
      { shape: "box", size: [0.42, 0.03, 0.42], position: [0, 0, 0], color: "#654321" },
      { shape: "box", size: [0.42, 0.45, 0.03], position: [0, 0.22, -0.2], color: "#5C3A1E" },
      { shape: "box", size: [0.04, 0.42, 0.04], position: [-0.17, -0.22, 0.17], color: "#5C3A1E" },
      { shape: "box", size: [0.04, 0.42, 0.04], position: [0.17, -0.22, 0.17], color: "#5C3A1E" },
      { shape: "box", size: [0.04, 0.42, 0.04], position: [-0.17, -0.22, -0.17], color: "#5C3A1E" },
      { shape: "box", size: [0.04, 0.42, 0.04], position: [0.17, -0.22, -0.17], color: "#5C3A1E" },
    ], [0.42, 0.9, 0.42], 0.43),

    multi("cadeira-damask", "Cadeira Clássica", "Cozinha", [
      { shape: "box", size: [0.45, 0.03, 0.45], position: [0, 0, 0], color: "#8B4513" },
      { shape: "box", size: [0.45, 0.5, 0.03], position: [0, 0.25, -0.21], color: "#6B3513" },
    ], [0.45, 0.9, 0.45], 0,
      `${KHRONOS}/ChairDamaskPurplegold/glTF-Binary/ChairDamaskPurplegold.glb`, 1.0, 0,
    ),
  ],

  "Banheiro": [
    multi("vaso", "Vaso Sanitário", "Banheiro", [
      { shape: "box", size: [0.38, 0.35, 0.55], position: [0, -0.05, 0], color: "#f5f5f5" },
      { shape: "cylinder", size: [0.2, 0.05, 0.2], position: [0, 0.15, -0.05], color: "#e8e8e8" },
      { shape: "box", size: [0.2, 0.3, 0.08], position: [0, 0.1, -0.25], color: "#f0f0f0" },
    ], [0.38, 0.45, 0.55], 0.22),

    multi("pia-banheiro", "Pia / Lavatório", "Banheiro", [
      { shape: "box", size: [0.6, 0.05, 0.45], position: [0, 0, 0], color: "#f0f0f0" },
      { shape: "box", size: [0.55, 0.6, 0.42], position: [0, -0.32, 0], color: "#e0e0e0" },
      { shape: "cylinder", size: [0.02, 0.15, 0.02], position: [0, 0.1, -0.15], color: "#c0c0c0" },
    ], [0.6, 0.75, 0.45], 0.42),

    multi("box-vidro", "Box de Vidro", "Banheiro", [
      { shape: "box", size: [1.0, 0.02, 1.0], position: [0, -0.99, 0], color: "#d0d0d0" },
      { shape: "box", size: [0.02, 2.0, 1.0], position: [-0.49, 0, 0], color: "#add8e6" },
      { shape: "box", size: [1.0, 2.0, 0.02], position: [0, 0, -0.49], color: "#add8e6" },
    ], [1.0, 2.0, 1.0], 1.0),
  ],

  "Escritório": [
    multi("mesa-escritorio", "Mesa Escritório", "Escritório", [
      { shape: "box", size: [1.4, 0.04, 0.7], position: [0, 0, 0], color: "#5C4033" },
      { shape: "box", size: [0.06, 0.7, 0.06], position: [-0.63, -0.37, 0.28], color: "#4C3023" },
      { shape: "box", size: [0.06, 0.7, 0.06], position: [0.63, -0.37, 0.28], color: "#4C3023" },
      { shape: "box", size: [0.06, 0.7, 0.06], position: [-0.63, -0.37, -0.28], color: "#4C3023" },
      { shape: "box", size: [0.06, 0.7, 0.06], position: [0.63, -0.37, -0.28], color: "#4C3023" },
    ], [1.4, 0.75, 0.7], 0.72),

    multi("cadeira-escritorio", "Cadeira Giratória", "Escritório", [
      { shape: "box", size: [0.48, 0.08, 0.48], position: [0, 0, 0], color: "#2d2d2d" },
      { shape: "box", size: [0.46, 0.5, 0.06], position: [0, 0.27, -0.22], color: "#333" },
      { shape: "cylinder", size: [0.04, 0.4, 0.04], position: [0, -0.22, 0], color: "#555" },
      { shape: "cylinder", size: [0.25, 0.04, 0.25], position: [0, -0.42, 0], color: "#444" },
    ], [0.48, 1.0, 0.48], 0,
      `${KHRONOS}/SheenChair/glTF-Binary/SheenChair.glb`, 1.0, 0,
    ),

    multi("estante", "Estante", "Escritório", [
      { shape: "box", size: [1.0, 2.0, 0.35], position: [0, 0, 0], color: "#6B5B4B" },
      { shape: "box", size: [0.94, 0.01, 0.33], position: [0, 0.5, 0], color: "#5B4B3B" },
      { shape: "box", size: [0.94, 0.01, 0.33], position: [0, 0, 0], color: "#5B4B3B" },
      { shape: "box", size: [0.94, 0.01, 0.33], position: [0, -0.5, 0], color: "#5B4B3B" },
    ], [1.0, 2.0, 0.35], 1.0),

    multi("monitor", "Monitor", "Escritório", [
      { shape: "box", size: [0.6, 0.38, 0.02], position: [0, 0.15, 0], color: "#1a1a2e" },
      { shape: "box", size: [0.08, 0.25, 0.08], position: [0, -0.08, 0.04], color: "#333" },
      { shape: "box", size: [0.25, 0.02, 0.18], position: [0, -0.2, 0.04], color: "#333" },
    ], [0.6, 0.55, 0.2], 0.75),
  ],
};

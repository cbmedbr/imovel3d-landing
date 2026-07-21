import { PlacedObject, RoomConfig, InternalWall, FURNITURE_CATALOG } from "./types";

function getFurniture(id: string) {
  for (const items of Object.values(FURNITURE_CATALOG)) {
    const found = items.find((i) => i.id === id);
    if (found) return found;
  }
  return null;
}

function obj(
  furnitureId: string,
  pos: [number, number, number],
  rotY: number = 0,
): PlacedObject | null {
  const furniture = getFurniture(furnitureId);
  if (!furniture) return null;
  return {
    id: `tmpl_${furnitureId}_${Math.random().toString(36).slice(2, 8)}`,
    furniture,
    position: pos,
    rotation: [0, rotY, 0],
    scale: [1, 1, 1],
  };
}

function iwall(
  id: string,
  x: number,
  z: number,
  length: number,
  rotY: number = 0,
  height: number = 2.8,
): InternalWall {
  return {
    id: `iw_${id}_${Math.random().toString(36).slice(2, 8)}`,
    position: [x, 0, z],
    length,
    height,
    thickness: 0.12,
    rotationY: rotY,
  };
}

// D-Yard Home Design - Centro Florianópolis
// Floor plan analysis:
// Total ~9.0m x 8.5m
// Left side: Sala de Jantar (bottom), Suite 03 (mid), BWC (top-left), Suite 02 (top)
// Right side: Living/Kitchen (bottom-right), Suite Principal (top-right)
// Main horizontal wall divides suites from living area at z ≈ -1.0

export function createDYardApartment(): {
  objects: PlacedObject[];
  walls: InternalWall[];
  room: RoomConfig;
  wallColor: string;
  floorColor: string;
} {
  // Internal walls
  const walls: InternalWall[] = [
    // Main horizontal wall (separates living from suites)
    iwall("main-h", 0, -1.2, 9.0, 0),

    // Suite Principal right wall (vertical, right side)
    iwall("sp-left", 1.0, -3.2, 4.0, Math.PI / 2),

    // Suite 02 / Suite 03 divider (vertical)
    iwall("s2-s3", -1.5, -3.0, 3.5, Math.PI / 2),

    // BWC left wall (vertical)
    iwall("bwc-l", -3.0, -3.8, 1.5, Math.PI / 2),

    // BWC bottom wall (horizontal)
    iwall("bwc-b", -2.5, -3.0, 1.2, 0),

    // Corridor wall segment (horizontal, between suites and BWC)
    iwall("corr", -0.3, -2.8, 2.2, 0),

    // Kitchen divider (peninsula, lower height)
    iwall("cozinha", 3.0, 0.8, 2.5, Math.PI / 2, 1.0),
  ];

  // Furniture
  const objects: (PlacedObject | null)[] = [
    // === LIVING (29 m²) — right side, bottom ===
    obj("sofa-glb", [2.0, 0, 0.2], Math.PI),
    obj("mesa-centro", [2.0, 0.37, -0.6], 0),
    obj("rack-tv", [2.0, 0.37, 1.5], 0),
    obj("tv", [2.0, 1.0, 1.65], 0),
    obj("poltrona", [0.3, 0.35, 0.0], Math.PI / 2),
    obj("luminaria-chao", [3.5, 0.75, -0.8], 0),

    // === SALA DE JANTAR (10.45 m²) — left side, bottom ===
    obj("mesa-jantar", [-2.5, 0.72, 1.2], 0),
    obj("cadeira", [-3.2, 0.43, 0.8], 0),
    obj("cadeira", [-1.8, 0.43, 0.8], 0),
    obj("cadeira", [-3.2, 0.43, 1.6], Math.PI),
    obj("cadeira", [-1.8, 0.43, 1.6], Math.PI),
    obj("cadeira", [-2.5, 0.43, 0.5], Math.PI / 2),
    obj("cadeira", [-2.5, 0.43, 1.9], -Math.PI / 2),

    // === COZINHA — far right ===
    obj("bancada", [3.8, 0.45, 2.0], Math.PI / 2),
    obj("geladeira", [4.0, 0.9, -0.2], Math.PI / 2),
    obj("fogao", [3.8, 0.45, 0.8], Math.PI / 2),

    // === SUÍTE PRINCIPAL (16.68 m²) — top right ===
    obj("cama-casal", [2.5, 0.27, -3.2], 0),
    obj("criado-mudo", [1.3, 0.48, -2.7], 0),
    obj("criado-mudo", [3.7, 0.48, -2.7], 0),
    obj("guarda-roupa", [2.5, 1.1, -4.5], 0),

    // === SUÍTE 02 (12.73 m²) — top left ===
    obj("cama-solteiro", [-0.2, 0.22, -3.8], Math.PI / 2),
    obj("criado-mudo", [0.3, 0.48, -3.2], 0),
    obj("comoda", [-0.5, 0.4, -1.8], Math.PI),

    // === SUÍTE 03 (10.47 m²) — mid left ===
    obj("cama-solteiro", [-3.0, 0.22, -2.0], 0),
    obj("criado-mudo", [-2.0, 0.48, -1.5], 0),
    obj("estante", [-4.0, 1.0, -1.8], Math.PI / 2),

    // === BWC 03 (3.08 m²) — top left corner ===
    obj("vaso", [-3.5, 0.22, -4.0], Math.PI),
    obj("pia-banheiro", [-2.5, 0.42, -3.5], Math.PI / 2),
  ];

  return {
    objects: objects.filter((o): o is PlacedObject => o !== null),
    walls,
    room: {
      width: 10,
      depth: 10,
      height: 2.8,
      showWallBack: true,
      showWallLeft: true,
      showWallRight: true,
      showWallFront: false,
      showCeiling: false,
    },
    wallColor: "#e8e4df",
    floorColor: "#c4b8a8",
  };
}

export const TEMPLATES: {
  id: string;
  name: string;
  description: string;
  create: () => ReturnType<typeof createDYardApartment>;
}[] = [
  {
    id: "dyard",
    name: "D-Yard Florianópolis",
    description: "3 suítes, living, sala de jantar, cozinha — 82m²",
    create: createDYardApartment,
  },
];

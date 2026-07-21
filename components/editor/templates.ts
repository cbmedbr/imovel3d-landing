import { PlacedObject, RoomConfig, FURNITURE_CATALOG } from "./types";

// Get furniture by id from catalog
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

// Internal wall as a thin box
function wall(
  name: string,
  pos: [number, number, number],
  size: [number, number, number],
  rotY: number = 0,
): PlacedObject {
  return {
    id: `wall_${name}_${Math.random().toString(36).slice(2, 8)}`,
    furniture: {
      id: `wall_${name}`,
      name: `Parede ${name}`,
      category: "Estrutura",
      parts: [{ shape: "box", size, position: [0, 0, 0], color: "#d4cfc7" }],
      boundingSize: size,
      defaultY: size[1] / 2,
    },
    position: pos,
    rotation: [0, rotY, 0],
    scale: [1, 1, 1],
  };
}

// D-Yard Home Design - Centro Florianópolis
// Based on floor plan measurements (in meters):
// Total approx: 9.04m x 8.5m
// Living 29m², Suite Principal 16.68m², Suite 02 12.73m², Suite 03 10.47m²
// BWC 03 3.08m², Sala de Jantar 10.45m²

export function createDYardApartment(): {
  objects: PlacedObject[];
  room: RoomConfig;
  wallColor: string;
  floorColor: string;
} {
  const wallH = 2.8;
  const wallT = 0.15;

  const objects: (PlacedObject | null)[] = [
    // === INTERNAL WALLS ===

    // Wall between Living and Suites (horizontal, runs along top of living area)
    wall("living-suites", [0, wallH / 2, -1.5], [9.0, wallH, wallT]),

    // Wall between Suite Principal and Suite 02 (vertical)
    wall("suite1-suite2", [-0.8, wallH / 2, -3.5], [wallT, wallH, 4.0]),

    // Wall between Suite 02 and Suite 03 (vertical)
    wall("suite2-suite3", [-3.2, wallH / 2, -3.0], [wallT, wallH, 3.0]),

    // Wall between Suite 03 and BWC (horizontal)
    wall("suite3-bwc", [-3.5, wallH / 2, -2.0], [2.5, wallH, wallT]),

    // BWC walls
    wall("bwc-left", [-4.2, wallH / 2, -2.8], [wallT, wallH, 1.6]),
    wall("bwc-back", [-3.5, wallH / 2, -3.5], [1.5, wallH, wallT]),

    // Kitchen/dining divider (half wall / peninsula)
    wall("cozinha-divider", [2.5, 0.45, 0.5], [0.15, 0.9, 2.5]),

    // === LIVING ROOM (29 m²) ===
    // Sofa
    obj("sofa-glb", [1.5, 0, 0.5], 0),
    // Coffee table
    obj("mesa-centro", [1.5, 0.37, -0.5], 0),
    // TV + Rack
    obj("rack-tv", [1.5, 0.37, -1.2], 0),
    obj("tv", [1.5, 1.0, -1.35], 0),
    // Armchair
    obj("poltrona", [-0.5, 0.35, 0], Math.PI / 2),

    // === SALA DE JANTAR (10.45 m²) ===
    obj("mesa-jantar", [-2.5, 0.72, 1.0], 0),
    obj("cadeira", [-3.1, 0.43, 0.6], 0),
    obj("cadeira", [-1.9, 0.43, 0.6], 0),
    obj("cadeira", [-3.1, 0.43, 1.4], Math.PI),
    obj("cadeira", [-1.9, 0.43, 1.4], Math.PI),
    obj("cadeira", [-2.5, 0.43, 0.3], Math.PI / 2),
    obj("cadeira", [-2.5, 0.43, 1.7], -Math.PI / 2),

    // === COZINHA (behind divider) ===
    obj("bancada", [3.5, 0.45, 1.5], Math.PI / 2),
    obj("geladeira", [3.8, 0.9, -0.5], 0),
    obj("fogao", [3.5, 0.45, 0.3], Math.PI / 2),

    // === SUÍTE PRINCIPAL (16.68 m²) ===
    obj("cama-casal", [1.5, 0.27, -3.0], 0),
    obj("criado-mudo", [0.3, 0.48, -2.5], 0),
    obj("criado-mudo", [2.7, 0.48, -2.5], 0),
    obj("guarda-roupa", [1.5, 1.1, -4.7], 0),

    // === SUÍTE 02 (12.73 m²) ===
    obj("cama-solteiro", [-1.8, 0.22, -3.5], Math.PI / 2),
    obj("criado-mudo", [-1.5, 0.48, -2.8], 0),
    obj("comoda", [-2.8, 0.4, -2.0], Math.PI),

    // === SUÍTE 03 (10.47 m²) ===
    obj("cama-solteiro", [-3.8, 0.22, -1.0], 0),
    obj("criado-mudo", [-3.2, 0.48, -0.5], 0),
    obj("estante", [-4.3, 1.0, 0.0], Math.PI / 2),

    // === BWC 03 (3.08 m²) ===
    obj("vaso", [-4.0, 0.22, -3.0], Math.PI),
    obj("pia-banheiro", [-3.5, 0.42, -2.5], Math.PI / 2),
  ];

  return {
    objects: objects.filter((o): o is PlacedObject => o !== null),
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

export const TEMPLATES: { id: string; name: string; description: string; create: () => ReturnType<typeof createDYardApartment> }[] = [
  {
    id: "dyard",
    name: "D-Yard Florianópolis",
    description: "3 suítes, living, sala de jantar, cozinha — 82m²",
    create: createDYardApartment,
  },
];

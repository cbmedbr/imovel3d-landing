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
    thickness: 0.15,
    rotationY: rotY,
  };
}

// ============================================================
// D-Yard Home Design - Centro Florianópolis
// ============================================================
// MEASUREMENTS FROM FLOOR PLAN (cm → m):
//
// Total width: 904cm = 9.04m
//
// Layout (top = back wall, z negative):
//
//  z=-4.3  ┌──────────────────────────────────────────────┐
//          │  BWC 03    │   Suite 02     │ Suite Principal │
//          │  2.36x1.30 │   12.73m²      │   16.68m²      │
//          │  3.08m²    │                │   5.46m wide   │
//  z=-2.9  ├────────────┤   corridor     │                │
//          │  Suite 03  │   1.40m wide   │                │
//          │  10.47m²   │                │                │
//          │  2.57x3.42 │                │                │
//  z=-0.9  ├────────────┴────────────────┤                │
//          │                             │                │
//          │  Sala de Jantar  │  Living   │                │
//          │  10.45m²         │  29.00m²  │                │
//          │                  │  4.30m w  │   Cozinha      │
//  z=4.0   └──────────────────────────────────────────────┘
//          x=-4.52                                  x=4.52
//
// Origin (0,0,0) = center of apartment

export function createDYardApartment(): {
  objects: PlacedObject[];
  walls: InternalWall[];
  room: RoomConfig;
  wallColor: string;
  floorColor: string;
} {
  // Key coordinates (origin = center of apartment)
  // Total: 9.04m wide (x: -4.52 to 4.52), ~8.3m deep (z: -4.3 to 4.0)

  // Vertical divider between Suites left and Suite Principal: x ≈ 1.7
  // (Suite Principal is 5.46m wide → from x=1.7 to x=4.52 = 2.82m...
  //  hmm, 546 might be a different measurement. Let me re-interpret.)
  //
  // Actually looking more carefully:
  // - 430.5 is width of Living+Sala area
  // - 546 might be depth of Suite Principal side
  // - Suite Principal width ≈ 4.30m (same as living below it)
  //
  // Let me use areas to derive dimensions:
  // Suite Principal 16.68m² ≈ 4.0m x 4.17m
  // Suite 02: 12.73m² ≈ 3.4m x 3.74m
  // Suite 03: 10.47m² with 342.5cm=3.42m x 257cm=2.57m → 3.42*2.57=8.79 ≈ close enough
  // BWC: 3.08m² with 236cm=2.36m x 130cm=1.30m → 2.36*1.30=3.07 ✓
  // Living: 29m² ≈ 5.5m x 5.27m
  // Sala Jantar: 10.45m² ≈ 3.5m x 2.99m

  // Refined layout:
  // x-axis: Left wall at x=-4.52, Right wall at x=4.52
  // z-axis: Back wall at z=-4.3, Front at z=4.0

  // Vertical dividers:
  // - Between left rooms (Suite03/BWC/SalaJantar) and center: x = -1.95 (Suite03 width=2.57m from left: -4.52+2.57=-1.95)
  // - Between center (Suite02/corridor/Living) and right (SuitePrincipal): x = 1.3 (Suite02 ~3.25m: -1.95+3.25=1.3)

  // Horizontal dividers:
  // - Main wall between suites and living: z = -0.9
  // - BWC/Suite03 divider: z = -2.9 (BWC depth 1.3m from back: -4.3+1.4=-2.9)
  // - Suite02/corridor bottom: z = -0.9 (same as main wall, but with door opening)

  const LEFT = -4.52;
  const RIGHT = 4.52;
  const BACK = -4.3;
  const FRONT = 4.0;

  // Key X positions
  const X_DIV1 = -1.95;  // Left rooms | center rooms
  const X_DIV2 = 1.5;    // Center rooms | Suite Principal

  // Key Z positions
  const Z_MAIN = -0.9;   // Suites | Living area
  const Z_BWC = -3.0;    // BWC bottom | Suite 03 top
  const Z_CORR_TOP = -3.0; // Corridor top (Suite 02 bottom)

  const H = 2.8;

  const walls: InternalWall[] = [
    // === MAIN HORIZONTAL WALL (separates suites from living) ===
    // Has door openings, so split into segments
    // From left wall to X_DIV1 (Suite 03 south wall)
    iwall("main-1", (LEFT + X_DIV1) / 2, Z_MAIN, Math.abs(X_DIV1 - LEFT), 0, H),
    // From X_DIV1 to X_DIV2 with door gap (~0.9m door in middle)
    // Left segment
    iwall("main-2a", (X_DIV1 + X_DIV1 + 0.8) / 2, Z_MAIN, 0.8, 0, H),
    // Right segment (after door gap)
    iwall("main-2b", (X_DIV2 - 0.6), Z_MAIN, 1.2, 0, H),
    // From X_DIV2 to right wall (Suite Principal continues down)
    // Suite Principal extends all the way to the front, so no wall here on the right side

    // === VERTICAL WALL: Left rooms | Center (X_DIV1) ===
    // From back to Z_MAIN, with door gap for Suite 03
    // Top segment (BWC east wall / Suite 02 west wall)
    iwall("div1-top", X_DIV1, (BACK + Z_BWC) / 2, Math.abs(Z_BWC - BACK), Math.PI / 2, H),
    // Bottom segment (Suite 03 east wall) with door gap
    iwall("div1-bot-a", X_DIV1, (Z_BWC + Z_BWC + 0.8) / 2, 0.6, Math.PI / 2, H),
    iwall("div1-bot-b", X_DIV1, (Z_MAIN + 0.5), Math.abs(Z_MAIN - Z_BWC) - 1.2, Math.PI / 2, H),

    // === VERTICAL WALL: Center | Suite Principal (X_DIV2) ===
    // Full height from back to front (Suite Principal is isolated)
    // Top part (with door gap near corridor)
    iwall("div2-top", X_DIV2, (BACK + BACK + 2.5) / 2, 2.5, Math.PI / 2, H),
    // Middle part (after door)
    iwall("div2-mid", X_DIV2, (Z_BWC + Z_MAIN) / 2, Math.abs(Z_MAIN - Z_BWC) - 0.9, Math.PI / 2, H),
    // Bottom part - between Living and Suite Principal / Kitchen
    iwall("div2-bot", X_DIV2, (Z_MAIN + FRONT) / 2, Math.abs(FRONT - Z_MAIN), Math.PI / 2, H),

    // === BWC WALLS ===
    // BWC south wall (horizontal)
    iwall("bwc-south", (LEFT + X_DIV1) / 2, Z_BWC, Math.abs(X_DIV1 - LEFT) - 0.8, 0, H),

    // === CORRIDOR / Suite 02 south wall ===
    // Short wall segment
    iwall("s02-south", (X_DIV1 + 0.8), Z_BWC, 1.0, 0, H),

    // === KITCHEN PENINSULA (half-height divider) ===
    iwall("cozinha-pen", 3.0, 1.5, 2.5, Math.PI / 2, 1.0),
  ];

  // Furniture positioned in each room
  const objects: (PlacedObject | null)[] = [
    // === LIVING (29 m²) — center-left, south side ===
    obj("sofa-glb", [-0.3, 0, 1.5], 0),
    obj("poltrona", [-2.0, 0.35, 1.0], Math.PI / 4),
    obj("mesa-centro", [-0.3, 0.37, 0.5], 0),
    obj("rack-tv", [-0.3, 0.37, 3.2], 0),
    obj("tv", [-0.3, 1.0, 3.4], 0),
    obj("luminaria-chao", [0.8, 0.75, 2.5], 0),

    // === SALA DE JANTAR (10.45 m²) — left, south side ===
    obj("mesa-jantar", [-3.2, 0.72, 2.0], 0),
    obj("cadeira", [-3.8, 0.43, 1.6], 0),
    obj("cadeira", [-2.6, 0.43, 1.6], 0),
    obj("cadeira", [-3.8, 0.43, 2.4], Math.PI),
    obj("cadeira", [-2.6, 0.43, 2.4], Math.PI),
    obj("cadeira", [-3.2, 0.43, 1.2], Math.PI / 2),
    obj("cadeira", [-3.2, 0.43, 2.8], -Math.PI / 2),

    // === COZINHA — right side, south ===
    obj("bancada", [3.0, 0.45, 3.2], 0),
    obj("geladeira", [3.8, 0.9, 0.0], Math.PI),
    obj("fogao", [3.0, 0.45, 0.2], 0),

    // === SUÍTE PRINCIPAL (16.68 m²) — right side, full height ===
    obj("cama-casal", [3.0, 0.27, -2.5], 0),
    obj("criado-mudo", [1.8, 0.48, -2.0], 0),
    obj("criado-mudo", [4.0, 0.48, -2.0], 0),
    obj("guarda-roupa", [3.0, 1.1, -3.9], 0),

    // === SUÍTE 02 (12.73 m²) — center, north side ===
    obj("cama-casal", [-0.2, 0.27, -3.5], 0),
    obj("criado-mudo", [-1.3, 0.48, -3.0], 0),
    obj("criado-mudo", [0.9, 0.48, -3.0], 0),
    obj("comoda", [-0.2, 0.4, -1.5], Math.PI),

    // === SUÍTE 03 (10.47 m²) — left, middle ===
    obj("cama-solteiro", [-3.2, 0.22, -1.8], 0),
    obj("criado-mudo", [-2.5, 0.48, -1.3], 0),
    obj("estante", [-4.0, 1.0, -2.5], Math.PI / 2),

    // === BWC 03 (3.08 m²) — left, top corner ===
    obj("vaso", [-3.8, 0.22, -3.8], Math.PI),
    obj("pia-banheiro", [-2.8, 0.42, -3.5], Math.PI / 2),
  ];

  return {
    objects: objects.filter((o): o is PlacedObject => o !== null),
    walls,
    room: {
      width: 9.04,
      depth: 8.3,
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
    description: "3 suítes, living 29m², sala de jantar, cozinha — 82m²",
    create: createDYardApartment,
  },
];

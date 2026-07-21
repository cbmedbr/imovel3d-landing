import { PlacedObject, RoomConfig, InternalWall } from "./types";

// Templates will be populated by AI floor plan reader in v2
// For now, users build layouts manually using the editor tools

export const TEMPLATES: {
  id: string;
  name: string;
  description: string;
  create: () => {
    objects: PlacedObject[];
    walls: InternalWall[];
    room: RoomConfig;
    wallColor: string;
    floorColor: string;
  };
}[] = [];

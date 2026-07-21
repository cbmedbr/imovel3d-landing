export type EditorMode = "translate" | "rotate" | "scale";

export interface FurnitureItem {
  id: string;
  name: string;
  category: string;
  shape: "box" | "cylinder" | "sphere";
  size: [number, number, number];
  color: string;
  defaultY?: number;
}

export interface PlacedObject {
  id: string;
  furniture: FurnitureItem;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export const FURNITURE_CATALOG: Record<string, FurnitureItem[]> = {
  "Sala de Estar": [
    { id: "sofa", name: "Sofá 3 Lugares", category: "Sala de Estar", shape: "box", size: [2.2, 0.8, 0.9], color: "#4a5568", defaultY: 0.4 },
    { id: "poltrona", name: "Poltrona", category: "Sala de Estar", shape: "box", size: [0.9, 0.8, 0.9], color: "#5a6678", defaultY: 0.4 },
    { id: "mesa-centro", name: "Mesa de Centro", category: "Sala de Estar", shape: "box", size: [1.2, 0.4, 0.6], color: "#8B6914", defaultY: 0.2 },
    { id: "rack-tv", name: "Rack TV", category: "Sala de Estar", shape: "box", size: [1.8, 0.5, 0.4], color: "#5C4033", defaultY: 0.25 },
    { id: "tv", name: "TV 55\"", category: "Sala de Estar", shape: "box", size: [1.2, 0.7, 0.05], color: "#1a1a2e", defaultY: 1.2 },
    { id: "luminaria-chao", name: "Luminária de Chão", category: "Sala de Estar", shape: "cylinder", size: [0.3, 1.6, 0.3], color: "#f0e68c", defaultY: 0.8 },
  ],
  "Quarto": [
    { id: "cama-casal", name: "Cama Casal", category: "Quarto", shape: "box", size: [1.6, 0.5, 2.0], color: "#e8e0d8", defaultY: 0.25 },
    { id: "cama-solteiro", name: "Cama Solteiro", category: "Quarto", shape: "box", size: [1.0, 0.5, 2.0], color: "#d8d0c8", defaultY: 0.25 },
    { id: "criado-mudo", name: "Criado-Mudo", category: "Quarto", shape: "box", size: [0.5, 0.5, 0.4], color: "#8B7355", defaultY: 0.25 },
    { id: "guarda-roupa", name: "Guarda-Roupa", category: "Quarto", shape: "box", size: [2.0, 2.2, 0.6], color: "#6B5B4B", defaultY: 1.1 },
    { id: "comoda", name: "Cômoda", category: "Quarto", shape: "box", size: [1.2, 0.8, 0.5], color: "#7B6B5B", defaultY: 0.4 },
  ],
  "Cozinha": [
    { id: "geladeira", name: "Geladeira", category: "Cozinha", shape: "box", size: [0.7, 1.8, 0.7], color: "#c0c0c0", defaultY: 0.9 },
    { id: "fogao", name: "Fogão", category: "Cozinha", shape: "box", size: [0.6, 0.9, 0.6], color: "#d0d0d0", defaultY: 0.45 },
    { id: "bancada", name: "Bancada", category: "Cozinha", shape: "box", size: [2.0, 0.9, 0.6], color: "#a0a0a0", defaultY: 0.45 },
    { id: "mesa-jantar", name: "Mesa de Jantar", category: "Cozinha", shape: "box", size: [1.4, 0.75, 0.9], color: "#8B6914", defaultY: 0.375 },
    { id: "cadeira", name: "Cadeira", category: "Cozinha", shape: "box", size: [0.45, 0.9, 0.45], color: "#654321", defaultY: 0.45 },
  ],
  "Banheiro": [
    { id: "vaso", name: "Vaso Sanitário", category: "Banheiro", shape: "box", size: [0.4, 0.45, 0.6], color: "#f5f5f5", defaultY: 0.225 },
    { id: "pia-banheiro", name: "Pia / Lavatório", category: "Banheiro", shape: "box", size: [0.6, 0.85, 0.5], color: "#f0f0f0", defaultY: 0.425 },
    { id: "box-vidro", name: "Box de Vidro", category: "Banheiro", shape: "box", size: [1.0, 2.0, 1.0], color: "#add8e6", defaultY: 1.0 },
  ],
  "Escritório": [
    { id: "mesa-escritorio", name: "Mesa Escritório", category: "Escritório", shape: "box", size: [1.4, 0.75, 0.7], color: "#5C4033", defaultY: 0.375 },
    { id: "cadeira-escritorio", name: "Cadeira Giratória", category: "Escritório", shape: "cylinder", size: [0.5, 1.1, 0.5], color: "#2d2d2d", defaultY: 0.55 },
    { id: "estante", name: "Estante", category: "Escritório", shape: "box", size: [1.0, 2.0, 0.35], color: "#6B5B4B", defaultY: 1.0 },
  ],
};

declare module "@mkkellogg/gaussian-splats-3d" {
  import { Object3D } from "three";

  export class DropInViewer extends Object3D {
    constructor(options?: {
      gpuAcceleratedSort?: boolean;
      sharedMemoryForWorkers?: boolean;
    });
    addSplatScene(
      url: string,
      options?: {
        splatAlphaRemovalThreshold?: number;
        position?: number[];
        rotation?: number[];
        scale?: number[];
      }
    ): Promise<void>;
    dispose(): void;
  }

  export class Viewer {
    constructor(options?: Record<string, unknown>);
    addSplatScene(url: string, options?: Record<string, unknown>): Promise<void>;
    start(): void;
    dispose(): void;
  }
}

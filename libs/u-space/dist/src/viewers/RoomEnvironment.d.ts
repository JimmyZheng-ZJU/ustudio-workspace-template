import { PMREMGenerator, type Texture, type WebGPURenderer } from 'three/webgpu';
import { RoomEnvironment as RoomEnvironmentClass } from 'three/addons/environments/RoomEnvironment.js';
export declare class RoomEnvironment {
    environment: RoomEnvironmentClass;
    renderer: WebGPURenderer;
    pmremGenerator: PMREMGenerator;
    envMap: Texture | null;
    constructor(renderer: WebGPURenderer);
    update(): void;
    dispose(): void;
}

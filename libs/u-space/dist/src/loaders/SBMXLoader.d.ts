import type { LoadingManager } from 'three/webgpu';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
export declare class SBMXLoader extends GLTFLoader {
    constructor(manager?: LoadingManager);
    parse(data: ArrayBuffer, path: string, onLoad: (gltf: GLTF) => void, onError?: (event: ErrorEvent) => void): void;
}

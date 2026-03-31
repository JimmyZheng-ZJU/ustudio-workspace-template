import { FileLoader, type Object3D, type WebGPURenderer, type LoadingManager } from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { SBMXLoader } from './SBMXLoader';
import { SBMLoader } from './SBMLoader';
import type { InteractionEventMap } from '../interactions';
export interface LoadParameters {
    persistent?: boolean;
}
export declare class ModelLoaderManager {
    private static CACHE_NAME;
    static fileLoader: FileLoader;
    static dracoLoader: DRACOLoader;
    static ktx2Loader: KTX2Loader;
    static gltfLoader: GLTFLoader;
    static sbmxLoader: SBMXLoader;
    static sbmLoader: SBMLoader;
    static fbxLoader: FBXLoader;
    static objLoader: OBJLoader;
    static stlLoader: STLLoader;
    static setLoadingManager(loadingManager: LoadingManager): void;
    /**
     * Set the renderer to enable KTX2 support and other renderer-dependent features.
     */
    static setRenderer(renderer: WebGPURenderer): Promise<void>;
    /**
     * Configure Draco decoder path.
     */
    static setDracoPath(path: string): void;
    /**
     * Configure KTX2 transcoder path.
     */
    static setKTX2Path(path: string): void;
    static loadAsync(url: string, parameters?: LoadParameters): Promise<Object3D<InteractionEventMap>>;
    private static getPersistentData;
}

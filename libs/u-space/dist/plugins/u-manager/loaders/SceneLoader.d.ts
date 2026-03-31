import { Group, Loader } from 'three/webgpu';
import { type Viewer } from 'u-space';
export interface SceneLoaderOptions {
}
export declare class SceneLoader extends Loader<unknown, SceneLoaderOptions> {
    #private;
    viewer: Viewer;
    key: string;
    cachedIds: Set<string>;
    constructor(viewer: Viewer);
    setKey(key: string): this;
    loadAsync(options?: SceneLoaderOptions): Promise<Group<import("three").Object3DEventMap>>;
    clearCache(): void;
    dispose(): void;
}

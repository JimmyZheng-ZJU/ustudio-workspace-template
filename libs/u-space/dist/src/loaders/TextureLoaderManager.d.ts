import { TextureLoader, CubeTextureLoader, type LoadingManager } from 'three/webgpu';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
export declare class TextureLoaderManager {
    static textureLoader: TextureLoader;
    static hdrLoader: HDRLoader;
    static cubeTextureLoader: CubeTextureLoader;
    static setLoadingManager(loadingManager: LoadingManager): void;
    static loadAsyncTexture(url: string): Promise<import("three").Texture<HTMLImageElement>>;
    static loadAsyncHDR(url: string): Promise<import("three").DataTexture>;
    static loadAsyncCubeTexture(path: string, urls: string[]): Promise<import("three").CubeTexture<unknown>>;
}

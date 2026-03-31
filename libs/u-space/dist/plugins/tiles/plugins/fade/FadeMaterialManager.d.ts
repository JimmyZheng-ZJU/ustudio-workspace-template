import { type Material } from 'three/webgpu';
import { FadeMaterialManager as FadeMaterialManagerBase } from '3d-tiles-renderer/src/three/plugins/fade/FadeMaterialManager.js';
export interface FadeParams {
    fadeIn: {
        value: number;
    };
    fadeOut: {
        value: number;
    };
    fadeTexture: {
        value: unknown;
    };
}
export declare class FadeMaterialManager extends FadeMaterialManagerBase {
    protected _fadeParams: WeakMap<Material, FadeParams>;
    prepareMaterial(material: Material): void;
}

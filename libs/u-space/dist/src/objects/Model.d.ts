import { type Object3D, AnimationMixer, type AnimationAction, type AnimationClip, Box3, Vector3, type Material } from 'three/webgpu';
import { type InteractionEventMap } from '../interactions';
import { BaseGroup } from './BaseGroup';
export interface ModelParameters {
    url: string;
    cache?: boolean;
    persistent?: boolean;
}
export interface PlayAnimationOptions {
    loop?: boolean;
    repetitions?: number;
    timeScale?: number;
    clampWhenFinished?: boolean;
}
export declare class Model extends BaseGroup<InteractionEventMap> {
    readonly isModel = true;
    type: string;
    private static memoryCache;
    mixer: AnimationMixer | null;
    animations: AnimationClip[];
    private actions;
    constructor();
    loadAsync(parameters: ModelParameters): Promise<Object3D<import("three").Object3DEventMap> | null>;
    playAnimation(nameOrIndex?: string | number, options?: PlayAnimationOptions): AnimationAction | null;
    playAllAnimations(options?: PlayAnimationOptions): AnimationAction[];
    stopAnimation(nameOrIndex?: string | number): void;
    updateAnimation(delta: number): void;
    /**
     * Get the axis-aligned bounding box of this model.
     */
    getBoundingBox(): Box3;
    /**
     * Get the center point of this model's bounding box.
     */
    getCenter(): Vector3;
    /**
     * Set the material for all meshes in this model.
     */
    setMaterial(material: Material): void;
    static clearMemoryCache(): void;
    static clearPersistentCache(): Promise<void>;
}

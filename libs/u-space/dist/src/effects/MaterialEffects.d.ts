import { type Object3D, type ColorRepresentation } from 'three/webgpu';
export interface HighlightColorOptions {
    opacity?: number;
    color?: ColorRepresentation;
    overwrite?: boolean;
    depthWrite?: boolean;
}
export interface BreatheColorOptions {
    color?: ColorRepresentation;
    speed?: number;
    intensity?: number;
}
export interface FadeOptions {
    duration?: number;
}
export declare class MaterialEffects {
    static highlightColor(object: Object3D | Object3D[], options?: HighlightColorOptions): void;
    static removeHighlightColor(object: Object3D | Object3D[]): void;
    static breatheColor(object: Object3D | Object3D[], options?: BreatheColorOptions): void;
    static removeBreatheColor(object: Object3D | Object3D[]): void;
    /**
     * Enable wireframe mode on object(s).
     */
    static wireframe(object: Object3D | Object3D[], enabled?: boolean): void;
    /**
     * Remove wireframe mode.
     */
    static removeWireframe(object: Object3D | Object3D[]): void;
    /**
     * Fade in object(s) from fully transparent to original opacity.
     * Returns a promise that resolves when animation is complete.
     */
    static fadeIn(object: Object3D | Object3D[], options?: FadeOptions): Promise<void>;
    /**
     * Fade out object(s) to fully transparent.
     * Returns a promise that resolves when animation is complete.
     */
    static fadeOut(object: Object3D | Object3D[], options?: FadeOptions): Promise<void>;
    private static _fade;
}

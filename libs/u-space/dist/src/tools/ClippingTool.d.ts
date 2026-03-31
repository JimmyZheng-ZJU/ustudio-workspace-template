import { Plane, type Scene, type Object3D, Box3, ClippingGroup, type ColorRepresentation } from 'three/webgpu';
export interface ClippingPlaneOptions {
    normal?: {
        x: number;
        y: number;
        z: number;
    };
    constant?: number;
    showHelper?: boolean;
    helperSize?: number;
    helperColor?: ColorRepresentation;
}
export interface ClippingBoxOptions {
    showHelpers?: boolean;
    helperColor?: ColorRepresentation;
}
/**
 * Provides clipping plane and clipping box functionality using ClippingGroup (WebGPU).
 *
 * Objects must be children of the ClippingGroup to be clipped.
 * Use `clippingTool.group` to access the ClippingGroup and add objects to it,
 * or call `clippingTool.attach(scene)` to reparent all scene children under the group.
 */
export declare class ClippingTool {
    private scene;
    private planes;
    private helpers;
    /**
     * The ClippingGroup node. Objects must be descendants of this group to be clipped.
     */
    readonly group: ClippingGroup;
    constructor(scene: Scene);
    /**
     * Move all current scene children (except the clipping group itself) into the ClippingGroup,
     * so they are all subject to clipping.
     */
    attach(): void;
    /**
     * Move all children out of the ClippingGroup back to the scene root.
     */
    detach(): void;
    /**
     * Enable clipping.
     */
    enable(): void;
    /**
     * Disable clipping.
     */
    disable(): void;
    /**
     * Add a clipping plane.
     */
    addPlane(id: string, options?: ClippingPlaneOptions): Plane;
    /**
     * Add six clipping planes that form a box around a Box3.
     * Returns the six plane ids: `${id}_+x`, `${id}_-x`, etc.
     */
    addBox(id: string, box: Box3, options?: ClippingBoxOptions): string[];
    /**
     * Add a clipping box from an object's bounding box with optional padding.
     */
    addBoxFromObject(id: string, object: Object3D, padding?: number, options?: ClippingBoxOptions): string[];
    /**
     * Update a plane's constant (distance from origin).
     */
    setPlaneConstant(id: string, constant: number): void;
    /**
     * Remove a clipping plane.
     */
    removePlane(id: string): void;
    /**
     * Remove a clipping box (all 6 associated planes).
     */
    removeBox(id: string): void;
    /**
     * Remove all clipping planes.
     */
    removeAll(): void;
    /**
     * Show a helper visualization for a clipping plane.
     */
    showHelper(id: string, size?: number, color?: ColorRepresentation): void;
    /**
     * Hide a plane helper.
     */
    hideHelper(id: string): void;
    /**
     * Get a plane by id.
     */
    get(id: string): Plane | undefined;
    /**
     * Sync the planes map into the ClippingGroup's clippingPlanes array.
     */
    private _syncPlanes;
    dispose(): void;
}

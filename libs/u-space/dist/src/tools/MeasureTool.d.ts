import { Vector3, type Scene, type ColorRepresentation, Group } from 'three/webgpu';
export interface MeasureStyleOptions {
    lineColor?: ColorRepresentation;
    /** @deprecated lineWidth is not supported in WebGPU renderer */
    lineWidth?: number;
}
export interface MeasureResult {
    id: string;
    type: 'distance' | 'area' | 'angle';
    value: number;
    unit: string;
    points: Vector3[];
    object: Group;
}
/**
 * Provides measurement utilities for 3D scenes.
 */
export declare class MeasureTool {
    private scene;
    private measurements;
    private _idCounter;
    constructor(scene: Scene);
    /**
     * Measure distance between two points.
     */
    measureDistance(pointA: {
        x: number;
        y: number;
        z: number;
    }, pointB: {
        x: number;
        y: number;
        z: number;
    }, options?: MeasureStyleOptions): MeasureResult;
    /**
     * Measure the area of a polygon defined by 3+ coplanar points.
     */
    measureArea(points: {
        x: number;
        y: number;
        z: number;
    }[], options?: MeasureStyleOptions): MeasureResult;
    /**
     * Measure the angle between three points (vertex at the middle point).
     */
    measureAngle(pointA: {
        x: number;
        y: number;
        z: number;
    }, vertex: {
        x: number;
        y: number;
        z: number;
    }, pointC: {
        x: number;
        y: number;
        z: number;
    }, options?: MeasureStyleOptions): MeasureResult;
    /**
     * Get a measurement result by id.
     */
    get(id: string): MeasureResult | undefined;
    /**
     * Remove a measurement by id.
     */
    remove(id: string): void;
    /**
     * Remove all measurements.
     */
    removeAll(): void;
    /**
     * Get all measurement results.
     */
    getAll(): MeasureResult[];
    /**
     * Calculate polygon area using cross product method (Newell's method).
     */
    private _calculatePolygonArea;
    dispose(): void;
}

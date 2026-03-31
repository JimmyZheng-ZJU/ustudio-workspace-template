import { type ColorRepresentation } from 'three/webgpu';
export declare class TSLEffects {
    static flow(parameters?: {
        baseColor?: ColorRepresentation;
        flowColor?: ColorRepresentation;
        speed?: number;
        scale?: number;
        intensity?: number;
    }): import("three/webgpu").Node<"vec3">;
    static breathe(parameters?: {
        baseColor?: ColorRepresentation;
        breathColor?: ColorRepresentation;
        speed?: number;
        intensity?: number;
    }): import("three/webgpu").Node<"vec3">;
    static fluid(parameters?: {
        baseColor?: ColorRepresentation;
        flowColor?: ColorRepresentation;
        speed?: number;
        scale?: number;
        intensity?: number;
        distortion?: number;
    }): import("three/webgpu").Node<"vec3">;
}

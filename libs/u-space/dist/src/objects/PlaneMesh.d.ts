import { MeshStandardNodeMaterial, PlaneGeometry, type MeshStandardNodeMaterialParameters } from 'three/webgpu';
import type { InteractionEventMap } from '../interactions';
import { BaseMesh } from './BaseMesh';
export interface PlaneMeshParameters {
    geometryParameters?: {
        width?: number;
        height?: number;
        widthSegments?: number;
        heightSegments?: number;
    };
    materialParameters?: MeshStandardNodeMaterialParameters;
}
export declare class PlaneMesh extends BaseMesh<PlaneGeometry, MeshStandardNodeMaterial, InteractionEventMap> {
    readonly isPlaneMesh = true;
    type: string;
    constructor({ geometryParameters, materialParameters }?: PlaneMeshParameters);
}

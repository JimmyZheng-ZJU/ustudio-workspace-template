import { CircleGeometry, MeshStandardNodeMaterial, type MeshStandardNodeMaterialParameters } from 'three/webgpu';
import type { InteractionEventMap } from '../interactions';
import { BaseMesh } from './BaseMesh';
export interface CircleMeshParameters {
    geometryParameters?: {
        radius?: number;
        segments?: number;
        thetaStart?: number;
        thetaLength?: number;
    };
    materialParameters?: MeshStandardNodeMaterialParameters;
}
export declare class CircleMesh extends BaseMesh<CircleGeometry, MeshStandardNodeMaterial, InteractionEventMap> {
    readonly isCircleMesh = true;
    type: string;
    constructor({ geometryParameters, materialParameters }?: CircleMeshParameters);
}

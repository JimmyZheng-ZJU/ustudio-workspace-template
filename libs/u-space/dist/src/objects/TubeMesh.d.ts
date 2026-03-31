import { TubeGeometry, MeshStandardNodeMaterial, type Vector3, type Curve, type MeshStandardNodeMaterialParameters } from 'three/webgpu';
import type { InteractionEventMap } from '../interactions';
import { BaseMesh } from './BaseMesh';
export interface TubeMeshParameters {
    geometryParameters?: {
        path?: Curve<Vector3>;
        tubularSegments?: number;
        radius?: number;
        radialSegments?: number;
        closed?: boolean;
    };
    materialParameters?: MeshStandardNodeMaterialParameters;
}
export declare class TubeMesh extends BaseMesh<TubeGeometry, MeshStandardNodeMaterial, InteractionEventMap> {
    readonly isTubeMesh = true;
    type: string;
    constructor({ geometryParameters, materialParameters }?: TubeMeshParameters);
}

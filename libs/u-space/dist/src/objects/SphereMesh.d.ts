import { SphereGeometry, MeshStandardNodeMaterial, type MeshStandardNodeMaterialParameters } from 'three/webgpu';
import type { InteractionEventMap } from '../interactions';
import { BaseMesh } from './BaseMesh';
export interface SphereMeshParameters {
    geometryParameters?: {
        radius?: number;
        widthSegments?: number;
        heightSegments?: number;
        phiStart?: number;
        phiLength?: number;
        thetaStart?: number;
        thetaLength?: number;
    };
    materialParameters?: MeshStandardNodeMaterialParameters;
}
export declare class SphereMesh extends BaseMesh<SphereGeometry, MeshStandardNodeMaterial, InteractionEventMap> {
    readonly isSphereMesh = true;
    type: string;
    constructor({ geometryParameters, materialParameters }?: SphereMeshParameters);
}

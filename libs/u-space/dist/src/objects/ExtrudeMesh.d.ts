import { ExtrudeGeometry, MeshStandardNodeMaterial, Shape, type ExtrudeGeometryOptions, type MeshStandardNodeMaterialParameters } from 'three/webgpu';
import type { InteractionEventMap } from '../interactions';
import type { IPlaneVector2 } from '../interfaces';
import { BaseMesh } from './BaseMesh';
export interface ExtrudeMeshParameters {
    geometryParameters?: {
        shape?: Shape | Shape[];
        options?: ExtrudeGeometryOptions;
    };
    materialParameters?: MeshStandardNodeMaterialParameters;
}
export declare class ExtrudeMesh extends BaseMesh<ExtrudeGeometry, MeshStandardNodeMaterial, InteractionEventMap> {
    readonly isExtrudeMesh = true;
    type: string;
    constructor({ geometryParameters, materialParameters }?: ExtrudeMeshParameters);
    static createFromPoints(points?: IPlaneVector2[], parameters?: ExtrudeMeshParameters): ExtrudeMesh;
}

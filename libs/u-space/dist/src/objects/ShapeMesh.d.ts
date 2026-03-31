import { MeshStandardNodeMaterial, ShapeGeometry, Shape, type MeshStandardNodeMaterialParameters } from 'three/webgpu';
import type { InteractionEventMap } from '../interactions';
import type { IPlaneVector2 } from '../interfaces';
import { BaseMesh } from './BaseMesh';
export interface ShapeMeshParameters {
    geometryParameters?: {
        shape?: Shape | Shape[];
        curveSegments?: number;
    };
    materialParameters?: MeshStandardNodeMaterialParameters;
}
export declare class ShapeMesh extends BaseMesh<ShapeGeometry, MeshStandardNodeMaterial, InteractionEventMap> {
    readonly isShapeMesh = true;
    type: string;
    constructor({ geometryParameters, materialParameters }?: ShapeMeshParameters);
    static createFromPoints(points: IPlaneVector2[], parameters?: ShapeMeshParameters): ShapeMesh;
}

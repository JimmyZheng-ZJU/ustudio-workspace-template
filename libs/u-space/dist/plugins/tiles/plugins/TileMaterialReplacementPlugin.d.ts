import { type NodeMaterial } from 'three/webgpu';
import type { TilesRenderer } from '3d-tiles-renderer';
export declare class TileMaterialReplacementPlugin {
    tiles?: TilesRenderer;
    private readonly overrideMaterial;
    constructor(Material?: typeof NodeMaterial);
    init(tiles: TilesRenderer): void;
    private readonly handleLoadModel;
    private readonly handleDisposeModel;
    dispose(): void;
}

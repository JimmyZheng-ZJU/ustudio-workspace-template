import { TilesRenderer } from '3d-tiles-renderer';
import { TileCompressionPlugin, UpdateOnChangePlugin, ReorientationPlugin, XYZTilesPlugin } from '3d-tiles-renderer/plugins';
import { TilesFadePlugin } from './plugins/fade/TilesFadePlugin';
import { TileMaterialReplacementPlugin } from './plugins/TileMaterialReplacementPlugin';
declare class Globe {
    tiles: TilesRenderer;
    tileCompressionPlugin: TileCompressionPlugin;
    updateOnChangePlugin: UpdateOnChangePlugin;
    reorientationPlugin: ReorientationPlugin;
    xyzTilesPlugin: XYZTilesPlugin;
    tilesFadePlugin: TilesFadePlugin;
    tileMaterialReplacementPlugin: TileMaterialReplacementPlugin;
    constructor();
    _initTilesRenderer(): TilesRenderer<import("3d-tiles-renderer").TilesRendererEventMap>;
    _initTileCompressionPlugin(): TileCompressionPlugin;
    _initUpdateOnChangePlugin(): UpdateOnChangePlugin;
    _initReorientationPlugin(): ReorientationPlugin;
    _initXYZTilesPlugin(): XYZTilesPlugin;
    _initTilesFadePlugin(): TilesFadePlugin;
    _initTileMaterialReplacementPlugin(): TileMaterialReplacementPlugin;
}
export { Globe };

import type { Viewer } from 'u-space';
import { Globe } from './Globe';
declare class ArcgisTilesRenderer extends Globe {
    viewer: Viewer;
    loedTilesSets: Set<() => void>;
    constructor(viewer: Viewer);
    render: () => void;
    beforeRenderHandler: () => void;
    enable(): this;
    disable(): this;
    invalidate(lon: number, lat: number, alt: number): () => void;
    dispose(): void;
}
export { ArcgisTilesRenderer };

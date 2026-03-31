import type { Viewer } from 'u-space';
declare class Atmosphere {
    viewer: Viewer;
    constructor(viewer: Viewer);
    enable(): void;
    disable(): void;
    dispose(): void;
}
export { Atmosphere };

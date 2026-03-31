import { Vector3, type Object3D } from 'three/webgpu';
import type { Viewer } from 'u-space';
declare class TrackingControls {
    viewer: Viewer;
    target: Object3D | null;
    offset: Vector3;
    type: 'position' | 'box3';
    constructor(viewer: Viewer);
    _update: () => void;
    enable(): this;
    disable(): this;
}
export { TrackingControls };

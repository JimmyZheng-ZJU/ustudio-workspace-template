import { type PassNode, Mesh, MeshBasicNodeMaterial, OrthographicCamera, PlaneGeometry, Scene } from 'three/webgpu';
import type { Viewer } from 'u-space';
export declare class Watermarker extends Scene {
    viewer: Viewer;
    camera: OrthographicCamera;
    mesh: Mesh<PlaneGeometry, MeshBasicNodeMaterial>;
    overlayPass: PassNode;
    constructor(viewer: Viewer);
    enable(): void;
    disable(): void;
    dispose(): void;
}

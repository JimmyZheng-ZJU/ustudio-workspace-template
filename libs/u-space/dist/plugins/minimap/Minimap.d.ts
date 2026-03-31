import { CanvasTarget, Mesh, MeshBasicNodeMaterial, OrthographicCamera, PlaneGeometry, RenderTarget, Scene, type Object3D } from 'three/webgpu';
import { type Viewer, CameraControls } from 'u-space';
declare class Minimap {
    viewer: Viewer;
    camera: OrthographicCamera;
    scene: Scene;
    canvas: HTMLCanvasElement;
    canvasTarget: CanvasTarget;
    renderTarget: RenderTarget;
    controls: CameraControls;
    plane: Mesh<PlaneGeometry, MeshBasicNodeMaterial>;
    target: Object3D | null;
    marker: Object3D;
    needsUpdate: boolean;
    constructor(viewer: Viewer);
    _update: () => Promise<void>;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    enable(): this;
    disable(): this;
    dispose(): void;
}
export { Minimap };

import { EventDispatcher, WebGPURenderer, Scene, PerspectiveCamera, Timer, OrthographicCamera, type ColorRepresentation, type Texture } from 'three/webgpu';
import { InteractionManager } from '../interactions';
import { ObjectManager } from '../managers';
import { RenderPipeline } from './RenderPipeline';
import { CameraControls } from './CameraControls';
import { RoomEnvironment } from './RoomEnvironment';
import { ViewerHelper } from './ViewerHelper';
import { CSSRenderer } from './CSSRenderer';
import { Info } from './Info';
type ViewerRendererOptions = ConstructorParameters<typeof WebGPURenderer>['0'];
export interface ViewerOptions {
    el: HTMLElement;
    rendererOptions?: ViewerRendererOptions;
}
export interface ScreenshotOptions {
    width?: number;
    height?: number;
    type?: 'image/png' | 'image/jpeg' | 'image/webp';
    quality?: number;
}
export interface FogOptions {
    color?: ColorRepresentation;
    near?: number;
    far?: number;
}
export interface FogExp2Options {
    color?: ColorRepresentation;
    density?: number;
}
export interface ViewerEventMap {
    beforeControlsUpdate: {
        time: number;
        delta: number;
    };
    afterControlsUpdate: {
        time: number;
        delta: number;
    };
    beforeRender: {
        time: number;
        delta: number;
    };
    afterRender: {
        time: number;
        delta: number;
    };
    cameraChange: {
        camera: PerspectiveCamera | OrthographicCamera;
    };
}
declare class Viewer extends EventDispatcher<ViewerEventMap> {
    el: HTMLElement;
    renderer: WebGPURenderer;
    scene: Scene;
    camera: PerspectiveCamera | OrthographicCamera;
    info: Info;
    controls: CameraControls;
    renderPipeline: RenderPipeline;
    timer: Timer;
    roomEnvironment: RoomEnvironment;
    interactionManager: InteractionManager;
    objectManager: ObjectManager;
    viewerHelper: ViewerHelper;
    cssRenderer: CSSRenderer;
    frameCount: number;
    frameloop: 'always' | 'demand';
    constructor({ el, rendererOptions }: ViewerOptions);
    onWindowResize: () => void;
    init(): Promise<void>;
    setCamera(camera: PerspectiveCamera | OrthographicCamera): void;
    setCameraByType(type: 'perspective' | 'orthographic'): void;
    render(frame?: number): Promise<void>;
    private animate;
    private _initRenderer;
    createScene(): Scene;
    createPerspectiveCamera(): PerspectiveCamera;
    createOrthographicCamera(): OrthographicCamera;
    /**
     * Manually trigger a resize update.
     */
    resize(width?: number, height?: number): void;
    /**
     * Capture a screenshot of the current render.
     */
    screenshot(options?: ScreenshotOptions): Promise<string>;
    /**
     * Set the scene background color, texture, or null.
     */
    setBackground(background: ColorRepresentation | Texture | null): void;
    /**
     * Set the scene environment map for reflections / IBL.
     */
    setEnvironment(envMap: Texture | null): void;
    /**
     * Enable shadow rendering.
     */
    enableShadow(): void;
    /**
     * Disable shadow rendering.
     */
    disableShadow(): void;
    /**
     * Enable linear fog.
     */
    enableFog(options?: FogOptions): void;
    /**
     * Enable exponential fog.
     */
    enableFogExp2(options?: FogExp2Options): void;
    /**
     * Disable fog.
     */
    disableFog(): void;
    dispose(): void;
}
export { Viewer };

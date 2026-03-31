import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from 'three/addons/renderers/CSS3DRenderer.js';
import type { Scene, Camera } from 'three/webgpu';
export { CSS2DObject, CSS3DObject, CSS3DSprite };
declare class CSSRenderer {
    el: HTMLElement;
    css2dRenderer: CSS2DRenderer | null;
    css3dRenderer: CSS3DRenderer | null;
    constructor(el: HTMLElement);
    private initCSS2DRenderer;
    private initCSS3DRenderer;
    createCSS2DObject(element: HTMLElement): CSS2DObject;
    createCSS25DObject(element: HTMLElement): CSS3DSprite;
    createCSS3DObject(element: HTMLElement): CSS3DObject;
    render(scene: Scene, camera: Camera): void;
    resize(width: number, height: number): void;
    dispose(): void;
}
export { CSSRenderer };

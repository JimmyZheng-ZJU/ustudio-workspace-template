import { type WebGPURenderer } from 'three/webgpu';
export declare class Info {
    el: HTMLElement;
    renderer: WebGPURenderer;
    container: HTMLElement;
    drawCallsText: HTMLElement;
    frameCallsText: HTMLElement;
    trianglesText: HTMLElement;
    pointsText: HTMLElement;
    linesText: HTMLElement;
    timestampText: HTMLElement;
    _enabled: boolean;
    constructor(el: HTMLElement, renderer: WebGPURenderer);
    update(): void;
    enable(): void;
    disable(): void;
    dispose(): void;
}

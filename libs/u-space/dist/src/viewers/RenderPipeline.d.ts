import { type Scene, type Camera, type PassNode, RenderPipeline as RenderPipelineBase, type Node } from 'three/webgpu';
export interface BloomConfig {
    strength?: number;
    radius?: number;
    threshold?: number;
}
export interface SSGIConfig {
    sliceCount?: number;
    stepCount?: number;
    aoIntensity?: number;
    giIntensity?: number;
    radius?: number;
    thickness?: number;
}
export type OutputNodeComposer = (scenePass: PassNode) => Node;
type Args = [ConstructorParameters<typeof RenderPipelineBase>[0], Scene, Camera];
export declare class RenderPipeline extends RenderPipelineBase {
    #private;
    scene: Scene;
    camera: Camera;
    scenePass: PassNode;
    needsUpdateOutputNode: boolean;
    constructor(...args: Args);
    /** @deprecated Use `scenePass` instead */
    get currentOutputNode(): PassNode;
    addOverlayPass(pass: Node): void;
    removeOverlayPass(pass: Node): void;
    setCamera(camera: Camera): void;
    /** @deprecated Use `setOutputComposer` instead */
    setCurrentOutputNode(node: Node): void;
    /** @deprecated Use `setOutputComposer(null)` instead */
    resetCurrentOutputNode(): void;
    setOutputComposer(composer: OutputNodeComposer | null): void;
    enableBloom(config?: BloomConfig): void;
    disableBloom(): void;
    updateBloom(config: Partial<BloomConfig>): void;
    enableSSGI(config?: SSGIConfig): void;
    disableSSGI(): void;
    updateSSGI(config: Partial<SSGIConfig>): void;
    enableTRAA(): void;
    disableTRAA(): void;
    render(): void;
    dispose(): void;
}
export {};

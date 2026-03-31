import { EventDispatcher, Loader, type Object3D } from 'three/webgpu';
import { type AnimationModeType, type Tween, type Viewer } from 'u-space';
export declare class AnimationsLoader extends Loader {
    constructor();
    loadAsync(): Promise<IAnimations[]>;
}
export interface IKeyframe {
    id: string;
    uuid: string;
    x: number;
    y: number;
    z: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    easing: AnimationModeType;
    mode: string;
    delay: number;
    duration: number;
    repeat: number;
    yoyo: boolean;
}
/**
 * 动画
 */
export interface IAnimations {
    id: string;
    sid: string;
    modelId: string;
    name: string;
    keyframes: IKeyframe[];
}
export declare class AnimationsParser extends EventDispatcher<TAnimationsPlayerEventMap> {
    viewer: Viewer;
    target: Object3D;
    tweenSet: Set<TTweenType>;
    _initialTransformSymbol: symbol;
    constructor(viewer: Viewer, target: Object3D);
    initTransform(defaultTransform?: TTweenSource): TTweenSource;
    getInitialTransform(): TTweenSource | undefined;
    play(frames: IKeyframe[]): Promise<void>;
    stop(): void;
    reset(): void;
    dispose(): void;
}
export type TTweenSource = Pick<IKeyframe, 'x' | 'y' | 'z' | 'rotationX' | 'rotationY' | 'rotationZ' | 'scaleX' | 'scaleY' | 'scaleZ'>;
export type TTweenType = Tween<TTweenSource>;
export type TAnimationsPlayerEventMap = {
    update: {
        source: TTweenSource;
        tween: TTweenType;
    };
    start: {
        tween: TTweenType;
    };
};

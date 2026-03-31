import { Tween as TweenBase } from 'three/addons/libs/tween.module.js';
import type { Viewer, ViewerEventMap } from '../viewers';
declare class Tween<PropType extends Record<string, any>> extends TweenBase<PropType> {
    viewer: Viewer;
    constructor(viewer: Viewer, source: PropType);
    _update: ({ time }: ViewerEventMap["afterControlsUpdate"]) => void;
    easingByMode(mode: AnimationModeType): this;
    start(time?: number, overrideStartingValues?: boolean): this;
    stop(): this;
}
declare function tweenAnimation<PropType extends Record<string, any>>(viewer: Viewer, source: PropType, target: PropType, options?: AnimationOptions, onUpdate?: (source: PropType, tween: Tween<PropType>) => void, onStart?: (tween: Tween<PropType>) => void): Promise<void>;
export { Tween, tweenAnimation };
export type AnimationModeType = 'Linear.None' | 'Quadratic.In' | 'Quadratic.Out' | 'Quadratic.InOut' | 'Cubic.In' | 'Cubic.Out' | 'Cubic.InOut' | 'Quartic.In' | 'Quartic.Out' | 'Quartic.InOut' | 'Quintic.In' | 'Quintic.Out' | 'Quintic.InOut' | 'Sinusoidal.In' | 'Sinusoidal.Out' | 'Sinusoidal.InOut' | 'Exponential.In' | 'Exponential.Out' | 'Exponential.InOut' | 'Circular.In' | 'Circular.Out' | 'Circular.InOut' | 'Elastic.In' | 'Elastic.Out' | 'Elastic.InOut' | 'Back.In' | 'Back.Out' | 'Back.InOut' | 'Bounce.In' | 'Bounce.Out' | 'Bounce.InOut';
export interface AnimationOptions {
    duration?: number;
    delay?: number;
    repeat?: number | boolean;
    mode?: AnimationModeType;
    yoyo?: boolean;
}

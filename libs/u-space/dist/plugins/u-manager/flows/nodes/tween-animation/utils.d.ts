import type { Object3D } from 'three/webgpu';
import type { Viewer } from 'u-space';
import type { IAnimation } from '../../types';
export declare function playTweenAnimation(viewer: Viewer, object: Object3D, animation: IAnimation): Promise<void>;
export declare function stopTweenAnimation(animationId: string): void;

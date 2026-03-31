import type { Object3D } from 'three/webgpu';
import type { Viewer } from 'u-space';
import type { IComponentAnimation } from '../../types';
export declare function playComponentTweenAnimation(viewer: Viewer, object: Object3D, componentAnimation: IComponentAnimation): Promise<void>;
export declare function stopComponentTweenAnimation(animationId: string): void;

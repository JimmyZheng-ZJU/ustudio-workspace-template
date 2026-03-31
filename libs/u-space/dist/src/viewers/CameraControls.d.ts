import CameraControlsBase from 'camera-controls';
import { Box3, type Object3D } from 'three/webgpu';
import type { IVector3 } from '../interfaces';
export interface FlyToBoxOptions {
    viewpoint?: 'current' | 'top' | 'bottom' | 'front' | 'back' | 'left' | 'right' | 'frontTop' | 'backTop' | 'leftTop' | 'rightTop' | 'leftFrontTop' | 'rightFrontTop' | 'leftBackTop' | 'rightBackTop';
    enableTransition?: boolean;
    padding?: number;
    cover?: boolean;
}
export interface FlyToObjectOptions extends FlyToBoxOptions {
}
export interface FlyToOptions {
    enableTransition?: boolean;
}
export interface CameraViewpointData {
    position: IVector3;
    target: IVector3;
    zoom: number;
}
export declare class CameraControls extends CameraControlsBase {
    constructor(...args: ConstructorParameters<typeof CameraControlsBase>);
    /**
     * Set absolute angle for azimuth to avoid spinning
     */
    absoluteRotations(): void;
    flyToBox(box: Box3, options?: FlyToBoxOptions): Promise<boolean>;
    flyToObject(object: Object3D, options?: FlyToObjectOptions): Promise<boolean>;
    /**
     * Fly camera to a specific position and look-at target.
     */
    flyTo(position: IVector3, target: IVector3, options?: FlyToOptions): Promise<void>;
    /**
     * Get the current camera viewpoint data (position, target, zoom).
     */
    getCameraViewpoint(): CameraViewpointData;
    /**
     * Lock camera controls (disable all user interaction).
     */
    lock(): void;
    /**
     * Unlock camera controls (re-enable user interaction).
     */
    unlock(): void;
    /**
     * Switch between 2D top-down and 3D perspective views.
     */
    setViewMode(mode: '2d' | '3d', enableTransition?: boolean): Promise<void>;
    setCameraViewpoint(viewpoint: CameraViewpointData, enableTransition?: boolean): Promise<[void, void]>;
}

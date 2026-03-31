import { type Object3D } from 'three/webgpu';
import type { Viewer } from 'u-space';
import { CurveMovement } from './CurveMovement';
declare class CurveMovementObject extends CurveMovement {
    /** 移动目标对象 */
    target: Object3D | null;
    constructor(viewer: Viewer);
    /**
     * 更新动画帧
     */
    private _updateObject;
    dispose(): void;
}
export { CurveMovementObject };

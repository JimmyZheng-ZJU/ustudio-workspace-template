import type { Viewer } from 'u-space';
import { CurveMovement } from './CurveMovement';
declare class CurveMovementCamera extends CurveMovement {
    constructor(viewer: Viewer);
    private _updateCamera;
    dispose(): void;
}
export { CurveMovementCamera };

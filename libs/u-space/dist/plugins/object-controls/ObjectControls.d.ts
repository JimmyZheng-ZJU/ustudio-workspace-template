import { TransformControls } from 'three/addons/controls/TransformControls.js';
import type { Viewer } from 'u-space';
export interface ObjectControlsOptions {
    /** Transform mode. Default: 'translate' */
    mode?: 'translate' | 'rotate' | 'scale';
    /** Transform space. Default: 'world' */
    space?: 'world' | 'local';
    /** Gizmo size. Default: 1 */
    size?: number;
    /** Show X axis handle. Default: true */
    showX?: boolean;
    /** Show Y axis handle. Default: true */
    showY?: boolean;
    /** Show Z axis handle. Default: true */
    showZ?: boolean;
}
/**
 * Interactive plugin for translating, rotating, and scaling 3D objects.
 *
 * Extends Three.js `TransformControls` with the u-space `Viewer` lifecycle:
 * - `enable()` adds the gizmo to the scene and switches frameloop to 'always'.
 * - `disable()` removes the gizmo and restores previous state.
 * - While dragging, `viewer.controls` (CameraControls) is automatically
 *   suspended to prevent conflicts.
 *
 * Since this class extends `TransformControls` (→ `Controls` → `EventDispatcher`),
 * all native TransformControls events are available:
 *   - `'change'`           : Any transform property changed (fires every frame while dragging).
 *   - `'objectChange'`     : The attached object's matrix was updated.
 *   - `'mouseDown'`        : Drag started.
 *   - `'mouseUp'`          : Drag ended.
 *   - `'dragging-changed'` : `{ value: boolean }` — true when drag begins, false when it ends.
 *
 * @example
 * ```typescript
 * const controls = new ObjectControls(viewer, { mode: 'translate' });
 * controls.enable();
 * controls.attach(myMesh);
 *
 * controls.addEventListener('objectChange', () => {
 *   console.log(myMesh.position);
 * });
 * ```
 */
declare class ObjectControls extends TransformControls {
    viewer: Viewer;
    private _active;
    private _prevFrameloop;
    constructor(viewer: Viewer, options?: ObjectControlsOptions);
    private _onDraggingChanged;
    private _onCameraChange;
    /** Whether the controls are currently active (added to the scene). */
    get isActive(): boolean;
    /**
     * Enable the controls.
     * Adds the gizmo helper to the scene and switches frameloop to 'always'
     * so drags render continuously.
     */
    enable(): this;
    /**
     * Disable the controls.
     * Removes the gizmo from the scene and restores the previous frameloop.
     * Re-enables CameraControls in case they were suspended mid-drag.
     */
    disable(): this;
    /** Fully dispose all resources and remove the gizmo from the scene. */
    dispose(): void;
}
export { ObjectControls };

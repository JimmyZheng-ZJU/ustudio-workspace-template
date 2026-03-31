import { TransformControls as r } from "three/addons/controls/TransformControls.js";
class a extends r {
  viewer;
  _active = !1;
  _prevFrameloop = "demand";
  constructor(i, e) {
    super(i.camera, i.renderer.domElement), this.viewer = i, e?.mode !== void 0 && (this.mode = e.mode), e?.space !== void 0 && (this.space = e.space), e?.size !== void 0 && (this.size = e.size), e?.showX !== void 0 && (this.showX = e.showX), e?.showY !== void 0 && (this.showY = e.showY), e?.showZ !== void 0 && (this.showZ = e.showZ), this.addEventListener("dragging-changed", this._onDraggingChanged), this.viewer.addEventListener("cameraChange", this._onCameraChange);
  }
  // ─── Private handlers ─────────────────────────────────────────────────────
  _onDraggingChanged = (i) => {
    this.viewer.controls.enabled = !i.value;
  };
  _onCameraChange = ({ camera: i }) => {
    this.camera = i;
  };
  // ─── Public API ───────────────────────────────────────────────────────────
  /** Whether the controls are currently active (added to the scene). */
  get isActive() {
    return this._active;
  }
  /**
   * Enable the controls.
   * Adds the gizmo helper to the scene and switches frameloop to 'always'
   * so drags render continuously.
   */
  enable() {
    return this._active ? this : (this._active = !0, this._prevFrameloop = this.viewer.frameloop, this.viewer.frameloop = "always", this.viewer.scene.add(this.getHelper()), this.viewer.render(), this);
  }
  /**
   * Disable the controls.
   * Removes the gizmo from the scene and restores the previous frameloop.
   * Re-enables CameraControls in case they were suspended mid-drag.
   */
  disable() {
    return this._active ? (this._active = !1, this.viewer.frameloop = this._prevFrameloop, this.viewer.scene.remove(this.getHelper()), this.viewer.controls.enabled = !0, this.viewer.render(), this) : this;
  }
  /** Fully dispose all resources and remove the gizmo from the scene. */
  dispose() {
    this.disable(), this.removeEventListener("dragging-changed", this._onDraggingChanged), this.viewer.removeEventListener("cameraChange", this._onCameraChange), super.dispose();
  }
}
export {
  a as ObjectControls
};

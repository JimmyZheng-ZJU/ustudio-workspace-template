import { Box3 as s, Vector3 as r } from "three/webgpu";
const t = new s(), e = new r();
class a {
  viewer;
  target = null;
  offset = new r();
  type = "position";
  constructor(i) {
    this.viewer = i;
  }
  _update = () => {
    this.target && (this.type === "position" ? (e.setFromMatrixPosition(this.target.matrixWorld), e.add(this.offset)) : this.type === "box3" && (t.setFromObject(this.target), t.getCenter(e), e.add(this.offset)), this.viewer.controls.moveTo(e.x, e.y, e.z));
  };
  enable() {
    return this.viewer.addEventListener("beforeRender", this._update), this;
  }
  disable() {
    return this.viewer.removeEventListener("beforeRender", this._update), this;
  }
}
export {
  a as TrackingControls
};

import { texture as T, vec2 as w, uv as h } from "three/tsl";
import { Vector3 as d, CanvasTarget as u, OrthographicCamera as f, Scene as x, RenderTarget as y, Mesh as c, PlaneGeometry as k, MeshBasicNodeMaterial as l, ShapeGeometry as z, Shape as C, Vector2 as a, Box3 as b } from "three/webgpu";
import { CameraControls as M, ObjectUtils as R } from "u-space";
const r = new d(), S = new d();
class j {
  viewer;
  camera;
  scene;
  canvas;
  canvasTarget;
  renderTarget;
  controls;
  plane;
  target;
  marker;
  needsUpdate;
  constructor(e) {
    this.viewer = e, this.canvas = document.createElement("canvas"), this.canvas.style.position = "absolute", this.canvas.style.top = "10px", this.canvas.style.left = "10px", this.canvasTarget = new u(this.canvas), this.camera = new f(), this.camera.position.z = 1, this.scene = new x(), this.scene.environment = e.scene.environment, this.renderTarget = new y(1, 1, { flipY: !1 }), this.controls = new M(this.camera, this.canvas), this.controls.enabled = !1, this.plane = new c(
      new k(1, 1).rotateX(-Math.PI / 2),
      new l({
        colorNode: T(this.renderTarget.texture, w(h().x, h().y.oneMinus())),
        transparent: !0,
        depthTest: !1
      })
    ), this.target = null, this.marker = new c(
      new z(
        new C([new a(0, 0.9), new a(0.6, -0.9), new a(0, -0.4), new a(-0.6, -0.9)])
      ).rotateX(-Math.PI / 2),
      new l({ color: 16711680, transparent: !0, depthTest: !1 })
    ), this.marker.scale.setScalar(5), this.marker.renderOrder = 1, this.needsUpdate = !1, this.setSize(300, 300);
  }
  _update = async () => {
    const { renderer: e, timer: t, controls: s } = this.viewer;
    if (this.needsUpdate && this.target) {
      this.needsUpdate = !1;
      const i = this.target.parent;
      this.scene.attach(this.target);
      const n = new b().setFromObject(this.target), g = n.getCenter(r), o = n.getSize(S);
      this.plane.position.copy(g), this.plane.scale.set(o.x, 1, o.z), this.scene.remove(this.plane), this.scene.remove(this.marker), this.controls.flyToBox(n, {
        viewpoint: "top",
        enableTransition: !1
      }), this.controls.update(t.getDelta());
      const v = e.getRenderTarget();
      e.setRenderTarget(this.renderTarget), e.render(this.scene, this.camera), e.setRenderTarget(v), i ? i.attach(this.target) : this.scene.remove(this.target), this.scene.add(this.plane), this.scene.add(this.marker);
    }
    s.getPosition(r), this.marker.position.x = r.x, this.marker.position.y = this.plane.position.y, this.marker.position.z = r.z, this.marker.rotation.y = s.azimuthAngle;
    const p = e.getCanvasTarget(), m = e.getRenderTarget();
    e.setCanvasTarget(this.canvasTarget), e.setRenderTarget(null), e.render(this.scene, this.camera), e.setCanvasTarget(p), e.setRenderTarget(m);
  };
  setSize(e, t, s = !0) {
    this.canvasTarget.setSize(e, t, s), this.camera.left = -e / 2, this.camera.right = e / 2, this.camera.top = t / 2, this.camera.bottom = -t / 2, this.camera.updateProjectionMatrix(), this.renderTarget.setSize(e, t);
  }
  enable() {
    return this.viewer.el.appendChild(this.canvas), this.viewer.addEventListener("afterRender", this._update), this;
  }
  disable() {
    return this.viewer.el.removeChild(this.canvas), this.viewer.removeEventListener("afterRender", this._update), this;
  }
  dispose() {
    this.disable(), R.traverseMeshes(this.marker, (e) => {
      e.geometry.dispose(), e.material.dispose();
    }), this.plane.geometry.dispose(), this.plane.material.dispose(), this.renderTarget.dispose(), this.renderTarget.texture.dispose(), this.controls.dispose();
  }
}
export {
  j as Minimap
};

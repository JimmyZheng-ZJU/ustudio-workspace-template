import { NodeMaterial as M, MeshBasicNodeMaterial as m, Mesh as a, MathUtils as o } from "three/webgpu";
import { TilesRenderer as T } from "3d-tiles-renderer";
import { TilesFadePlugin as R, TileCompressionPlugin as E, UpdateOnChangePlugin as w, ReorientationPlugin as y, XYZTilesPlugin as F } from "3d-tiles-renderer/plugins";
import { FadeMaterialManager as _ } from "3d-tiles-renderer/src/three/plugins/fade/FadeMaterialManager.js";
import { wrapFadeMaterial as b } from "3d-tiles-renderer/src/three/plugins/fade/wrapFadeMaterial.js";
import { uniform as c, Fn as L, screenCoordinate as x, If as d, Discard as u, output as A } from "three/tsl";
import { reinterpretType as s } from "@takram/three-geospatial";
import { FnLayout as f } from "@takram/three-geospatial/webgpu";
const h = /* @__PURE__ */ Symbol("FADE_PARAMS"), p = f({
  name: "bayerDither2x2",
  type: "float",
  inputs: [{ name: "v", type: "vec2" }]
})(([t]) => (s(t), t.y.mul(3).add(t.x.mul(2)).mod(4))), C = f({
  name: "bayerDither4x4",
  type: "float",
  inputs: [{ name: "v", type: "vec2" }]
})(([t]) => {
  s(t);
  const e = t.mod(2), i = t.mod(4).mul(0.5).floor();
  return p(e).mul(4).add(p(i));
}), D = c(0).onObjectUpdate(
  ({ material: t }) => t != null ? t?.params?.fadeIn.value ?? 0 : 0
), O = c(0).onObjectUpdate(
  ({ material: t }) => t != null ? t?.params?.fadeOut.value ?? 0 : 0
), S = L(() => {
  const i = C(x.xy.mod(4).floor()).add(0.5).div(16);
  return d(i.greaterThanEqual(D), () => {
    u();
  }), d(i.lessThan(O), () => {
    u();
  }), A;
})();
function U(t) {
  if (s(t), t[h] != null)
    return t[h];
  const e = {
    fadeIn: { value: 0 },
    fadeOut: { value: 0 },
    fadeTexture: { value: null }
  };
  let i = 0;
  return t.params = e, t.defines = {
    get FEATURE_FADE() {
      return i;
    },
    set FEATURE_FADE(n) {
      n !== i && (i = n, t.outputNode = n === 1 ? S : null);
    }
  }, e;
}
class H extends _ {
  // HACK: Override "wrapFadeMaterial" to support NodeMaterial:
  prepareMaterial(e) {
    const i = this._fadeParams;
    if (i.has(e))
      return;
    let n;
    e instanceof M ? n = U(e) : n = b(e, e.onBeforeCompile), i.set(e, n);
  }
}
class I extends R {
  constructor(...e) {
    super(...e), this._fadeMaterialManager = new H();
  }
}
function g(t, e) {
  const i = t.material;
  if (Array.isArray(i))
    throw new Error("Multiple materials are not supported yet.");
  const n = new e();
  "map" in i && i.map != null && "map" in n && (s(i.map), s(n.map), i.map.flipY = !1, n.map = i.map.clone()), t.material = n, i.dispose();
}
class N {
  tiles;
  overrideMaterial;
  constructor(e = m) {
    this.overrideMaterial = e;
  }
  // Plugin method
  init(e) {
    this.tiles = e, e.group.traverse((i) => {
      i instanceof a && g(i, this.overrideMaterial);
    }), e.addEventListener("load-model", this.handleLoadModel), e.addEventListener("dispose-model", this.handleDisposeModel);
  }
  handleLoadModel = ({ scene: e }) => {
    e.traverse((i) => {
      i instanceof a && g(i, this.overrideMaterial);
    });
  };
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  handleDisposeModel = ({ scene: e }) => {
    e.traverse((i) => {
      i instanceof a && i.material.dispose();
    });
  };
  // Plugin method
  dispose() {
    this.tiles?.removeEventListener("load-model", this.handleLoadModel), this.tiles?.removeEventListener("dispose-model", this.handleDisposeModel);
  }
}
class z {
  tiles;
  tileCompressionPlugin;
  updateOnChangePlugin;
  reorientationPlugin;
  xyzTilesPlugin;
  tilesFadePlugin;
  tileMaterialReplacementPlugin;
  constructor() {
    this.tiles = this._initTilesRenderer(), this.tileCompressionPlugin = this._initTileCompressionPlugin(), this.updateOnChangePlugin = this._initUpdateOnChangePlugin(), this.reorientationPlugin = this._initReorientationPlugin(), this.xyzTilesPlugin = this._initXYZTilesPlugin(), this.tilesFadePlugin = this._initTilesFadePlugin(), this.tileMaterialReplacementPlugin = this._initTileMaterialReplacementPlugin();
  }
  _initTilesRenderer() {
    const e = new T();
    return e.maxDepth = 20, e.errorTarget = 1, e;
  }
  _initTileCompressionPlugin() {
    const e = new E();
    return this.tiles.registerPlugin(e), e;
  }
  _initUpdateOnChangePlugin() {
    const e = new w();
    return this.tiles.registerPlugin(e), e;
  }
  _initReorientationPlugin() {
    const e = new y();
    return this.tiles.registerPlugin(e), e;
  }
  _initXYZTilesPlugin() {
    const e = new F({
      center: !0,
      shape: "ellipsoid",
      url: "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    });
    return this.tiles.registerPlugin(e), e;
  }
  _initTilesFadePlugin() {
    const e = new I();
    return this.tiles.registerPlugin(e), e;
  }
  _initTileMaterialReplacementPlugin() {
    const e = new N(m);
    return this.tiles.registerPlugin(e), e;
  }
}
class G extends z {
  viewer;
  loedTilesSets = /* @__PURE__ */ new Set();
  constructor(e) {
    super(), this.viewer = e, this.tiles.addEventListener("needs-render", this.render), this.tiles.addEventListener("needs-update", this.render);
  }
  render = () => {
    this.viewer.render();
  };
  beforeRenderHandler = () => {
    this.viewer.camera.updateMatrixWorld(), this.tiles.setCamera(this.viewer.camera), this.tiles.setResolutionFromRenderer(this.viewer.camera, this.viewer.renderer), this.tiles.update();
  };
  enable() {
    return this.viewer.scene.add(this.tiles.group), this.viewer.addEventListener("beforeRender", this.beforeRenderHandler), this;
  }
  disable() {
    return this.viewer.scene.remove(this.tiles.group), this.viewer.removeEventListener("beforeRender", this.beforeRenderHandler), this;
  }
  invalidate(e, i, n) {
    const r = () => {
      const P = o.degToRad(i), v = o.degToRad(e);
      this.reorientationPlugin.transformLatLonHeightToOrigin(P, v, n), this.render(), l();
    }, l = () => {
      this.tiles.removeEventListener("load-root-tileset", r), this.loedTilesSets.delete(r);
    };
    return this.tiles.addEventListener("load-root-tileset", r), this.loedTilesSets.add(r), this.tiles.root && r(), l;
  }
  dispose() {
    this.disable(), this.loedTilesSets.forEach((e) => this.tiles.removeEventListener("load-root-tileset", e)), this.loedTilesSets.clear(), this.tiles.removeEventListener("needs-render", this.render), this.tiles.removeEventListener("needs-update", this.render), this.tiles.dispose();
  }
}
export {
  G as ArcgisTilesRenderer,
  z as Globe
};

import { Raycaster as _e, Vector2 as C, EventDispatcher as Ee, Box2 as Xe, Matrix4 as Pe, Vector3 as w, Box3 as Q, RenderPipeline as Ye, PerspectiveCamera as Y, Sphere as Oe, Spherical as S, Quaternion as Je, Vector4 as Ve, MathUtils as Ze, PMREMGenerator as et, OrthographicCamera as J, TimestampQuery as tt, Cache as st, Timer as nt, WebGPURenderer as it, PCFShadowMap as rt, AgXToneMapping as ot, Scene as at, Color as _, Fog as ct, FogExp2 as ht, MeshStandardNodeMaterial as R, Loader as lt, LoaderUtils as I, FileLoader as Be, TextureLoader as Ae, Group as L, SRGBColorSpace as Ie, RepeatWrapping as pe, BufferGeometry as W, BufferAttribute as ue, Mesh as H, FrontSide as dt, BackSide as pt, DoubleSide as ut, REVISION as me, CubeTextureLoader as mt, EquirectangularReflectionMapping as ft, Sprite as gt, AnimationMixer as yt, LoopRepeat as wt, LoopOnce as bt, SphereGeometry as vt, TubeGeometry as xt, LineCurve3 as Ct, CatmullRomCurve3 as St, SpriteNodeMaterial as Tt, CanvasTexture as Mt, ShapeGeometry as _t, Shape as Le, ExtrudeGeometry as Et, PlaneGeometry as Pt, CircleGeometry as Ot, ClippingGroup as Bt, Plane as At, PlaneHelper as It, LineBasicMaterial as V, Line as Z } from "three/webgpu";
import { pass as le, mrt as Lt, output as Rt, add as fe, blendColor as Nt, emissive as jt, normalView as zt, velocity as Dt, color as k, uv as ge, time as ee, pow as te, sin as de, mix as se, mx_noise_float as ye, Fn as Re, userData as A, materialColor as we, select as ne, materialOpacity as Ut, vec3 as kt } from "three/tsl";
import { bloom as Ft } from "three/addons/tsl/display/BloomNode.js";
import { ssgi as Ht } from "three/addons/tsl/display/SSGINode.js";
import { traa as Gt } from "three/addons/tsl/display/TRAANode.js";
import Ne from "camera-controls";
import { RoomEnvironment as $t } from "three/addons/environments/RoomEnvironment.js";
import { ViewHelper as Wt } from "three/addons/helpers/ViewHelper.js";
import { CSS2DRenderer as Kt, CSS2DObject as Qt } from "three/addons/renderers/CSS2DRenderer.js";
import { CSS2DObject as Sn } from "three/addons/renderers/CSS2DRenderer.js";
import { CSS3DRenderer as qt, CSS3DSprite as Xt, CSS3DObject as Yt } from "three/addons/renderers/CSS3DRenderer.js";
import { CSS3DObject as Mn, CSS3DSprite as _n } from "three/addons/renderers/CSS3DRenderer.js";
import { GLTFLoader as je } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader as Jt } from "three/addons/loaders/FBXLoader.js";
import { OBJLoader as Vt } from "three/addons/loaders/OBJLoader.js";
import { STLLoader as Zt } from "three/addons/loaders/STLLoader.js";
import { DRACOLoader as es } from "three/addons/loaders/DRACOLoader.js";
import { KTX2Loader as ts } from "three/addons/loaders/KTX2Loader.js";
import { MeshoptDecoder as be } from "three/addons/libs/meshopt_decoder.module.js";
import { HDRLoader as ss } from "three/addons/loaders/HDRLoader.js";
import { clone as ns } from "three/addons/utils/SkeletonUtils.js";
import { Easing as m, Tween as is } from "three/addons/libs/tween.module.js";
class rs {
  /** The type of event (e.g., 'click', 'pointerdown'). */
  type;
  /** The original 3D object that triggered the event. */
  target;
  /** The current 3D object during the bubbling phase. */
  currentTarget;
  /** The intersection data from raycasting, or null if not applicable. */
  intersect;
  /** The original DOM event, or undefined if not applicable. */
  originalEvent;
  _propagationStopped = !1;
  constructor(e) {
    this.type = e.type, this.target = e.target, this.currentTarget = e.target, this.intersect = e.intersect, this.originalEvent = e.originalEvent;
  }
  /**
   * Stops the event from bubbling up the parent chain.
   */
  stopPropagation() {
    this._propagationStopped = !0;
  }
  /**
   * Returns true if `stopPropagation()` has been called.
   */
  get propagationStopped() {
    return this._propagationStopped;
  }
}
class os {
  domElement;
  scene;
  camera;
  raycaster = new _e();
  pointer = new C();
  hoveredObject = null;
  pointerDownTime = 0;
  pointerDownPos = new C();
  clickTimer = null;
  longPressThreshold = 500;
  moveThreshold = 0.01;
  /**
   * The objects to check for intersections. default to all children of the scene (including nested).
   */
  targetObjects;
  /**
   * Whether to enable pointer move events (pointermove, pointerenter, pointerleave).
   * Disabled by default for performance optimization.
   */
  pointerMoveEventsEnabled = !1;
  /**
   * Whether interaction is enabled globally.
   */
  _enabled = !0;
  /**
   * Objects excluded from raycasting (via addIgnore or setInteractable(false)).
   */
  _excludeSet = /* @__PURE__ */ new Set();
  constructor(e, t, s) {
    this.domElement = e, this.scene = t, this.camera = s, this.raycaster.params.Points.threshold = 0.1, this.raycaster.params.Line.threshold = 0.1, this.targetObjects = this.scene.children, this._bindEvents();
  }
  /**
   * Updates the camera reference (useful when switching cameras).
   */
  setCamera(e) {
    this.camera = e;
  }
  /**
   * Enable all interactions.
   */
  enable() {
    this._enabled = !0;
  }
  /**
   * Disable all interactions.
   */
  disable() {
    this._enabled = !1;
  }
  /**
   * Set whether a specific object is interactable.
   * When set to false, the object and its children are excluded from raycasting.
   */
  setInteractable(e, t) {
    t ? this._excludeSet.delete(e) : this._excludeSet.add(e);
  }
  /**
   * Add an object to the exclude list (will not receive any events).
   * Alias for `setInteractable(object, false)`.
   */
  addIgnore(e) {
    this._excludeSet.add(e);
  }
  /**
   * Remove an object from the exclude list.
   * Alias for `setInteractable(object, true)`.
   */
  removeIgnore(e) {
    this._excludeSet.delete(e);
  }
  _bindEvents() {
    this.domElement.addEventListener("click", this._onClick), this.domElement.addEventListener("dblclick", this._onDblClick), this.domElement.addEventListener("contextmenu", this._onContextMenu), this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointerup", this._onPointerUp), this.domElement.addEventListener("pointermove", this._onPointerMove);
  }
  _updatePointer(e) {
    const t = this.domElement.getBoundingClientRect();
    this.pointer.x = (e.clientX - t.left) / t.width * 2 - 1, this.pointer.y = -((e.clientY - t.top) / t.height) * 2 + 1;
  }
  _getIntersects() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const e = this.raycaster.intersectObjects(this.targetObjects, !0);
    return this._excludeSet.size > 0 ? e.filter((t) => {
      let s = t.object;
      for (; s; ) {
        if (this._excludeSet.has(s))
          return !1;
        s = s.parent;
      }
      return !0;
    }) : e;
  }
  /**
   * Dispatches an event to the target object and bubbles up the parent chain.
   */
  _dispatchToTarget(e, t, s, n) {
    const i = new rs({
      type: e,
      target: t,
      intersect: s,
      originalEvent: n
    });
    let r = t;
    for (; r && !i.propagationStopped; )
      i.currentTarget = r, r.dispatchEvent({ type: e, event: i }), r = r.parent;
  }
  /**
   * Handles a DOM event by raycasting and dispatching to the first intersected object.
   */
  _handleEvent(e, t) {
    if (!this._enabled) return;
    this._updatePointer(t);
    const s = this._getIntersects();
    if (s.length === 0) return;
    const n = s[0];
    this._dispatchToTarget(e, n.object, n, t);
  }
  _onClick = (e) => {
    const t = Date.now() - this.pointerDownTime, s = this.pointer.distanceTo(this.pointerDownPos);
    if (!(t > this.longPressThreshold || s > this.moveThreshold)) {
      if (this.clickTimer) {
        clearTimeout(this.clickTimer), this.clickTimer = null;
        return;
      }
      this.clickTimer = setTimeout(() => {
        this._handleEvent("click", e), this.clickTimer = null;
      }, 200);
    }
  };
  _onDblClick = (e) => {
    this.clickTimer && (clearTimeout(this.clickTimer), this.clickTimer = null), this._handleEvent("dblclick", e);
  };
  _onContextMenu = (e) => {
    e.preventDefault();
  };
  _onPointerDown = (e) => {
    this.pointerDownTime = Date.now(), this._updatePointer(e), this.pointerDownPos.copy(this.pointer), this._handleEvent("pointerdown", e);
  };
  _onPointerUp = (e) => {
    if (this._updatePointer(e), e.button === 2) {
      const t = Date.now() - this.pointerDownTime, s = this.pointer.distanceTo(this.pointerDownPos);
      t <= this.longPressThreshold && s <= this.moveThreshold && this._handleEvent("rightclick", e);
    }
    this._handleEvent("pointerup", e);
  };
  _onPointerMove = (e) => {
    if (!this._enabled || !this.pointerMoveEventsEnabled) return;
    this._updatePointer(e);
    const t = this._getIntersects(), s = t.length > 0 ? t[0].object : null, n = t.length > 0 ? t[0] : null;
    this.hoveredObject !== s && (this.hoveredObject && this._dispatchToTarget("pointerleave", this.hoveredObject, null, e), this.hoveredObject = s, s && n && this._dispatchToTarget("pointerenter", s, n, e)), s && n && this._dispatchToTarget("pointermove", s, n, e);
  };
  /**
   * Cleans up event listeners.
   */
  dispose() {
    this.domElement.removeEventListener("click", this._onClick), this.domElement.removeEventListener("dblclick", this._onDblClick), this.domElement.removeEventListener("contextmenu", this._onContextMenu), this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.clickTimer && (clearTimeout(this.clickTimer), this.clickTimer = null), this.hoveredObject = null, this._excludeSet.clear();
  }
}
class cn extends Ee {
  scene;
  camera;
  domElement;
  /** The container element for the selection box overlay (domElement's parent). */
  _container;
  _selected = /* @__PURE__ */ new Set();
  // Box selection state
  _boxSelectionEnabled = !1;
  _isSelecting = !1;
  _startPoint = new C();
  _endPoint = new C();
  _selectionBox = null;
  _deep = !0;
  /**
   * Objects available for selection (defaults to scene.children).
   */
  targetObjects = null;
  constructor(e, t, s) {
    super(), this.domElement = e, this._container = e.parentElement ?? e, this.scene = t, this.camera = s;
  }
  get selected() {
    return this._selected;
  }
  get selectedArray() {
    return Array.from(this._selected);
  }
  /**
   * Select one or more objects.
   */
  select(e) {
    const t = Array.isArray(e) ? e : [e], s = [];
    for (const n of t)
      this._selected.has(n) || (this._selected.add(n), s.push(n));
    s.length > 0 && (this.dispatchEvent({ type: "select", objects: s }), this.dispatchEvent({ type: "change", selected: this._selected }));
  }
  /**
   * Deselect one or more objects.
   */
  deselect(e) {
    const t = Array.isArray(e) ? e : [e], s = [];
    for (const n of t)
      this._selected.delete(n) && s.push(n);
    s.length > 0 && (this.dispatchEvent({ type: "deselect", objects: s }), this.dispatchEvent({ type: "change", selected: this._selected }));
  }
  /**
   * Toggle selection of an object.
   */
  toggle(e) {
    this._selected.has(e) ? this.deselect(e) : this.select(e);
  }
  /**
   * Clear all selections.
   */
  clear() {
    if (this._selected.size === 0) return;
    const e = Array.from(this._selected);
    this._selected.clear(), this.dispatchEvent({ type: "deselect", objects: e }), this.dispatchEvent({ type: "change", selected: this._selected });
  }
  /**
   * Check if an object is selected.
   */
  isSelected(e) {
    return this._selected.has(e);
  }
  /**
   * Enable rubber-band box selection mode.
   */
  enableBoxSelection(e = {}) {
    this._boxSelectionEnabled || (this._boxSelectionEnabled = !0, this._deep = e.deep ?? !0, this._selectionBox = document.createElement("div"), this._selectionBox.style.cssText = `
      position: absolute;
      border: 1px dashed #55aaff;
      background: rgba(75, 160, 255, 0.15);
      pointer-events: none;
      display: none;
      z-index: 9999;
    `, e.className && (this._selectionBox.className = e.className), this._container.style.position = this._container.style.position || "relative", this._container.appendChild(this._selectionBox), this.domElement.addEventListener("pointerdown", this._onBoxPointerDown), this.domElement.addEventListener("pointermove", this._onBoxPointerMove), this.domElement.addEventListener("pointerup", this._onBoxPointerUp));
  }
  /**
   * Disable box selection mode.
   */
  disableBoxSelection() {
    this._boxSelectionEnabled && (this._boxSelectionEnabled = !1, this.domElement.removeEventListener("pointerdown", this._onBoxPointerDown), this.domElement.removeEventListener("pointermove", this._onBoxPointerMove), this.domElement.removeEventListener("pointerup", this._onBoxPointerUp), this._selectionBox && (this._selectionBox.remove(), this._selectionBox = null));
  }
  setCamera(e) {
    this.camera = e;
  }
  _onBoxPointerDown = (e) => {
    if (e.button !== 0) return;
    this._isSelecting = !0;
    const t = this._container.getBoundingClientRect();
    this._startPoint.set(e.clientX - t.left, e.clientY - t.top), this._endPoint.copy(this._startPoint), this._selectionBox && (this._selectionBox.style.display = "block", this._updateBoxElement());
  };
  _onBoxPointerMove = (e) => {
    if (!this._isSelecting) return;
    const t = this._container.getBoundingClientRect();
    this._endPoint.set(e.clientX - t.left, e.clientY - t.top), this._updateBoxElement();
  };
  _onBoxPointerUp = () => {
    if (!this._isSelecting) return;
    this._isSelecting = !1, this._selectionBox && (this._selectionBox.style.display = "none");
    const e = this._getObjectsInBox();
    this.clear(), e.length > 0 && this.select(e);
  };
  _updateBoxElement() {
    if (!this._selectionBox) return;
    const e = Math.min(this._startPoint.x, this._endPoint.x), t = Math.min(this._startPoint.y, this._endPoint.y), s = Math.abs(this._endPoint.x - this._startPoint.x), n = Math.abs(this._endPoint.y - this._startPoint.y);
    this._selectionBox.style.left = `${e}px`, this._selectionBox.style.top = `${t}px`, this._selectionBox.style.width = `${s}px`, this._selectionBox.style.height = `${n}px`;
  }
  _getObjectsInBox() {
    const e = this._container.getBoundingClientRect(), t = e.width, s = e.height, n = new C(
      this._startPoint.x / t * 2 - 1,
      -(this._startPoint.y / s) * 2 + 1
    ), i = new C(
      this._endPoint.x / t * 2 - 1,
      -(this._endPoint.y / s) * 2 + 1
    ), r = new Xe(
      new C(Math.min(n.x, i.x), Math.min(n.y, i.y)),
      new C(Math.max(n.x, i.x), Math.max(n.y, i.y))
    ), o = this.targetObjects || this.scene.children, a = [], c = new Pe();
    c.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
    const l = (d) => {
      if (!d.visible) return;
      const u = new w();
      if (u.setFromMatrixPosition(d.matrixWorld), u.applyMatrix4(c), u.z > -1 && u.z < 1 && r.containsPoint(new C(u.x, u.y)) && a.push(d), this._deep)
        for (const p of d.children)
          l(p);
    };
    for (const d of o)
      l(d);
    return a;
  }
  dispose() {
    this.disableBoxSelection(), this._selected.clear();
  }
}
class as {
  idMap = /* @__PURE__ */ new Map();
  nameMap = /* @__PURE__ */ new Map();
  typeMap = /* @__PURE__ */ new Map();
  objectIds = /* @__PURE__ */ new Map();
  allObjects = /* @__PURE__ */ new Set();
  /**
   * Add an object with a custom id.
   * One object can have multiple ids.
   */
  add(e, t) {
    if (this.idMap.has(e)) {
      console.warn(`ObjectManager: Object with id ${e} already exists.`);
      return;
    }
    this.idMap.set(e, t), this.allObjects.add(t), this.objectIds.has(t) || this.objectIds.set(t, /* @__PURE__ */ new Set()), this.objectIds.get(t).add(e), t.name && (this.nameMap.has(t.name) || this.nameMap.set(t.name, /* @__PURE__ */ new Set()), this.nameMap.get(t.name).add(t)), t.type && (this.typeMap.has(t.type) || this.typeMap.set(t.type, /* @__PURE__ */ new Set()), this.typeMap.get(t.type).add(t));
  }
  /**
   * Get an object by its custom id.
   */
  getById(e) {
    return this.idMap.get(e);
  }
  /**
   * Get all objects with a given name.
   */
  getByName(e) {
    return this.nameMap.get(e) || /* @__PURE__ */ new Set();
  }
  /**
   * Get all objects with a given type.
   */
  getByType(e) {
    return this.typeMap.get(e) || /* @__PURE__ */ new Set();
  }
  /**
   * Get all ids associated with an object.
   */
  getObjectIds(e) {
    return this.objectIds.get(e) || /* @__PURE__ */ new Set();
  }
  /**
   * Remove an object and all its associated ids.
   */
  remove(e) {
    const t = this.objectIds.get(e);
    if (t) {
      for (const s of t)
        this.idMap.delete(s);
      this.objectIds.delete(e);
    }
    if (e.name && this.nameMap.has(e.name)) {
      const s = this.nameMap.get(e.name);
      s.delete(e), s.size === 0 && this.nameMap.delete(e.name);
    }
    if (e.type && this.typeMap.has(e.type)) {
      const s = this.typeMap.get(e.type);
      s.delete(e), s.size === 0 && this.typeMap.delete(e.type);
    }
    this.allObjects.delete(e);
  }
  /**
   * Remove an object by its id.
   */
  removeById(e) {
    const t = this.idMap.get(e);
    t && this.remove(t);
  }
  /**
   * Remove all objects with a given name.
   */
  removeByName(e) {
    const t = this.getByName(e);
    for (const s of t)
      this.remove(s);
  }
  /**
   * Remove all objects with a given type.
   */
  removeByType(e) {
    const t = this.getByType(e);
    for (const s of t)
      this.remove(s);
  }
  /**
   * Clear all cached objects.
   */
  clear() {
    this.idMap.clear(), this.nameMap.clear(), this.typeMap.clear(), this.objectIds.clear(), this.allObjects.clear();
  }
  /**
   * Get all cached objects as a Set.
   */
  getAll() {
    return this.allObjects;
  }
  /**
   * Get the number of unique cached objects.
   */
  get size() {
    return this.allObjects.size;
  }
  /**
   * Show an object by id.
   */
  show(e) {
    const t = this.idMap.get(e);
    t && (t.visible = !0);
  }
  /**
   * Hide an object by id.
   */
  hide(e) {
    const t = this.idMap.get(e);
    t && (t.visible = !1);
  }
  /**
   * Show only the specified objects, hide all others.
   */
  isolate(e) {
    const t = new Set(e);
    for (const [s, n] of this.idMap)
      n.visible = t.has(s);
  }
  /**
   * Set the opacity of an object's materials.
   */
  setOpacity(e, t) {
    const s = this.idMap.get(e);
    s && s.traverse((n) => {
      if (!n.isMesh) return;
      const i = n.material;
      if (!i) return;
      const r = Array.isArray(i) ? i : [i];
      for (const o of r)
        o.transparent = t < 1, o.opacity = t, o.needsUpdate = !0;
    });
  }
  /**
   * Get the bounding box of an object by id, or all objects if no id provided.
   */
  getBoundingBox(e) {
    const t = new Q();
    if (e) {
      const s = this.idMap.get(e);
      s && t.setFromObject(s);
    } else
      for (const s of this.allObjects)
        t.expandByObject(s);
    return t;
  }
  /**
   * Iterate over all managed objects.
   */
  forEach(e) {
    for (const t of this.allObjects) {
      const s = this.objectIds.get(t) || /* @__PURE__ */ new Set();
      e(t, s);
    }
  }
  /**
   * Filter objects by a predicate.
   */
  filter(e) {
    const t = [];
    for (const s of this.allObjects)
      e(s) && t.push(s);
    return t;
  }
  /**
   * Show all managed objects.
   */
  showAll() {
    for (const e of this.allObjects)
      e.visible = !0;
  }
}
class cs extends Ye {
  scene;
  camera;
  scenePass;
  needsUpdateOutputNode;
  #r;
  #t;
  #s = !1;
  #o = { strength: 1, radius: 0, threshold: 0 };
  #c = null;
  #i = !1;
  #e = {
    sliceCount: 1,
    stepCount: 12,
    aoIntensity: 1,
    giIntensity: 10,
    radius: 12,
    thickness: 1
  };
  #h = null;
  #a = !1;
  #l = null;
  #d = null;
  constructor(...e) {
    const [t, s, n] = e;
    super(t), this.scene = s, this.camera = n, this.scenePass = le(s, n), this.needsUpdateOutputNode = !0, this.#r = /* @__PURE__ */ new Set(), this.#t = [], this.#p();
  }
  /** @deprecated Use `scenePass` instead */
  get currentOutputNode() {
    return this.scenePass;
  }
  addOverlayPass(e) {
    this.#r.add(e), this.needsUpdateOutputNode = !0;
  }
  removeOverlayPass(e) {
    this.#r.delete(e), this.needsUpdateOutputNode = !0;
  }
  setCamera(e) {
    this.camera = e, this.#n();
  }
  /** @deprecated Use `setOutputComposer` instead */
  setCurrentOutputNode(e) {
    this.setOutputComposer(() => e);
  }
  /** @deprecated Use `setOutputComposer(null)` instead */
  resetCurrentOutputNode() {
    this.setOutputComposer(null);
  }
  setOutputComposer(e) {
    this.#d = e, this.needsUpdateOutputNode = !0;
  }
  enableBloom(e) {
    e && Object.assign(this.#o, e), this.#s = !0, this.#n();
  }
  disableBloom() {
    this.#s = !1, this.#c = null, this.#n();
  }
  updateBloom(e) {
    Object.assign(this.#o, e), this.#s && (this.needsUpdateOutputNode = !0);
  }
  enableSSGI(e) {
    e && Object.assign(this.#e, e), this.#i = !0, this.#n();
  }
  disableSSGI() {
    this.#i = !1, this.#h = null, this.#n();
  }
  updateSSGI(e) {
    if (Object.assign(this.#e, e), this.#h) {
      const t = this.#h;
      e.sliceCount !== void 0 && (t.sliceCount.value = e.sliceCount), e.stepCount !== void 0 && (t.stepCount.value = e.stepCount), e.aoIntensity !== void 0 && (t.aoIntensity.value = e.aoIntensity), e.giIntensity !== void 0 && (t.giIntensity.value = e.giIntensity), e.radius !== void 0 && (t.radius.value = e.radius), e.thickness !== void 0 && (t.thickness.value = e.thickness);
    }
  }
  enableTRAA() {
    this.#a = !0, this.#n();
  }
  disableTRAA() {
    this.#a = !1, this.#l = null, this.#n();
  }
  #n() {
    const e = this.scenePass;
    this.scenePass = le(this.scene, this.camera), this.#p(), this.needsUpdateOutputNode = !0, e.dispose();
  }
  #p() {
    if (this.#s || this.#i || this.#a) {
      const t = { output: Rt };
      this.#s && (t.emissive = jt), this.#i && (t.normal = zt), this.#a && (t.velocity = Dt), this.scenePass.setMRT(Lt(t));
    }
  }
  #u() {
    for (const e of this.#t)
      e.dispose();
    this.#t = [];
  }
  #m() {
    let e = this.scenePass.getTextureNode();
    if (this.#i)
      if (!(this.camera instanceof Y))
        console.warn("RenderPipeline: SSGI requires a PerspectiveCamera, skipping.");
      else {
        const t = this.scenePass.getTextureNode(), s = this.scenePass.getTextureNode("depth"), n = this.scenePass.getTextureNode("normal"), i = Ht(t, s, n, this.camera);
        i.sliceCount.value = this.#e.sliceCount, i.stepCount.value = this.#e.stepCount, i.aoIntensity.value = this.#e.aoIntensity, i.giIntensity.value = this.#e.giIntensity, i.radius.value = this.#e.radius, i.thickness.value = this.#e.thickness, this.#h = i, e = fe(e, i), this.#t.push(i);
      }
    if (this.#s) {
      const t = this.scenePass.getTextureNode("emissive");
      this.#c = Ft(
        t,
        this.#o.strength,
        this.#o.radius,
        this.#o.threshold
      ), e = fe(e, this.#c), this.#t.push(this.#c);
    }
    return e;
  }
  #f() {
    this.#u();
    let e;
    if (this.#d ? e = this.#d(this.scenePass) : this.#s || this.#i ? e = this.#m() : e = this.scenePass, this.#a) {
      const t = this.scenePass.getTextureNode("depth"), s = this.scenePass.getTextureNode("velocity");
      this.#l = Gt(e, t, s, this.camera), this.#t.push(this.#l), e = this.#l;
    }
    this.#r.size > 0 && this.#r.forEach((t) => {
      const s = Nt(e, t);
      this.#t.push(s), e = s;
    }), this.outputNode = e, this.needsUpdate = !0;
  }
  render() {
    this.needsUpdateOutputNode && (this.#f(), this.needsUpdateOutputNode = !1), super.render();
  }
  dispose() {
    this.#u(), this.scenePass.dispose(), super.dispose();
  }
}
const hs = {
  Vector2: C,
  Vector3: w,
  Vector4: Ve,
  Quaternion: Je,
  Matrix4: Pe,
  Spherical: S,
  Box3: Q,
  Sphere: Oe,
  Raycaster: _e
};
Ne.install({ THREE: hs });
class ls extends Ne {
  constructor(...e) {
    super(...e), this.minDistance = 0.2, this.smoothTime = 0.2, this.dollySpeed = 0.2;
  }
  /**
   * Set absolute angle for azimuth to avoid spinning
   */
  absoluteRotations() {
    this.azimuthAngle = ds(this.azimuthAngle, 0);
  }
  async flyToBox(e, t = {}) {
    if (e.isEmpty())
      return console.warn("CameraControls.flyToBox: The provided Box3 is empty."), !1;
    this.absoluteRotations();
    const { viewpoint: s = "frontTop", enableTransition: n = !0, padding: i = 0.1, cover: r = !1 } = t, o = [];
    if (s !== "current") {
      const a = ve[s.toUpperCase()] ?? ve.FRONTTOP, c = a.theta, l = a.phi;
      o.push(
        this.fitToBox(e, n, {
          paddingLeft: i,
          paddingRight: i,
          paddingTop: i,
          paddingBottom: i,
          cover: r
        })
      ), o.push(this.rotateTo(c, l, n));
    } else {
      const a = new Oe();
      e.getBoundingSphere(a), a.radius += i, o.push(this.fitToSphere(a, n));
    }
    return await Promise.all(o), !0;
  }
  async flyToObject(e, t = {}) {
    const s = new Q().setFromObject(e);
    return this.flyToBox(s, t);
  }
  /**
   * Fly camera to a specific position and look-at target.
   */
  async flyTo(e, t, s = {}) {
    const { enableTransition: n = !0 } = s;
    return this.absoluteRotations(), this.setLookAt(e.x, e.y, e.z, t.x, t.y, t.z, n);
  }
  /**
   * Get the current camera viewpoint data (position, target, zoom).
   */
  getCameraViewpoint() {
    const e = new w(), t = new w();
    return this.getPosition(e), this.getTarget(t), {
      position: { x: e.x, y: e.y, z: e.z },
      target: { x: t.x, y: t.y, z: t.z },
      zoom: this.camera.zoom
    };
  }
  /**
   * Lock camera controls (disable all user interaction).
   */
  lock() {
    this.enabled = !1;
  }
  /**
   * Unlock camera controls (re-enable user interaction).
   */
  unlock() {
    this.enabled = !0;
  }
  /**
   * Switch between 2D top-down and 3D perspective views.
   */
  async setViewMode(e, t = !0) {
    if (e === "2d") {
      const s = new w();
      this.getTarget(s), await this.rotateTo(0, 0, t), this.minPolarAngle = 0, this.maxPolarAngle = 0;
    } else
      this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, await this.rotateTo(0, Math.PI / 4, t);
  }
  async setCameraViewpoint(e, t = !0) {
    const { position: s, target: n, zoom: i = this.camera.zoom } = e;
    return Promise.all([
      this.zoomTo(i, t),
      this.setLookAt(s.x, s.y, s.z, n.x, n.y, n.z, t)
    ]);
  }
}
const ve = {
  LEFT: new S(0, Math.PI / 2, -Math.PI / 2),
  RIGHT: new S(0, Math.PI / 2, Math.PI / 2),
  FRONT: new S(0, Math.PI / 2, 0),
  BACK: new S(0, Math.PI / 2, Math.PI),
  TOP: new S(0, 0, 0),
  BOTTOM: new S(0, Math.PI, 0),
  FRONTTOP: new S(0, Math.PI / 4, 0),
  BACKTOP: new S(0, Math.PI / 4, Math.PI),
  LEFTTOP: new S(0, Math.PI / 4, -Math.PI / 2),
  RIGHTTOP: new S(0, Math.PI / 4, Math.PI / 2),
  LEFTFRONTTOP: new S(0, Math.PI / 4, -Math.PI / 4),
  RIGHTFRONTTOP: new S(0, Math.PI / 4, Math.PI / 4),
  LEFTBACKTOP: new S(0, Math.PI / 4, -Math.PI / 4 * 3),
  RIGHTBACKTOP: new S(0, Math.PI / 4, Math.PI / 4 * 3)
};
function ds(h, e) {
  const t = h - e;
  return Ze.euclideanModulo(t + Math.PI, Math.PI * 2) - Math.PI;
}
class ps {
  environment = new $t();
  renderer;
  pmremGenerator;
  envMap = null;
  constructor(e) {
    this.renderer = e, this.pmremGenerator = new et(e);
  }
  update() {
    this.envMap || (this.envMap = this.pmremGenerator.fromScene(this.environment).texture);
  }
  dispose() {
    this.pmremGenerator.dispose(), this.envMap?.dispose();
  }
}
const X = 128;
class us extends Wt {
  viewer;
  overlayPass;
  constructor(e) {
    super(e.camera, e.el), this.viewer = e;
    const t = new J(-2, 2, 2, -2, 0, 4);
    t.position.set(0, 0, 2), this.overlayPass = le(this, t), this.setLabels("x", "y", "z");
  }
  _update = () => {
    this.quaternion.copy(this.viewer.camera.quaternion).invert();
    const e = this.location;
    let t, s;
    e.left !== null ? t = e.left : t = this.viewer.el.offsetWidth - X - e.right, e.top !== null ? s = e.top : s = this.viewer.el.offsetHeight - X - e.bottom, this.overlayPass.setViewport(t, s, X, X);
  };
  enable() {
    return this.viewer.renderPipeline.addOverlayPass(this.overlayPass), this.viewer.addEventListener("beforeRender", this._update), this.viewer.render(), this;
  }
  disable() {
    return this.viewer.renderPipeline.removeOverlayPass(this.overlayPass), this.viewer.removeEventListener("beforeRender", this._update), this.viewer.render(), this;
  }
}
const ze = "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;", ms = ze + "z-index:0;", fs = ze + "z-index:1;";
class gs {
  el;
  css2dRenderer = null;
  css3dRenderer = null;
  constructor(e) {
    this.el = e, getComputedStyle(e).position === "static" && (e.style.position = "relative");
  }
  initCSS2DRenderer() {
    const e = new Kt();
    return e.setSize(this.el.clientWidth, this.el.clientHeight), e.domElement.style.cssText = fs, this.el.appendChild(e.domElement), this.css2dRenderer = e, e;
  }
  initCSS3DRenderer() {
    const e = new qt();
    return e.setSize(this.el.clientWidth, this.el.clientHeight), e.domElement.style.cssText = ms, this.el.appendChild(e.domElement), this.css3dRenderer = e, e;
  }
  createCSS2DObject(e) {
    return this.css2dRenderer || this.initCSS2DRenderer(), new Qt(e);
  }
  createCSS25DObject(e) {
    return this.css3dRenderer || this.initCSS3DRenderer(), new Xt(e);
  }
  createCSS3DObject(e) {
    return this.css3dRenderer || this.initCSS3DRenderer(), new Yt(e);
  }
  render(e, t) {
    this.css2dRenderer && this.css2dRenderer.render(e, t), this.css3dRenderer && this.css3dRenderer.render(e, t);
  }
  resize(e, t) {
    this.css2dRenderer && this.css2dRenderer.setSize(e, t), this.css3dRenderer && this.css3dRenderer.setSize(e, t);
  }
  dispose() {
    this.css2dRenderer && (this.el.removeChild(this.css2dRenderer.domElement), this.css2dRenderer = null), this.css3dRenderer && (this.el.removeChild(this.css3dRenderer.domElement), this.css3dRenderer = null);
  }
}
class ys {
  el;
  renderer;
  container;
  drawCallsText;
  frameCallsText;
  trianglesText;
  pointsText;
  linesText;
  timestampText;
  _enabled = !1;
  constructor(e, t) {
    this.el = e, this.renderer = t;
    const s = document.createElement("div");
    s.style.position = "absolute", s.style.left = "12px", s.style.bottom = "12px", s.style.fontSize = "12px", s.style.color = "#fff", s.style.pointerEvents = "none", this.container = s;
    function n(r, o = !0) {
      const a = document.createElement("span");
      return o && (a.style.marginLeft = "6px"), a.innerText = r, a;
    }
    function i() {
      return document.createElement("br");
    }
    this.drawCallsText = n("0"), this.frameCallsText = n("0"), this.trianglesText = n("0"), this.linesText = n("0"), this.pointsText = n("0"), this.timestampText = n("0"), this.container.appendChild(n("draw calls", !1)), this.container.appendChild(this.drawCallsText), this.container.appendChild(i()), this.container.appendChild(n("frame calls", !1)), this.container.appendChild(this.frameCallsText), this.container.appendChild(i()), this.container.appendChild(n("triangles", !1)), this.container.appendChild(this.trianglesText), this.container.appendChild(i()), this.container.appendChild(n("points", !1)), this.container.appendChild(this.pointsText), this.container.appendChild(i()), this.container.appendChild(n("lines", !1)), this.container.appendChild(this.linesText), this.container.appendChild(i()), this.container.appendChild(n("timestamp", !1)), this.container.appendChild(this.timestampText), this.container.appendChild(i());
  }
  update() {
    if (this._enabled) {
      const { render: e } = this.renderer.info;
      this.drawCallsText.innerText = e.drawCalls.toString(), this.frameCallsText.innerText = e.frameCalls.toString(), this.trianglesText.innerText = e.triangles.toString(), this.pointsText.innerText = e.points.toString(), this.linesText.innerText = e.lines.toString(), this.renderer.resolveTimestampsAsync(tt.RENDER).then((t) => {
        this.timestampText.innerText = t?.toFixed(2) ?? "0";
      });
    }
  }
  enable() {
    this._enabled = !0, this.el.appendChild(this.container);
  }
  disable() {
    this._enabled = !1, this.container.remove();
  }
  dispose() {
    this.disable();
  }
}
st.enabled = !0;
class hn extends Ee {
  el;
  renderer;
  scene;
  camera;
  info;
  controls;
  renderPipeline;
  timer;
  roomEnvironment;
  interactionManager;
  objectManager;
  viewerHelper;
  cssRenderer;
  frameCount = 1;
  frameloop = "demand";
  constructor({ el: e, rendererOptions: t }) {
    super(), this.el = e, this.renderer = this._initRenderer(t), this.scene = this.createScene(), this.camera = this.createPerspectiveCamera(), this.info = new ys(this.el, this.renderer), this.controls = new ls(this.camera, this.renderer.domElement), this.renderPipeline = new cs(this.renderer, this.scene, this.camera), this.timer = new nt(), this.roomEnvironment = new ps(this.renderer), this.interactionManager = new os(this.renderer.domElement, this.scene, this.camera), this.objectManager = new as(), this.viewerHelper = new us(this), this.cssRenderer = new gs(this.el), window.addEventListener("resize", this.onWindowResize);
  }
  onWindowResize = () => {
    const e = this.el.clientWidth, t = this.el.clientHeight;
    this.camera instanceof Y ? (this.camera.aspect = e / t, this.camera.updateProjectionMatrix()) : this.camera instanceof J && (this.camera.left = -e / 2, this.camera.right = e / 2, this.camera.top = t / 2, this.camera.bottom = -t / 2, this.camera.updateProjectionMatrix()), this.renderer.setSize(e, t), this.cssRenderer.resize(e, t), this.render();
  };
  async init() {
    await this.renderer.init(), this.roomEnvironment.update(), this.scene.environment = this.roomEnvironment.envMap;
  }
  setCamera(e) {
    this.camera = e, this.controls.camera = e, this.interactionManager.setCamera(e), this.renderPipeline.setCamera(e), this.onWindowResize(), this.dispatchEvent({ type: "cameraChange", camera: e });
  }
  setCameraByType(e) {
    e === "perspective" && !(this.camera instanceof Y) ? this.setCamera(this.createPerspectiveCamera()) : e === "orthographic" && !(this.camera instanceof J) && this.setCamera(this.createOrthographicCamera());
  }
  render(e = 1) {
    return this.frameCount += e, new Promise((t) => {
      const s = () => {
        this.removeEventListener("afterRender", s), t();
      };
      this.addEventListener("afterRender", s);
    });
  }
  animate = (e) => {
    this.timer.update(e);
    const t = this.timer.getDelta();
    this.dispatchEvent({ type: "beforeControlsUpdate", time: e, delta: t });
    let s = this.controls.update(t);
    this.dispatchEvent({ type: "afterControlsUpdate", time: e, delta: t }), this.frameCount > 0 && (this.frameCount--, s = !0), this.frameloop === "always" && (s = !0), s && (this.dispatchEvent({ type: "beforeRender", time: e, delta: t }), this.renderer.info.reset(), this.renderPipeline.render(), this.cssRenderer.render(this.scene, this.camera), this.info.update(), this.dispatchEvent({ type: "afterRender", time: e, delta: t }));
  };
  _initRenderer(e) {
    const t = new it({
      logarithmicDepthBuffer: !0,
      antialias: !1,
      depth: !1,
      trackTimestamp: !0,
      ...e
    });
    return t.setSize(this.el.clientWidth, this.el.clientHeight), t.shadowMap.enabled = !0, t.shadowMap.type = rt, t.toneMapping = ot, t.toneMappingExposure = 1, t.info.autoReset = !1, t.setPixelRatio(window.devicePixelRatio), t.setAnimationLoop(this.animate), this.el.appendChild(t.domElement), t;
  }
  createScene() {
    const e = new at();
    return e.background = new _(0), e;
  }
  createPerspectiveCamera() {
    const e = new Y(50, this.el.clientWidth / this.el.clientHeight, 0.1, 1e5);
    return e.position.setScalar(5), e;
  }
  createOrthographicCamera() {
    const e = new J(
      -this.el.clientWidth / 2,
      this.el.clientWidth / 2,
      this.el.clientHeight / 2,
      -this.el.clientHeight / 2,
      0.1,
      1e5
    );
    return e.position.setScalar(5), e;
  }
  /**
   * Manually trigger a resize update.
   */
  resize(e, t) {
    e !== void 0 && t !== void 0 && (this.el.style.width = `${e}px`, this.el.style.height = `${t}px`), this.onWindowResize();
  }
  /**
   * Capture a screenshot of the current render.
   */
  async screenshot(e = {}) {
    const { type: t = "image/png", quality: s = 1 } = e, n = this.el.clientWidth, i = this.el.clientHeight, r = e.width && e.height;
    r && this.renderer.setSize(e.width, e.height), await this.render();
    const o = this.renderer.domElement.toDataURL(t, s);
    return r && (this.renderer.setSize(n, i), this.onWindowResize()), o;
  }
  /**
   * Set the scene background color, texture, or null.
   */
  setBackground(e) {
    e === null ? this.scene.background = null : e instanceof _ || typeof e == "number" || typeof e == "string" ? this.scene.background = new _(e) : this.scene.background = e, this.render();
  }
  /**
   * Set the scene environment map for reflections / IBL.
   */
  setEnvironment(e) {
    this.scene.environment = e, this.render();
  }
  /**
   * Enable shadow rendering.
   */
  enableShadow() {
    this.renderer.shadowMap.enabled = !0, this.render();
  }
  /**
   * Disable shadow rendering.
   */
  disableShadow() {
    this.renderer.shadowMap.enabled = !1, this.render();
  }
  /**
   * Enable linear fog.
   */
  enableFog(e = {}) {
    const { color: t = 13421772, near: s = 10, far: n = 100 } = e;
    this.scene.fog = new ct(t, s, n), this.render();
  }
  /**
   * Enable exponential fog.
   */
  enableFogExp2(e = {}) {
    const { color: t = 13421772, density: s = 0.01 } = e;
    this.scene.fog = new ht(t, s), this.render();
  }
  /**
   * Disable fog.
   */
  disableFog() {
    this.scene.fog = null, this.render();
  }
  dispose() {
    this.el.removeChild(this.renderer.domElement), window.removeEventListener("resize", this.onWindowResize), this.info.dispose(), this.interactionManager.dispose(), this.roomEnvironment.dispose(), this.cssRenderer.dispose(), this.renderPipeline.dispose(), this.renderer.dispose();
  }
}
class ws extends je {
  constructor(e) {
    super(e);
  }
  parse(e, t, s, n) {
    if (bs(e.slice(0, 8)) === "SBMG----") {
      const r = vs(e.slice(8));
      return super.parse(r, t, s, n);
    } else
      return super.parse(e, t, s, n);
  }
}
function bs(h) {
  return new TextDecoder().decode(new Uint8Array(h));
}
function vs(h) {
  const e = new DataView(h);
  for (let t = 0; t < e.byteLength; t++) {
    const s = e.getUint8(t), n = (s >> 4 & 15) + (s << 4 & 240);
    e.setUint8(t, n);
  }
  return e.buffer;
}
const xs = 8, Cs = 130, xe = 66, Ss = "SBK-----", Ts = "SBM-----", De = new TextDecoder(), Ms = new TextEncoder();
function _s(h) {
  let e = xs;
  const t = new Uint8Array(h, 0, e);
  if (De.decode(t) !== Ss)
    return h;
  e += Cs;
  const n = new Uint8Array(h, 0, e);
  if (n[40] === 1) {
    const r = Ms.encode(Ts), o = new Uint8Array([n[41]]), a = Es(n), c = Ps(a);
    let l = xe % c.length;
    const d = e + xe, u = new Uint8Array(h, d), p = new Uint8Array(u.length);
    for (let b = 0; b < u.length; b++)
      p[b] = u[b] ^ c[l], l = (l + 1) % c.length;
    const f = new Uint8Array(r.length + o.length + p.length);
    return f.set(r), f.set(o, r.length), f.set(p, r.length + o.length), f.buffer;
  }
}
function Es(h) {
  const e = new Uint8Array(128);
  return e.set(h.slice(42, 74), 0), e.set(h.slice(74, 138), 32), e.set(h.slice(8, 40), 96), e;
}
function Ps(h) {
  const e = new Uint8Array(64);
  return e.set(h.slice(0, 8), 0), e.set(h.slice(24, 32), 8), e.set(h.slice(40, 56), 16), e.set(h.slice(64, 88), 32), e.set(h.slice(96, 104), 56), e;
}
const Os = (h, e, t) => {
  const s = h.buffer.slice(t, t + e);
  let n = De.decode(s);
  return n = n.replace("\\", "/"), n.startsWith("Maps/") || (n = `Maps/${n}`), n;
}, Bs = (h, e, t) => {
  const [s, n, i, r, o] = e, a = t || r < 1;
  return new R({
    name: h,
    color: new _(s, n, i),
    opacity: r,
    transparent: a,
    alphaTest: 0.01,
    side: o
  });
}, As = (h) => h?.toLowerCase().endsWith(".png") ?? !1;
class Is {
  data;
  options;
  textureLoader;
  littleEndian = !0;
  materials = /* @__PURE__ */ new Map();
  constructor(e, t) {
    this.data = e, this.options = t, this.textureLoader = new Ae(t.manager), this.textureLoader.setCrossOrigin(t.crossOrigin), this.textureLoader.setRequestHeader(t.requestHeader);
  }
  parse(e, t) {
    let s = this.data;
    const n = _s(this.data);
    n && (s = n);
    const i = new DataView(s);
    let r = 8;
    const o = i.getUint8(r);
    r += 1, o === 1 ? this._parseV2(i, r, e) : o === 2 ? this._parseV2(i, r, e) : o === 3 ? this._parseV3(i, r, e) : t?.(new Error(`SBMLoader: Unsupported SBM version: ${o}`));
  }
  _parseV2(e, t, s) {
    const n = new L(), i = e.getUint16(t, this.littleEndian);
    t += 2;
    const r = e.getUint16(t, this.littleEndian);
    t += 2;
    for (let o = 0; o < i; ++o) {
      const a = e.getUint16(t, this.littleEndian).toString();
      t += 2, t += 4, t += 4, t += 4, t += 4;
      const c = e.getFloat32(t, this.littleEndian);
      t += 4;
      const l = e.getFloat32(t, this.littleEndian);
      t += 4;
      const d = e.getFloat32(t, this.littleEndian);
      t += 4;
      const u = e.getFloat32(t, this.littleEndian);
      t += 4, t += 4, t += 4, t += 4, t += 4;
      let p = e.getUint8(t);
      t += 1, p === 0 ? p = dt : p === 1 ? p = pt : p === 2 && (p = ut);
      const f = e.getUint16(t, this.littleEndian);
      t += 2;
      const b = f > 0 ? Os(e, f, t) : "";
      if (t += f, !this.materials.has(a)) {
        const x = Bs(a, [c, l, d, u, p], As(b));
        this.materials.set(a, x), b && this.options.path && this.textureLoader.load(I.resolveURL(b, this.options.path), (y) => {
          y.colorSpace = Ie, y.wrapS = pe, y.wrapT = pe, y.flipY = !1, y.anisotropy = 16, x.map = y;
        });
      }
    }
    for (let o = 0; o < r; ++o) {
      const a = e.getUint16(t, this.littleEndian).toString();
      t += 2;
      const c = e.getUint16(t, this.littleEndian).toString();
      t += 2;
      const l = [], d = [], u = [], p = [], f = e.getUint16(t, this.littleEndian);
      if (t += 2, f > 0)
        for (let g = 0; g < f; g++) {
          const v = new w();
          v.setX(e.getFloat32(t, this.littleEndian)), t += 4, v.setY(e.getFloat32(t, this.littleEndian)), t += 4, v.setZ(e.getFloat32(t, this.littleEndian)), t += 4, l.push(v);
        }
      const b = e.getUint16(t, this.littleEndian);
      if (t += 2, b > 0)
        for (let g = 0; g < b; g++)
          t += 4, t += 4, t += 4;
      const T = e.getUint16(t, this.littleEndian);
      if (t += 2, T > 0)
        for (let g = 0; g < T; g++) {
          const v = new C();
          v.setX(e.getFloat32(t, this.littleEndian)), t += 4, v.setY(e.getFloat32(t, this.littleEndian)), t += 4, d.push(v);
        }
      const x = e.getUint16(t, this.littleEndian);
      if (t += 2, x > 0)
        for (let g = 0; g < x; g++) {
          const v = e.getUint16(t, this.littleEndian);
          t += 2;
          const N = e.getUint16(t, this.littleEndian);
          t += 2;
          const j = e.getUint16(t, this.littleEndian);
          t += 2;
          const P = [v, N, j];
          u.push(P), d.length > 0 && p.push([d[P[0]], d[P[1]], d[P[2]]]);
        }
      const y = [], M = [];
      for (let g = 0; g < u.length; g++) {
        const v = u[g], N = l[v[0]], j = l[v[1]], P = l[v[2]];
        y.push(...N.toArray(), ...j.toArray(), ...P.toArray());
        let q = new C(), $ = new C(), D = new C();
        const U = p[g];
        U !== void 0 && (q = U[0], $ = U[1], D = U[2]), M.push(...q.toArray(), ...$.toArray(), ...D.toArray());
      }
      const O = new Float32Array(y), B = new Float32Array(M), E = new W();
      if (O.length > 0 && E.setAttribute("position", new ue(O, 3)), B.length > 0 && E.setAttribute("uv", new ue(B, 2)), E.computeVertexNormals(), this.materials.has(c)) {
        const g = new H(E, this.materials.get(c));
        g.name = a, g.castShadow = !0, g.receiveShadow = !0, n.add(g);
      }
    }
    s(n);
  }
  _parseV3(e, t, s) {
    const n = new L();
    console.warn("SBMLoader: SBM version 3 is not supported yet."), s(n);
  }
}
class Ls extends lt {
  load(e, t, s, n) {
    let i;
    if (this.resourcePath !== "")
      i = this.resourcePath;
    else if (this.path !== "") {
      const a = I.extractUrlBase(e);
      i = I.resolveURL(a, this.path);
    } else
      i = I.extractUrlBase(e);
    this.manager.itemStart(e);
    const r = (a) => {
      n ? n(a) : console.error(a), this.manager.itemError(e), this.manager.itemEnd(e);
    }, o = new Be(this.manager);
    o.setPath(this.path), o.setResponseType("arraybuffer"), o.setRequestHeader(this.requestHeader), o.setWithCredentials(this.withCredentials), o.load(
      e,
      (a) => {
        try {
          this.parse(
            a,
            i,
            (c) => {
              t(c), this.manager.itemEnd(e);
            },
            r
          );
        } catch (c) {
          r(c);
        }
      },
      s,
      r
    );
  }
  parse(e, t, s, n) {
    const i = new TextDecoder().decode(e.slice(0, 8));
    if (i !== "SBK-----" && i !== "SBM-----") {
      n?.(new Error(`SBMLoader: Invalid SBM format: ${i}`));
      return;
    }
    new Is(e, {
      path: t,
      crossOrigin: this.crossOrigin,
      requestHeader: this.requestHeader,
      manager: this.manager
    }).parse(s, n);
  }
  parseAsync(e, t) {
    return new Promise((s, n) => {
      this.parse(
        e,
        t,
        (i) => {
          s(i);
        },
        (i) => {
          n(i);
        }
      );
    });
  }
}
class z {
  static CACHE_NAME = "u-space-model-loader-cache";
  static fileLoader = new Be().setResponseType("arraybuffer");
  static dracoLoader = new es().setDecoderPath(
    `https://cdn.jsdelivr.net/npm/three@0.${me}.0/examples/jsm/libs/draco/`
  );
  static ktx2Loader = new ts().setTranscoderPath(
    `https://cdn.jsdelivr.net/npm/three@0.${me}.0/examples/jsm/libs/basis/`
  );
  static gltfLoader = new je().setDRACOLoader(z.dracoLoader).setKTX2Loader(z.ktx2Loader).setMeshoptDecoder(be);
  static sbmxLoader = new ws().setDRACOLoader(z.dracoLoader).setKTX2Loader(z.ktx2Loader).setMeshoptDecoder(be);
  static sbmLoader = new Ls();
  static fbxLoader = new Jt();
  static objLoader = new Vt();
  static stlLoader = new Zt();
  static setLoadingManager(e) {
    this.fileLoader.manager = e, this.dracoLoader.manager = e, this.ktx2Loader.manager = e, this.gltfLoader.manager = e, this.sbmxLoader.manager = e, this.sbmLoader.manager = e, this.fbxLoader.manager = e, this.objLoader.manager = e, this.stlLoader.manager = e;
  }
  /**
   * Set the renderer to enable KTX2 support and other renderer-dependent features.
   */
  static async setRenderer(e) {
    await e.init(), this.ktx2Loader.detectSupport(e);
  }
  /**
   * Configure Draco decoder path.
   */
  static setDracoPath(e) {
    this.dracoLoader.setDecoderPath(e);
  }
  /**
   * Configure KTX2 transcoder path.
   */
  static setKTX2Path(e) {
    this.ktx2Loader.setTranscoderPath(e);
  }
  static async loadAsync(e, t = { persistent: !0 }) {
    const s = e.split(".").pop()?.split("?")[0].toLowerCase();
    let n;
    switch (t.persistent && typeof caches < "u" ? n = await this.getPersistentData(e) : n = await this.fileLoader.loadAsync(e), s) {
      case "gltf":
      case "glb":
        const i = await this.gltfLoader.parseAsync(n, I.extractUrlBase(e));
        return i.scene.animations = i.animations, i.scene;
      case "sbmx":
        const r = await this.sbmxLoader.parseAsync(n, I.extractUrlBase(e));
        return r.scene.animations = r.animations, r.scene;
      case "sbm":
        return await this.sbmLoader.parseAsync(n, I.extractUrlBase(e));
      case "fbx":
        return this.fbxLoader.parse(n, I.extractUrlBase(e));
      case "obj":
        const c = new TextDecoder().decode(n);
        return this.objLoader.parse(c);
      case "stl":
        const d = this.stlLoader.parse(n);
        return new H(d, new R());
      default:
        throw new Error(`Unsupported model format: ${s}`);
    }
  }
  static async getPersistentData(e) {
    try {
      const t = await caches.open(this.CACHE_NAME), s = await t.match(e);
      if (s)
        return await s.arrayBuffer();
      const n = await this.fileLoader.loadAsync(e), i = new Response(n);
      return await t.put(e, i), n;
    } catch (t) {
      return console.warn(`[LoaderManager] Failed to use Cache API for ${e}:`, t), await this.fileLoader.loadAsync(e);
    }
  }
}
class ln {
  static textureLoader = new Ae();
  static hdrLoader = new ss();
  static cubeTextureLoader = new mt();
  static setLoadingManager(e) {
    this.textureLoader.manager = e, this.hdrLoader.manager = e, this.cubeTextureLoader.manager = e;
  }
  static async loadAsyncTexture(e) {
    return await this.textureLoader.loadAsync(e);
  }
  static async loadAsyncHDR(e) {
    const t = await this.hdrLoader.loadAsync(e);
    return t.mapping = ft, t;
  }
  static async loadAsyncCubeTexture(e, t) {
    return this.cubeTextureLoader.setPath(e), await this.cubeTextureLoader.loadAsync(t);
  }
}
class G extends H {
  isBaseMesh = !0;
  type = "BaseMesh";
  ignoreInvisibleWhenRaycast = !0;
  constructor(...e) {
    super(...e);
  }
  raycast(e, t) {
    return this.visible === !1 && this.ignoreInvisibleWhenRaycast === !0 ? !1 : super.raycast(e, t);
  }
}
class Ue extends L {
  isBaseGroup = !0;
  type = "BaseGroup";
  ignoreInvisibleWhenRaycast = !0;
  constructor(...e) {
    super(...e);
  }
  raycast(e, t) {
    return this.visible === !1 && this.ignoreInvisibleWhenRaycast === !0 ? !1 : super.raycast(e, t);
  }
}
class Rs extends gt {
  isBaseSprite = !0;
  type = "BaseSprite";
  ignoreInvisibleWhenRaycast = !0;
  constructor(...e) {
    super(...e);
  }
  raycast(e, t) {
    return this.visible === !1 && this.ignoreInvisibleWhenRaycast === !0 ? !1 : super.raycast(e, t);
  }
}
class ie extends Ue {
  isModel = !0;
  type = "Model";
  static memoryCache = /* @__PURE__ */ new Map();
  mixer = null;
  animations = [];
  actions = /* @__PURE__ */ new Map();
  constructor() {
    super();
  }
  async loadAsync(e) {
    const { url: t, cache: s = !0, persistent: n = !0 } = e;
    try {
      let i;
      s ? ie.memoryCache.has(t) ? i = ie.memoryCache.get(t) : (i = z.loadAsync(t, { persistent: n }), ie.memoryCache.set(t, i)) : i = z.loadAsync(t, { persistent: n });
      const r = await i, o = ns(r);
      return this.add(o), o.animations && o.animations.length > 0 && (this.animations = o.animations, this.mixer = new yt(o)), o;
    } catch (i) {
      return console.error(`[Model] Failed to load model from ${t}:`, i), null;
    }
  }
  playAnimation(e, t = {}) {
    if (!this.mixer || this.animations.length === 0) return null;
    const { loop: s = !0, repetitions: n = 1 / 0, timeScale: i = 1, clampWhenFinished: r = !1 } = t;
    let o;
    if (e === void 0 ? o = this.animations[0] : typeof e == "number" ? o = this.animations[e] : o = this.animations.find((c) => c.name === e), !o)
      return console.warn(`[Model] Animation not found: ${e}`), null;
    let a = this.actions.get(o.name);
    return a || (a = this.mixer.clipAction(o), this.actions.set(o.name, a)), a.setLoop(s ? wt : bt, n), a.clampWhenFinished = r, a.timeScale = i, a.reset().play(), a;
  }
  playAllAnimations(e = {}) {
    return this.animations.map((t, s) => this.playAnimation(s, e)).filter((t) => t !== null);
  }
  stopAnimation(e) {
    if (!this.mixer) return;
    if (e === void 0) {
      this.mixer.stopAllAction();
      return;
    }
    let t;
    typeof e == "number" ? t = this.animations[e]?.name : t = e, t && this.actions.get(t)?.stop();
  }
  updateAnimation(e) {
    this.mixer?.update(e);
  }
  /**
   * Get the axis-aligned bounding box of this model.
   */
  getBoundingBox() {
    return new Q().setFromObject(this);
  }
  /**
   * Get the center point of this model's bounding box.
   */
  getCenter() {
    const e = new w();
    return this.getBoundingBox().getCenter(e), e;
  }
  /**
   * Set the material for all meshes in this model.
   */
  setMaterial(e) {
    this.traverse((t) => {
      t instanceof H && (t.material = e);
    });
  }
  static clearMemoryCache() {
    this.memoryCache.clear();
  }
  static async clearPersistentCache() {
    typeof caches < "u" && await caches.delete("u-space-loader-cache");
  }
}
class Ns extends G {
  isSphereMesh = !0;
  type = "SphereMesh";
  constructor({ geometryParameters: e, materialParameters: t } = {}) {
    super(), this.geometry = new vt(
      e?.radius,
      e?.widthSegments,
      e?.heightSegments,
      e?.phiStart,
      e?.phiLength,
      e?.thetaStart,
      e?.thetaLength
    ), this.material = new R(t);
  }
}
class Ce extends G {
  isTubeMesh = !0;
  type = "TubeMesh";
  constructor({ geometryParameters: e, materialParameters: t } = {}) {
    super(), this.geometry = new xt(
      e?.path,
      e?.tubularSegments,
      e?.radius,
      e?.radialSegments,
      e?.closed
    ), this.material = new R(t);
  }
}
class dn extends Ue {
  isTopology = !0;
  type = "Topology";
  // Visuals
  parameters = {
    nodeColor: 255,
    nodeRadius: 0.5,
    edgeColor: 65280,
    edgeRadius: 0.1,
    pathColor: 16711935,
    pathRadius: 0.2
  };
  nodes = /* @__PURE__ */ new Map();
  adjacencyMap = /* @__PURE__ */ new Map();
  graphGroup = null;
  pathMeshes = [];
  constructor(e) {
    super(), e && Object.assign(this.parameters, e);
  }
  /**
   * Add a node to the topology graph.
   * @param id Unique identifier for the node
   * @param position 3D position of the node
   */
  addNode(e, t) {
    this.nodes.has(e) && console.warn(`[Topology] Node ${e} already exists. Overwriting.`), this.nodes.set(e, t), this.adjacencyMap.has(e) || this.adjacencyMap.set(e, /* @__PURE__ */ new Map());
  }
  /**
   * Remove a node from the topology graph.
   * @param id Unique identifier for the node
   */
  removeNode(e) {
    if (!this.nodes.has(e)) {
      console.warn(`[Topology] Node ${e} does not exist.`);
      return;
    }
    this.nodes.delete(e), this.adjacencyMap.delete(e);
  }
  /**
   * Add an edge between two nodes.
   * @param from Node ID
   * @param to Node ID
   * @param weight Cost of the edge. Defaults to Euclidean distance.
   * @param bidirectional If true, adds the reverse edge as well. Default true.
   */
  addEdge(e, t, s, n = !0) {
    const i = this.nodes.get(e), r = this.nodes.get(t);
    if (!i || !r) {
      console.error(`[Topology] Cannot add edge. One or both nodes not found: ${e}, ${t}`);
      return;
    }
    const o = s ?? i.distanceTo(r);
    this.getNeighbors(e)?.set(t, o), n && this.getNeighbors(t)?.set(e, o);
  }
  /**
   * Remove an edge between two nodes.
   * @param from Node ID
   * @param to Node ID
   * @param bidirectional If true, removes the reverse edge as well. Default true.
   */
  removeEdge(e, t, s = !0) {
    this.getNeighbors(e)?.delete(t), s && this.getNeighbors(t)?.delete(e);
  }
  /**
   * Find the shortest path between start and end nodes using Dijkstra's algorithm.
   */
  getShortestPath(e, t) {
    if (!this.nodes.has(e) || !this.nodes.has(t))
      return console.warn("[Topology] Start or End node not found."), [];
    const s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
    for (const [a] of this.nodes)
      s.set(a, 1 / 0), n.set(a, null), i.add(a);
    for (s.set(e, 0); i.size > 0; ) {
      let a = null, c = 1 / 0;
      for (const d of i) {
        const u = s.get(d);
        u < c && (c = u, a = d);
      }
      if (a === null || a === t || c === 1 / 0)
        break;
      i.delete(a);
      const l = this.adjacencyMap?.get(a);
      if (l)
        for (const [d, u] of l) {
          if (!i.has(d)) continue;
          const p = s.get(a) + u;
          p < s.get(d) && (s.set(d, p), n.set(d, a));
        }
    }
    const r = [];
    let o = t;
    if (n.get(t) === null && e !== t)
      return [];
    for (; o !== null; ) {
      const a = this.nodes.get(o);
      a && r.unshift(a), o = n.get(o) || null;
    }
    return r;
  }
  /**
   * Renders the entire topology graph structure using TubeGeometry and Spheres.
   */
  renderGraph() {
    this.clearGraph(), this.graphGroup = new L();
    const e = new Ns({
      geometryParameters: {
        radius: this.parameters.nodeRadius,
        widthSegments: 16,
        heightSegments: 16
      },
      materialParameters: {
        color: this.parameters.nodeColor
      }
    });
    this.nodes.forEach((s, n) => {
      const i = e.clone();
      i.position.copy(s), Object.assign(i.userData, { id: n, type: "node" }), this.graphGroup.add(i);
    });
    const t = /* @__PURE__ */ new Set();
    this.adjacencyMap.forEach((s, n) => {
      s.forEach((i, r) => {
        const o = [n, r].sort().join("-");
        if (t.has(o)) return;
        t.add(o);
        const a = this.nodes.get(n), c = this.nodes.get(r);
        if (a && c) {
          const l = new Ct(a, c), d = new Ce({
            geometryParameters: {
              path: l,
              tubularSegments: 1,
              radius: this.parameters.edgeRadius,
              radialSegments: 8,
              closed: !1
            },
            materialParameters: {
              color: this.parameters.edgeColor
            }
          });
          Object.assign(d.userData, { from: n, to: r, weight: i, type: "edge" }), this.graphGroup.add(d);
        }
      });
    }), this.add(this.graphGroup);
  }
  clearGraph() {
    this.graphGroup && (this.remove(this.graphGroup), this.graphGroup.traverse((e) => {
      e instanceof H && (e.geometry.dispose(), e.material.dispose());
    }), this.graphGroup = null);
  }
  /**
   * Visualizes a path using TubeGeometry (CatmullRomCurve3).
   */
  renderPath(e, t = this.parameters.pathColor) {
    if (e.length < 2) return;
    const s = new St(e, !1, "catmullrom", 0), n = new Ce({
      geometryParameters: {
        path: s,
        tubularSegments: e.length * 10,
        radius: this.parameters.pathRadius,
        closed: !1
      },
      materialParameters: {
        color: t
      }
    });
    return this.add(n), this.pathMeshes.push(n), n;
  }
  clearPaths() {
    this.pathMeshes.forEach((e) => {
      this.remove(e), e.geometry.dispose(), e.material.dispose();
    }), this.pathMeshes = [];
  }
  /** Export nodes and edges as a JSON-serializable object. */
  exportData() {
    const e = {};
    this.nodes.forEach((n, i) => {
      e[i] = { x: n.x, y: n.y, z: n.z };
    });
    const t = [], s = /* @__PURE__ */ new Set();
    return this.adjacencyMap.forEach((n, i) => {
      n.forEach((r, o) => {
        const a = [i, o].sort().join("-");
        s.has(a) || (s.add(a), t.push({ from: i, to: o, weight: r }));
      });
    }), { nodes: e, edges: t };
  }
  /**
   * Load topology from a previously exported data object.
   * Replaces all current nodes, edges, and path meshes, then re-renders the graph.
   */
  importData(e) {
    this.clearGraph(), this.clearPaths(), this.nodes.clear(), this.adjacencyMap.clear(), Object.entries(e.nodes).forEach(([t, s]) => {
      this.addNode(t, new w(s.x, s.y, s.z));
    }), e.edges.forEach(({ from: t, to: s, weight: n }) => {
      this.addEdge(t, s, n);
    }), this.renderGraph();
  }
  dispose() {
    this.clearGraph(), this.clearPaths();
  }
  getNeighbors(e) {
    return this.adjacencyMap.get(e);
  }
}
class pn extends Rs {
  isPoi = !0;
  type = "Poi";
  parameters = {
    img: "",
    text: "",
    fontSize: 32,
    fontFamily: "Arial",
    color: "#ffffff",
    iconSize: 64,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderRadius: 8,
    textPosition: "right",
    scaleFactor: 0.01
  };
  _canvas = document.createElement("canvas");
  _lastParametersJSON = "";
  constructor(e = {}) {
    super(new Tt()), Object.assign(this.parameters, e), this.updateAsync();
  }
  /**
   * Update the POI with new parameters
   * @param parameters Partial POI parameters
   */
  async updateAsync(e = {}) {
    Object.assign(this.parameters, e);
    const t = JSON.stringify(this.parameters);
    if (t === this._lastParametersJSON) return;
    this._lastParametersJSON = t;
    const s = this._canvas, n = s.getContext("2d");
    if (!n) return;
    n.font = `${this.parameters.fontSize}px ${this.parameters.fontFamily}`;
    let i = null;
    this.parameters.img && (i = await this._loadImage(this.parameters.img));
    const { text: r, fontSize: o, color: a, iconSize: c, padding: l, backgroundColor: d, borderRadius: u, textPosition: p, scaleFactor: f } = this.parameters, b = n.measureText(r), T = r ? b.width : 0, x = r ? o : 0;
    let y = 0, M = 0, O = 0, B = 0, E = 0, g = 0;
    const v = !!i, N = !!r;
    if (v && N)
      switch (p) {
        case "top":
          y = Math.max(c, T), M = c + l + x, E = (y - T) / 2, g = x / 2, O = (y - c) / 2, B = x + l;
          break;
        case "bottom":
          y = Math.max(c, T), M = c + l + x, O = (y - c) / 2, B = 0, E = (y - T) / 2, g = c + l + x / 2;
          break;
        case "left":
          y = c + l + T, M = Math.max(c, x), E = 0, g = M / 2, O = T + l, B = (M - c) / 2;
          break;
        default:
          y = c + l + T, M = Math.max(c, x), O = 0, B = (M - c) / 2, E = c + l, g = M / 2;
          break;
      }
    else v ? (y = c, M = c, O = 0, B = 0) : N && (y = T, M = x, E = 0, g = x / 2);
    const j = y + l * 2, P = M + l * 2;
    if (s.width = j, s.height = P, n.font = `${o}px ${this.parameters.fontFamily}`, d && (n.fillStyle = d, this._drawRoundedRect(n, 0, 0, j, P, u), n.fill()), v && n.drawImage(i, O + l, B + l, c, c), N) {
      n.fillStyle = a;
      const D = n.measureText(r), U = D.actualBoundingBoxAscent + D.actualBoundingBoxDescent, qe = D.actualBoundingBoxAscent - U / 2;
      n.textBaseline = "alphabetic", n.fillText(r, E + l, g + l + qe);
    }
    const q = this.material.map, $ = new Mt(s);
    $.colorSpace = Ie, this.material.map = $, q?.dispose(), this.scale.set(j * f, P * f, 1);
  }
  _loadImage(e) {
    return new Promise((t, s) => {
      if (typeof e == "string") {
        const n = new Image();
        n.crossOrigin = "Anonymous", n.onload = () => t(n), n.onerror = () => s(new Error(`Failed to load image: ${e}`)), n.src = e;
      } else
        t(e);
    });
  }
  _drawRoundedRect(e, t, s, n, i, r) {
    e.beginPath(), e.moveTo(t + r, s), e.lineTo(t + n - r, s), e.quadraticCurveTo(t + n, s, t + n, s + r), e.lineTo(t + n, s + i - r), e.quadraticCurveTo(t + n, s + i, t + n - r, s + i), e.lineTo(t + r, s + i), e.quadraticCurveTo(t, s + i, t, s + i - r), e.lineTo(t, s + r), e.quadraticCurveTo(t, s, t + r, s), e.closePath();
  }
  dispose() {
    this.material.map?.dispose(), this.material.dispose();
  }
}
class ke extends G {
  isShapeMesh = !0;
  type = "ShapeMesh";
  constructor({ geometryParameters: e, materialParameters: t } = {}) {
    super(), this.geometry = new _t(e?.shape, e?.curveSegments), this.material = new R(t), this.geometry.rotateX(-Math.PI / 2);
  }
  static createFromPoints(e, t = {}) {
    return new ke({
      ...t,
      geometryParameters: {
        ...t.geometryParameters,
        shape: new Le(e.map((s) => new C(s.x, -s.z)))
      }
    });
  }
}
class Fe extends G {
  isExtrudeMesh = !0;
  type = "ExtrudeMesh";
  constructor({ geometryParameters: e, materialParameters: t } = {}) {
    super(), this.geometry = new Et(e?.shape, e?.options), this.material = new R(t), this.geometry.rotateX(-Math.PI / 2);
  }
  static createFromPoints(e, t = {}) {
    return e && e.length === 0 && (e = void 0), new Fe({
      ...t,
      geometryParameters: {
        ...t.geometryParameters,
        shape: new Le(e?.map((s) => new C(s.x, -s.z)))
      }
    });
  }
}
class un extends G {
  isPlaneMesh = !0;
  type = "PlaneMesh";
  constructor({ geometryParameters: e, materialParameters: t } = {}) {
    super(), this.geometry = new Pt(
      e?.width,
      e?.height,
      e?.widthSegments,
      e?.heightSegments
    ), this.material = new R(t);
  }
}
class mn extends G {
  isCircleMesh = !0;
  type = "CircleMesh";
  constructor({ geometryParameters: e, materialParameters: t } = {}) {
    super(
      new Ot(
        e?.radius,
        e?.segments,
        e?.thetaStart,
        e?.thetaLength
      ),
      new R(t)
    ), this.geometry.rotateX(-Math.PI / 2);
  }
}
class F {
  static traverseMeshes(e, t) {
    e.traverse((s) => {
      s instanceof H && t(s);
    });
  }
}
class fn {
  static flow(e = {}) {
    const { baseColor: t = 16777215, flowColor: s = 65280, speed: n = 1, scale: i = 3, intensity: r = 4 } = e, o = k(new _(t)), a = k(new _(s)), c = ge().x.mul(i).sub(ee.mul(n)), l = te(de(c).add(1).mul(0.5), r);
    return se(o, a, l);
  }
  static breathe(e = {}) {
    const { baseColor: t = 16777215, breathColor: s = 65280, speed: n = 1, intensity: i = 2 } = e, r = k(new _(t)), o = k(new _(s)), a = de(ee.mul(n)).add(1).mul(0.5), c = te(a, i);
    return se(r, o, c);
  }
  static fluid(e = {}) {
    const {
      baseColor: t = 16777215,
      flowColor: s = 255,
      speed: n = 1,
      scale: i = 1,
      intensity: r = 1,
      distortion: o = 0.5
    } = e, a = k(new _(t)), c = k(new _(s)), l = ge().mul(i), d = ee.mul(n), u = ye(l.add(d), 1, 0), p = l.add(u.mul(o)), f = ye(p, 1, 0).add(1).mul(0.5), b = te(f, r);
    return se(a, c, b);
  }
}
function gn(h) {
}
const ce = "uSpaceHighlight", K = `${ce}/enabled`, He = `${ce}/opacity`, Ge = `${ce}/color`, $e = `${ce}/overwrite`, he = "uSpaceBreathe", oe = `${he}/enabled`, We = `${he}/color`, Ke = `${he}/speed`, Qe = `${he}/intensity`, ae = /* @__PURE__ */ new WeakMap(), js = Re(() => {
  const h = A(K, "uint"), e = A(Ge, "uint"), t = A($e, "uint"), s = Me(e), n = we.mul(s), i = ne(t.greaterThan(0), s, n), r = ne(h.greaterThan(0), i, we), o = A(oe, "uint"), a = A(We, "uint"), c = A(Ke, "float"), l = A(Qe, "float"), d = Me(a), u = de(ee.mul(c)).add(1).mul(0.5), p = te(u, l), f = se(r, d, p);
  return ne(o.greaterThan(0), f, r);
})(), zs = Re(() => {
  const h = A(K, "uint"), e = A(He, "float");
  return ne(h.greaterThan(0), e, Ut);
})();
function Se(h) {
  const e = h.material;
  if (!e || Array.isArray(e)) return;
  let t = ae.get(e);
  t || (t = {
    colorNode: e.colorNode,
    opacityNode: e.opacityNode,
    transparent: e.transparent,
    depthWrite: e.depthWrite,
    activeMeshes: /* @__PURE__ */ new Set()
  }, ae.set(e, t)), t.activeMeshes.add(h), e.transparent = !0, e.colorNode = js, e.opacityNode = zs, e.needsUpdate = !0;
}
function Te(h) {
  const e = h.userData[K], t = h.userData[oe];
  if (e || t) return;
  const s = h.material;
  if (!s || Array.isArray(s)) return;
  const n = ae.get(s);
  n && (n.activeMeshes.delete(h), !(n.activeMeshes.size > 0) && (s.colorNode = n.colorNode, s.opacityNode = n.opacityNode, s.transparent = n.transparent, s.depthWrite = n.depthWrite, s.needsUpdate = !0, ae.delete(s)));
}
class re {
  static highlightColor(e, t = {}) {
    const s = Array.isArray(e) ? e : [e], { opacity: n = 0.5, color: i = 16711680, overwrite: r = !1, depthWrite: o } = t, a = new _(i).getHex();
    for (const c of s)
      F.traverseMeshes(c, (l) => {
        if (l.userData[K] = 1, l.userData[He] = n, l.userData[Ge] = a, l.userData[$e] = r ? 1 : 0, Se(l), o !== void 0) {
          const d = l.material;
          d && !Array.isArray(d) && (d.depthWrite = o);
        }
      });
  }
  static removeHighlightColor(e) {
    const t = Array.isArray(e) ? e : [e];
    for (const s of t)
      F.traverseMeshes(s, (n) => {
        n.userData[K] = 0, Te(n);
      });
  }
  static breatheColor(e, t = {}) {
    const s = Array.isArray(e) ? e : [e], n = Object.assign(
      {
        color: 65280,
        speed: 1,
        intensity: 2
      },
      t
    );
    n.color = new _(n.color).getHex();
    for (const i of s)
      F.traverseMeshes(i, (r) => {
        r.userData[oe] = 1, r.userData[We] = n.color, r.userData[Ke] = n.speed, r.userData[Qe] = n.intensity, Se(r);
      });
  }
  static removeBreatheColor(e) {
    const t = Array.isArray(e) ? e : [e];
    for (const s of t)
      F.traverseMeshes(s, (n) => {
        n.userData[oe] = 0, Te(n);
      });
  }
  /**
   * Enable wireframe mode on object(s).
   */
  static wireframe(e, t = !0) {
    const s = Array.isArray(e) ? e : [e];
    for (const n of s)
      F.traverseMeshes(n, (i) => {
        const r = i.material;
        !r || Array.isArray(r) || (r.wireframe = t, r.needsUpdate = !0);
      });
  }
  /**
   * Remove wireframe mode.
   */
  static removeWireframe(e) {
    re.wireframe(e, !1);
  }
  /**
   * Fade in object(s) from fully transparent to original opacity.
   * Returns a promise that resolves when animation is complete.
   */
  static fadeIn(e, t = {}) {
    const { duration: s = 500 } = t;
    return re._fade(e, 0, 1, s);
  }
  /**
   * Fade out object(s) to fully transparent.
   * Returns a promise that resolves when animation is complete.
   */
  static fadeOut(e, t = {}) {
    const { duration: s = 500 } = t;
    return re._fade(e, 1, 0, s);
  }
  static _fade(e, t, s, n) {
    const i = Array.isArray(e) ? e : [e], r = [];
    for (const o of i)
      F.traverseMeshes(o, (a) => {
        const c = a.material;
        !c || Array.isArray(c) || (c.transparent = !0, c.opacity = t, c.needsUpdate = !0, r.push({ material: c, targetOpacity: s }));
      });
    return r.length === 0 ? Promise.resolve() : new Promise((o) => {
      const a = performance.now();
      let c = 0;
      const l = () => {
        const d = performance.now() - a, u = Math.min(d / n, 1);
        if (!i[0].parent) {
          cancelAnimationFrame(c), o();
          return;
        }
        for (const { material: f, targetOpacity: b } of r)
          f.opacity = t + (b - t) * u, f.needsUpdate = !0;
        if (u < 1)
          c = requestAnimationFrame(l);
        else {
          if (s >= 1)
            for (const { material: f } of r)
              f.transparent = !1;
          o();
        }
      };
      c = requestAnimationFrame(l);
    });
  }
}
const Me = (h) => {
  const e = h.shiftRight(16).bitAnd(255).toFloat().div(255), t = h.shiftRight(8).bitAnd(255).toFloat().div(255), s = h.bitAnd(255).toFloat().div(255);
  return kt(e, t, s);
};
class Ds extends is {
  viewer;
  constructor(e, t) {
    super(t), this.viewer = e;
  }
  _update = ({ time: e }) => {
    this.update(e) && this.viewer.render();
  };
  easingByMode(e) {
    const t = Us[e];
    return super.easing(t);
  }
  start(e, t) {
    return this.viewer.addEventListener("afterControlsUpdate", this._update), super.start(e, t);
  }
  stop() {
    return this.viewer.removeEventListener("afterControlsUpdate", this._update), super.stop();
  }
}
function yn(h, e, t, s = {}, n, i) {
  return new Promise((r, o) => {
    const { duration: a = 1e3, delay: c = 0, repeat: l = !1, mode: d = "Linear.None", yoyo: u = !1 } = s, p = new Ds(h, e).to(t, a).easingByMode(d).delay(c).onUpdate((f) => {
      n?.(f, p);
    }).onComplete(() => {
      r();
    }).onStop(() => {
      o("animation stop");
    }).onStart(() => {
      i?.(p);
    });
    typeof l == "number" ? p.repeat(l) : typeof l == "boolean" && l && p.repeat(1 / 0), u && p.repeatDelay(20), p.yoyo(u), p.start();
  });
}
const Us = {
  "Linear.None": m.Linear.None,
  "Quadratic.In": m.Quadratic.In,
  "Quadratic.Out": m.Quadratic.Out,
  "Quadratic.InOut": m.Quadratic.InOut,
  "Cubic.In": m.Cubic.In,
  "Cubic.Out": m.Cubic.Out,
  "Cubic.InOut": m.Cubic.InOut,
  "Quartic.In": m.Quartic.In,
  "Quartic.Out": m.Quartic.Out,
  "Quartic.InOut": m.Quartic.InOut,
  "Quintic.In": m.Quintic.In,
  "Quintic.Out": m.Quintic.Out,
  "Quintic.InOut": m.Quintic.InOut,
  "Sinusoidal.In": m.Sinusoidal.In,
  "Sinusoidal.Out": m.Sinusoidal.Out,
  "Sinusoidal.InOut": m.Sinusoidal.InOut,
  "Exponential.In": m.Exponential.In,
  "Exponential.Out": m.Exponential.Out,
  "Exponential.InOut": m.Exponential.InOut,
  "Circular.In": m.Circular.In,
  "Circular.Out": m.Circular.Out,
  "Circular.InOut": m.Circular.InOut,
  "Elastic.In": m.Elastic.In,
  "Elastic.Out": m.Elastic.Out,
  "Elastic.InOut": m.Elastic.InOut,
  "Back.In": m.Back.In,
  "Back.Out": m.Back.Out,
  "Back.InOut": m.Back.InOut,
  "Bounce.In": m.Bounce.In,
  "Bounce.Out": m.Bounce.Out,
  "Bounce.InOut": m.Bounce.InOut
};
class wn {
  scene;
  planes = /* @__PURE__ */ new Map();
  helpers = /* @__PURE__ */ new Map();
  /**
   * The ClippingGroup node. Objects must be descendants of this group to be clipped.
   */
  group;
  constructor(e) {
    this.scene = e, this.group = new Bt(), this.group.name = "__clippingToolGroup", this.scene.add(this.group);
  }
  /**
   * Move all current scene children (except the clipping group itself) into the ClippingGroup,
   * so they are all subject to clipping.
   */
  attach() {
    const e = [...this.scene.children];
    for (const t of e)
      t !== this.group && this.group.add(t);
  }
  /**
   * Move all children out of the ClippingGroup back to the scene root.
   */
  detach() {
    const e = [...this.group.children];
    for (const t of e)
      this.helpers.has(t.name) || this.scene.add(t);
  }
  /**
   * Enable clipping.
   */
  enable() {
    this.group.enabled = !0;
  }
  /**
   * Disable clipping.
   */
  disable() {
    this.group.enabled = !1;
  }
  /**
   * Add a clipping plane.
   */
  addPlane(e, t = {}) {
    const {
      normal: s = { x: 0, y: -1, z: 0 },
      constant: n = 0,
      showHelper: i = !1,
      helperSize: r = 5,
      helperColor: o = 16711680
    } = t, a = new At(new w(s.x, s.y, s.z), n);
    return this.planes.set(e, a), this._syncPlanes(), i && this.showHelper(e, r, o), a;
  }
  /**
   * Add six clipping planes that form a box around a Box3.
   * Returns the six plane ids: `${id}_+x`, `${id}_-x`, etc.
   */
  addBox(e, t, s = {}) {
    const { showHelpers: n = !1, helperColor: i = 16711680 } = s, r = t.min, o = t.max, a = [
      { suffix: "+x", normal: { x: -1, y: 0, z: 0 }, constant: o.x },
      { suffix: "-x", normal: { x: 1, y: 0, z: 0 }, constant: -r.x },
      { suffix: "+y", normal: { x: 0, y: -1, z: 0 }, constant: o.y },
      { suffix: "-y", normal: { x: 0, y: 1, z: 0 }, constant: -r.y },
      { suffix: "+z", normal: { x: 0, y: 0, z: -1 }, constant: o.z },
      { suffix: "-z", normal: { x: 0, y: 0, z: 1 }, constant: -r.z }
    ], c = [];
    for (const l of a) {
      const d = `${e}_${l.suffix}`;
      this.addPlane(d, { normal: l.normal, constant: l.constant, showHelper: n, helperColor: i }), c.push(d);
    }
    return c;
  }
  /**
   * Add a clipping box from an object's bounding box with optional padding.
   */
  addBoxFromObject(e, t, s = 0, n = {}) {
    const i = new Q().setFromObject(t);
    return i.expandByScalar(s), this.addBox(e, i, n);
  }
  /**
   * Update a plane's constant (distance from origin).
   */
  setPlaneConstant(e, t) {
    const s = this.planes.get(e);
    s && (s.constant = t);
  }
  /**
   * Remove a clipping plane.
   */
  removePlane(e) {
    this.planes.delete(e), this.hideHelper(e), this._syncPlanes();
  }
  /**
   * Remove a clipping box (all 6 associated planes).
   */
  removeBox(e) {
    const t = ["+x", "-x", "+y", "-y", "+z", "-z"];
    for (const s of t)
      this.removePlane(`${e}_${s}`);
  }
  /**
   * Remove all clipping planes.
   */
  removeAll() {
    const e = Array.from(this.helpers.keys());
    for (const t of e)
      this.hideHelper(t);
    this.planes.clear(), this._syncPlanes();
  }
  /**
   * Show a helper visualization for a clipping plane.
   */
  showHelper(e, t = 5, s = 16711680) {
    this.hideHelper(e);
    const n = this.planes.get(e);
    if (!n) return;
    const i = new It(n, t, new _(s).getHex());
    i.name = e, this.helpers.set(e, i), this.scene.add(i);
  }
  /**
   * Hide a plane helper.
   */
  hideHelper(e) {
    const t = this.helpers.get(e);
    t && (this.scene.remove(t), t.dispose(), this.helpers.delete(e));
  }
  /**
   * Get a plane by id.
   */
  get(e) {
    return this.planes.get(e);
  }
  /**
   * Sync the planes map into the ClippingGroup's clippingPlanes array.
   */
  _syncPlanes() {
    this.group.clippingPlanes = Array.from(this.planes.values());
  }
  dispose() {
    this.detach(), this.removeAll(), this.scene.remove(this.group);
  }
}
class bn {
  scene;
  measurements = /* @__PURE__ */ new Map();
  _idCounter = 0;
  constructor(e) {
    this.scene = e;
  }
  /**
   * Measure distance between two points.
   */
  measureDistance(e, t, s = {}) {
    const { lineColor: n = 16776960 } = s, i = new w(e.x, e.y, e.z), r = new w(t.x, t.y, t.z), o = i.distanceTo(r), a = `measure_dist_${this._idCounter++}`, c = new L();
    c.name = a;
    const l = new W().setFromPoints([i, r]), d = new V({ color: n }), u = new Z(l, d);
    c.add(u), this.scene.add(c);
    const p = {
      id: a,
      type: "distance",
      value: o,
      unit: "m",
      points: [i, r],
      object: c
    };
    return this.measurements.set(a, p), p;
  }
  /**
   * Measure the area of a polygon defined by 3+ coplanar points.
   */
  measureArea(e, t = {}) {
    const { lineColor: s = 65280 } = t;
    if (e.length < 3)
      throw new Error("MeasureTool.measureArea requires at least 3 points");
    const n = e.map((p) => new w(p.x, p.y, p.z)), i = this._calculatePolygonArea(n), r = `measure_area_${this._idCounter++}`, o = new L();
    o.name = r;
    const a = [...n, n[0]], c = new W().setFromPoints(a), l = new V({ color: s }), d = new Z(c, l);
    o.add(d), this.scene.add(o);
    const u = {
      id: r,
      type: "area",
      value: i,
      unit: "m²",
      points: n,
      object: o
    };
    return this.measurements.set(r, u), u;
  }
  /**
   * Measure the angle between three points (vertex at the middle point).
   */
  measureAngle(e, t, s, n = {}) {
    const { lineColor: i = 16746496 } = n, r = new w(e.x, e.y, e.z), o = new w(t.x, t.y, t.z), a = new w(s.x, s.y, s.z), c = r.clone().sub(o).normalize(), l = a.clone().sub(o).normalize(), u = Math.acos(Math.max(-1, Math.min(1, c.dot(l)))) * 180 / Math.PI, p = `measure_angle_${this._idCounter++}`, f = new L();
    f.name = p;
    const b = new W().setFromPoints([r, o, a]), T = new V({ color: i }), x = new Z(b, T);
    f.add(x), this.scene.add(f);
    const y = {
      id: p,
      type: "angle",
      value: u,
      unit: "°",
      points: [r, o, a],
      object: f
    };
    return this.measurements.set(p, y), y;
  }
  /**
   * Get a measurement result by id.
   */
  get(e) {
    return this.measurements.get(e);
  }
  /**
   * Remove a measurement by id.
   */
  remove(e) {
    const t = this.measurements.get(e);
    t && (this.scene.remove(t.object), t.object.traverse((s) => {
      s.geometry?.dispose(), s.material?.dispose();
    }), this.measurements.delete(e));
  }
  /**
   * Remove all measurements.
   */
  removeAll() {
    const e = Array.from(this.measurements.keys());
    for (const t of e)
      this.remove(t);
  }
  /**
   * Get all measurement results.
   */
  getAll() {
    return Array.from(this.measurements.values());
  }
  /**
   * Calculate polygon area using cross product method (Newell's method).
   */
  _calculatePolygonArea(e) {
    const t = e.length, s = new w();
    for (let i = 0; i < t; i++) {
      const r = e[i], o = e[(i + 1) % t], a = new w().crossVectors(r, o);
      s.add(a);
    }
    const n = new w();
    if (t >= 3) {
      const i = e[1].clone().sub(e[0]), r = e[2].clone().sub(e[0]);
      n.crossVectors(i, r).normalize();
    }
    return Math.abs(s.dot(n)) / 2;
  }
  dispose() {
    this.removeAll();
  }
}
class vn {
  scene;
  annotations = /* @__PURE__ */ new Map();
  _idCounter = 0;
  _createCSSObject = null;
  constructor(e) {
    this.scene = e;
  }
  /**
   * Set the CSS object factory function (from CSSRenderer).
   * This allows annotations to be rendered as CSS2D/CSS2.5D objects.
   */
  setCSSObjectFactory(e) {
    this._createCSSObject = e;
  }
  /**
   * Add an annotation.
   */
  add(e, t) {
    this.annotations.has(e) && this.remove(e);
    const s = new L();
    s.name = `annotation_${e}`;
    const n = new w(t.position.x, t.position.y, t.position.z);
    s.position.copy(n);
    const i = document.createElement("div");
    if (i.innerHTML = t.content, i.style.cssText = `
      padding: 4px 8px;
      background: rgba(0, 0, 0, 0.75);
      color: #fff;
      font-size: 12px;
      border-radius: 4px;
      pointer-events: auto;
      white-space: nowrap;
    `, t.labelStyle)
      for (const [c, l] of Object.entries(t.labelStyle))
        l !== void 0 && (i.style[c] = l);
    let r = null;
    const o = t.labelOffset || { x: 0, y: 2, z: 0 };
    if (t.showLeaderLine !== !1) {
      const { lineColor: c = 16777215 } = t, l = new W().setFromPoints([
        new w(0, 0, 0),
        new w(o.x, o.y, o.z)
      ]), d = new V({ color: c });
      r = new Z(l, d), s.add(r);
    }
    if (this._createCSSObject) {
      const c = this._createCSSObject(i);
      c.position.set(o.x, o.y, o.z), s.add(c);
    }
    this.scene.add(s);
    const a = {
      id: e,
      options: t,
      group: s,
      labelElement: i,
      line: r
    };
    return this.annotations.set(e, a), a;
  }
  /**
   * Quick-add a text annotation.
   */
  addText(e, t, s = {}) {
    const n = `annotation_${this._idCounter++}`;
    return this.add(n, {
      position: t,
      content: e,
      ...s
    });
  }
  /**
   * Update an annotation's content.
   */
  updateContent(e, t) {
    const s = this.annotations.get(e);
    s && (s.labelElement.innerHTML = t, s.options.content = t);
  }
  /**
   * Update an annotation's position.
   */
  updatePosition(e, t) {
    const s = this.annotations.get(e);
    s && (s.group.position.set(t.x, t.y, t.z), s.options.position = t);
  }
  /**
   * Show an annotation.
   */
  show(e) {
    const t = this.annotations.get(e);
    t && (t.group.visible = !0);
  }
  /**
   * Hide an annotation.
   */
  hide(e) {
    const t = this.annotations.get(e);
    t && (t.group.visible = !1);
  }
  /**
   * Get an annotation by id.
   */
  get(e) {
    return this.annotations.get(e);
  }
  /**
   * Remove an annotation.
   */
  remove(e) {
    const t = this.annotations.get(e);
    if (t) {
      const s = [...t.group.children];
      for (const n of s)
        t.group.remove(n), n.geometry?.dispose(), n.material?.dispose();
      this.scene.remove(t.group), this.annotations.delete(e);
    }
  }
  /**
   * Remove all annotations.
   */
  removeAll() {
    const e = Array.from(this.annotations.keys());
    for (const t of e)
      this.remove(t);
  }
  /**
   * Show all annotations.
   */
  showAll() {
    for (const e of this.annotations.values())
      e.group.visible = !0;
  }
  /**
   * Hide all annotations.
   */
  hideAll() {
    for (const e of this.annotations.values())
      e.group.visible = !1;
  }
  /**
   * Get all annotation ids.
   */
  keys() {
    return Array.from(this.annotations.keys());
  }
  get size() {
    return this.annotations.size;
  }
  dispose() {
    this.removeAll();
  }
}
const ks = "0.0.11";
window.__USPACE__ = { version: ks };
export {
  vn as AnnotationManager,
  Ue as BaseGroup,
  G as BaseMesh,
  Rs as BaseSprite,
  Sn as CSS2DObject,
  Mn as CSS3DObject,
  _n as CSS3DSprite,
  gs as CSSRenderer,
  ls as CameraControls,
  mn as CircleMesh,
  wn as ClippingTool,
  Fe as ExtrudeMesh,
  rs as InteractionEvent,
  os as InteractionManager,
  re as MaterialEffects,
  bn as MeasureTool,
  ie as Model,
  z as ModelLoaderManager,
  as as ObjectManager,
  F as ObjectUtils,
  un as PlaneMesh,
  pn as Poi,
  cs as RenderPipeline,
  ps as RoomEnvironment,
  Ls as SBMLoader,
  ws as SBMXLoader,
  cn as Selection,
  ke as ShapeMesh,
  Ns as SphereMesh,
  fn as TSLEffects,
  ln as TextureLoaderManager,
  dn as Topology,
  Ce as TubeMesh,
  Ds as Tween,
  hn as Viewer,
  gn as reinterpretType,
  yn as tweenAnimation,
  ks as version
};

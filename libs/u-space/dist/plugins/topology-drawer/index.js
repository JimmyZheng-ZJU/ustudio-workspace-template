import { PlaneGeometry as n, Mesh as r, MeshBasicNodeMaterial as h, BufferGeometry as a, Float32BufferAttribute as l, Line as p, LineBasicNodeMaterial as _ } from "three/webgpu";
import { Topology as v } from "u-space";
class u {
  viewer;
  topology;
  _snapRadius;
  // Typed reference to viewer.scene for InteractionEventMap listeners
  _scene;
  // Invisible ground plane added to scene as raycast fallback for empty space
  _groundMesh;
  _previewLine;
  _previewGeometry;
  _lastNodeId = null;
  _nodeCounter = 0;
  _history = [];
  _enabled = !1;
  _prevFrameloop = "demand";
  _prevPointerMoveEnabled = !1;
  constructor(e, t) {
    this.viewer = e, this._snapRadius = t?.snapRadius ?? 1, this._scene = e.scene, this.topology = new v({
      nodeColor: t?.nodeColor,
      nodeRadius: t?.nodeRadius,
      edgeColor: t?.edgeColor,
      edgeRadius: t?.edgeRadius,
      pathColor: t?.pathColor,
      pathRadius: t?.pathRadius
    });
    const o = new n(1e5, 1e5);
    o.rotateX(-Math.PI / 2), this._groundMesh = new r(o, new h({ visible: !1 })), this._groundMesh.position.y = t?.groundY ?? 0, this._previewGeometry = new a(), this._previewGeometry.setAttribute("position", new l(new Float32Array(6), 3)), this._previewLine = new p(
      this._previewGeometry,
      new _({ color: t?.previewColor ?? 16776960, depthTest: !1 })
    ), this._previewLine.renderOrder = 10, this._previewLine.visible = !1;
  }
  // ─── Private helpers ──────────────────────────────────────────────────────
  _findNearestNode(e) {
    let t = this._snapRadius, o = null;
    return this.topology.nodes.forEach((i, s) => {
      const d = e.distanceTo(i);
      d < t && (t = d, o = s);
    }), o;
  }
  _setPreviewLine(e, t) {
    const o = this._previewGeometry.attributes.position;
    o.setXYZ(0, e.x, e.y, e.z), o.setXYZ(1, t.x, t.y, t.z), o.needsUpdate = !0, this._previewLine.visible = !0;
  }
  /**
   * Resolve the world-space placement point from an InteractionEvent.
   *
   * - If the original hit was a topology node, return its registered position
   *   (more accurate than the sphere surface point).
   * - If the hit was a topology edge, return the surface hit point so a new
   *   node can be inserted at that location and connected.
   * - Otherwise use intersect.point directly.
   */
  _resolvePoint(e) {
    const t = e.intersect?.point;
    if (!t) return null;
    const { type: o, id: i } = e.target.userData;
    return o === "node" && i ? this.topology.nodes.get(i)?.clone() ?? t.clone() : t.clone();
  }
  _placePoint(e) {
    const t = this._findNearestNode(e);
    if (t) {
      this._lastNodeId && this._lastNodeId !== t && (this.topology.addEdge(this._lastNodeId, t), this._history.push({
        type: "addEdge",
        from: this._lastNodeId,
        to: t,
        prevLastNodeId: this._lastNodeId
      }), this._lastNodeId = t, this.topology.renderGraph());
      return;
    }
    const o = `node_${this._nodeCounter++}`;
    this.topology.addNode(o, e);
    const i = { type: "addNode", nodeId: o, prevLastNodeId: this._lastNodeId };
    this._lastNodeId && (this.topology.addEdge(this._lastNodeId, o), i.addedEdge = { from: this._lastNodeId, to: o }), this._history.push(i), this._lastNodeId = o, this.topology.renderGraph();
  }
  /**
   * Insert a new node into an existing edge (split it).
   *
   * The original edge (cutFrom ↔ cutTo) is removed and replaced with two
   * edges: cutFrom → newNode → cutTo.
   * If a path chain is active (_lastNodeId set, and different from the edge
   * endpoints), an additional edge _lastNodeId → newNode is added.
   */
  _splitEdge(e, t, o, i) {
    const s = `node_${this._nodeCounter++}`;
    this.topology.addNode(s, e), this.topology.removeEdge(t, o), this.topology.addEdge(t, s), this.topology.addEdge(s, o);
    const d = {
      type: "splitEdge",
      nodeId: s,
      cutFrom: t,
      cutTo: o,
      cutWeight: i,
      prevLastNodeId: this._lastNodeId
    };
    this._lastNodeId && this._lastNodeId !== t && this._lastNodeId !== o && (this.topology.addEdge(this._lastNodeId, s), d.chainEdge = { from: this._lastNodeId, to: s }), this._history.push(d), this._lastNodeId = s, this.topology.renderGraph();
  }
  // ─── Scene-level InteractionManager event handlers ────────────────────────
  _onSceneClick = ({ event: e }) => {
    const t = e.target.userData;
    if (t.type === "edge" && t.from && t.to) {
      const i = e.intersect?.point;
      if (!i) return;
      this._splitEdge(i.clone(), t.from, t.to, t.weight ?? 0);
      return;
    }
    const o = this._resolvePoint(e);
    o && this._placePoint(o);
  };
  _onScenePointerMove = ({ event: e }) => {
    if (!this._lastNodeId) return;
    const t = e.intersect?.point;
    if (!t) return;
    const o = this.topology.nodes.get(this._lastNodeId);
    o && this._setPreviewLine(o, t);
  };
  _onSceneContextMenu = ({ event: e }) => {
    e.originalEvent.preventDefault(), this.finishPath();
  };
  _onKeyDown = (e) => {
    e.key === "Escape" ? this.finishPath() : (e.ctrlKey || e.metaKey) && e.key === "z" && (e.preventDefault(), this.undo());
  };
  // ─── Public API ───────────────────────────────────────────────────────────
  /** Finish the current path chain. Next click starts an unconnected new path. */
  finishPath() {
    this._history.push({ type: "finishPath", prevLastNodeId: this._lastNodeId }), this._lastNodeId = null, this._previewLine.visible = !1;
  }
  /** Undo the last action (node, edge, or finishPath). */
  undo() {
    const e = this._history.pop();
    if (e)
      if (e.type === "addNode" ? (e.addedEdge && this.topology.removeEdge(e.addedEdge.from, e.addedEdge.to), this.topology.removeNode(e.nodeId), this._lastNodeId = e.prevLastNodeId, this.topology.renderGraph()) : e.type === "addEdge" ? (this.topology.removeEdge(e.from, e.to), this._lastNodeId = e.prevLastNodeId, this.topology.renderGraph()) : e.type === "splitEdge" ? (this.topology.removeEdge(e.cutFrom, e.nodeId), this.topology.removeEdge(e.nodeId, e.cutTo), e.chainEdge && this.topology.removeEdge(e.chainEdge.from, e.chainEdge.to), this.topology.removeNode(e.nodeId), this.topology.addEdge(e.cutFrom, e.cutTo, e.cutWeight), this._lastNodeId = e.prevLastNodeId, this.topology.renderGraph()) : e.type === "finishPath" && (this._lastNodeId = e.prevLastNodeId), this._lastNodeId) {
        const t = this.topology.nodes.get(this._lastNodeId);
        t && this._setPreviewLine(t, t);
      } else
        this._previewLine.visible = !1;
  }
  /** Remove all drawn nodes, edges, and path meshes. */
  clear() {
    this.topology.clearGraph(), this.topology.clearPaths(), this.topology.nodes.clear(), this.topology.adjacencyMap.clear(), this._lastNodeId = null, this._nodeCounter = 0, this._history = [], this._previewLine.visible = !1;
  }
  /** Export the current topology as a JSON-serializable object. Delegates to `topology.exportData()`. */
  exportData() {
    return this.topology.exportData();
  }
  /**
   * Load a previously exported topology, replacing any current drawing.
   * Delegates to `topology.importData()` and resets the drawer's internal node counter.
   */
  importData(e) {
    this._lastNodeId = null, this._history = [], this._previewLine.visible = !1, this.topology.importData(e), Object.keys(e.nodes).forEach((t) => {
      const o = parseInt(t.replace("node_", ""), 10);
      !isNaN(o) && o >= this._nodeCounter && (this._nodeCounter = o + 1);
    });
  }
  /**
   * Enable drawing mode.
   *
   * - Adds the topology, preview line, and fallback ground plane to the scene.
   * - Registers `click`, `pointermove`, `contextmenu` listeners on `viewer.scene`
   *   (events are bubbled up by InteractionManager from whichever object is hit).
   * - Enables `pointerMoveEventsEnabled` on the InteractionManager for the
   *   preview line to track the cursor.
   */
  enable() {
    return this._enabled ? this : (this._enabled = !0, this._prevFrameloop = this.viewer.frameloop, this._prevPointerMoveEnabled = this.viewer.interactionManager.pointerMoveEventsEnabled, this.viewer.frameloop = "always", this.viewer.interactionManager.pointerMoveEventsEnabled = !0, this.viewer.scene.add(this._groundMesh), this.viewer.scene.add(this.topology), this.viewer.scene.add(this._previewLine), this._scene.addEventListener("click", this._onSceneClick), this._scene.addEventListener("pointermove", this._onScenePointerMove), this._scene.addEventListener("rightclick", this._onSceneContextMenu), window.addEventListener("keydown", this._onKeyDown), this);
  }
  /**
   * Disable drawing mode.
   * The drawn topology remains visible in the scene.
   */
  disable() {
    return this._enabled ? (this._enabled = !1, this.viewer.frameloop = this._prevFrameloop, this.viewer.interactionManager.pointerMoveEventsEnabled = this._prevPointerMoveEnabled, this.viewer.scene.remove(this._groundMesh), this.viewer.scene.remove(this._previewLine), this._previewLine.visible = !1, this._scene.removeEventListener("click", this._onSceneClick), this._scene.removeEventListener("pointermove", this._onScenePointerMove), this._scene.removeEventListener("rightclick", this._onSceneContextMenu), window.removeEventListener("keydown", this._onKeyDown), this) : this;
  }
  /** Fully dispose all resources and remove the topology from the scene. */
  dispose() {
    this.disable(), this.viewer.scene.remove(this.topology), this._groundMesh.geometry.dispose(), this._groundMesh.material.dispose(), this._previewGeometry.dispose(), this._previewLine.material.dispose(), this.topology.dispose();
  }
}
export {
  u as TopologyDrawer
};

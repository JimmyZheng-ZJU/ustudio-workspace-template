import { type ColorRepresentation } from 'three/webgpu';
import { type Viewer, Topology, type TopologyParameters, type TopologyData } from 'u-space';
export interface TopologyDrawerOptions extends TopologyParameters {
    /** Y coordinate of the fallback ground plane (used when no scene object is hit). Default: 0 */
    groundY?: number;
    /** Color of the preview line shown while drawing. Default: 0xffff00 */
    previewColor?: ColorRepresentation;
    /** Snap to an existing node when clicking within this world-unit radius. Default: 1.0 */
    snapRadius?: number;
}
/**
 * Interactive plugin for drawing topology graphs on any surface in the scene.
 *
 * Detection uses `viewer.interactionManager` — events fired on hit objects bubble
 * up the parent chain and are caught by `scene.addEventListener`.
 * An invisible ground plane is added to the scene as a fallback so that clicks
 * on empty space (no other object hit) still produce a valid world point.
 *
 * Controls (while enabled):
 *   - Left-click           : Place a node on the surface under the cursor
 *                            (snaps to nearest existing node within snapRadius)
 *   - Right-click / Escape : Finish the current path chain
 *   - Ctrl/Cmd + Z         : Undo the last action
 */
declare class TopologyDrawer {
    viewer: Viewer;
    topology: Topology;
    private _snapRadius;
    private _scene;
    private _groundMesh;
    private _previewLine;
    private _previewGeometry;
    private _lastNodeId;
    private _nodeCounter;
    private _history;
    private _enabled;
    private _prevFrameloop;
    private _prevPointerMoveEnabled;
    constructor(viewer: Viewer, options?: TopologyDrawerOptions);
    private _findNearestNode;
    private _setPreviewLine;
    /**
     * Resolve the world-space placement point from an InteractionEvent.
     *
     * - If the original hit was a topology node, return its registered position
     *   (more accurate than the sphere surface point).
     * - If the hit was a topology edge, return the surface hit point so a new
     *   node can be inserted at that location and connected.
     * - Otherwise use intersect.point directly.
     */
    private _resolvePoint;
    private _placePoint;
    /**
     * Insert a new node into an existing edge (split it).
     *
     * The original edge (cutFrom ↔ cutTo) is removed and replaced with two
     * edges: cutFrom → newNode → cutTo.
     * If a path chain is active (_lastNodeId set, and different from the edge
     * endpoints), an additional edge _lastNodeId → newNode is added.
     */
    private _splitEdge;
    private _onSceneClick;
    private _onScenePointerMove;
    private _onSceneContextMenu;
    private _onKeyDown;
    /** Finish the current path chain. Next click starts an unconnected new path. */
    finishPath(): void;
    /** Undo the last action (node, edge, or finishPath). */
    undo(): void;
    /** Remove all drawn nodes, edges, and path meshes. */
    clear(): void;
    /** Export the current topology as a JSON-serializable object. Delegates to `topology.exportData()`. */
    exportData(): TopologyData;
    /**
     * Load a previously exported topology, replacing any current drawing.
     * Delegates to `topology.importData()` and resets the drawer's internal node counter.
     */
    importData(data: TopologyData): void;
    /**
     * Enable drawing mode.
     *
     * - Adds the topology, preview line, and fallback ground plane to the scene.
     * - Registers `click`, `pointermove`, `contextmenu` listeners on `viewer.scene`
     *   (events are bubbled up by InteractionManager from whichever object is hit).
     * - Enables `pointerMoveEventsEnabled` on the InteractionManager for the
     *   preview line to track the cursor.
     */
    enable(): this;
    /**
     * Disable drawing mode.
     * The drawn topology remains visible in the scene.
     */
    disable(): this;
    /** Fully dispose all resources and remove the topology from the scene. */
    dispose(): void;
}
export { TopologyDrawer };

import { type Object3D, type Scene, type Camera } from 'three/webgpu';
import { type InteractionEventMap } from './InteractionEvent';
/**
 * Manages pointer interactions with 3D objects in the scene.
 * Handles raycasting and event dispatching with bubbling support.
 */
export declare class InteractionManager {
    private domElement;
    private scene;
    private camera;
    private raycaster;
    private pointer;
    private hoveredObject;
    private pointerDownTime;
    private pointerDownPos;
    private clickTimer;
    private longPressThreshold;
    private moveThreshold;
    /**
     * The objects to check for intersections. default to all children of the scene (including nested).
     */
    targetObjects: Object3D<InteractionEventMap>[];
    /**
     * Whether to enable pointer move events (pointermove, pointerenter, pointerleave).
     * Disabled by default for performance optimization.
     */
    pointerMoveEventsEnabled: boolean;
    /**
     * Whether interaction is enabled globally.
     */
    private _enabled;
    /**
     * Objects excluded from raycasting (via addIgnore or setInteractable(false)).
     */
    private _excludeSet;
    constructor(domElement: HTMLElement, scene: Scene, camera: Camera);
    /**
     * Updates the camera reference (useful when switching cameras).
     */
    setCamera(camera: Camera): void;
    /**
     * Enable all interactions.
     */
    enable(): void;
    /**
     * Disable all interactions.
     */
    disable(): void;
    /**
     * Set whether a specific object is interactable.
     * When set to false, the object and its children are excluded from raycasting.
     */
    setInteractable(object: Object3D, interactable: boolean): void;
    /**
     * Add an object to the exclude list (will not receive any events).
     * Alias for `setInteractable(object, false)`.
     */
    addIgnore(object: Object3D): void;
    /**
     * Remove an object from the exclude list.
     * Alias for `setInteractable(object, true)`.
     */
    removeIgnore(object: Object3D): void;
    private _bindEvents;
    private _updatePointer;
    private _getIntersects;
    /**
     * Dispatches an event to the target object and bubbles up the parent chain.
     */
    private _dispatchToTarget;
    /**
     * Handles a DOM event by raycasting and dispatching to the first intersected object.
     */
    private _handleEvent;
    private _onClick;
    private _onDblClick;
    private _onContextMenu;
    private _onPointerDown;
    private _onPointerUp;
    private _onPointerMove;
    /**
     * Cleans up event listeners.
     */
    dispose(): void;
}

import { type Scene, type Camera, type Object3D, EventDispatcher } from 'three/webgpu';
export interface SelectionEventMap {
    select: {
        objects: Object3D[];
    };
    deselect: {
        objects: Object3D[];
    };
    change: {
        selected: Set<Object3D>;
    };
}
export interface BoxSelectionOptions {
    /** CSS class for the selection box overlay */
    className?: string;
    /** Deep traversal into children for selection */
    deep?: boolean;
}
/**
 * Manages object selection: single, multi, and box (rubber-band) selection.
 */
export declare class Selection extends EventDispatcher<SelectionEventMap> {
    private scene;
    private camera;
    private domElement;
    /** The container element for the selection box overlay (domElement's parent). */
    private _container;
    private _selected;
    private _boxSelectionEnabled;
    private _isSelecting;
    private _startPoint;
    private _endPoint;
    private _selectionBox;
    private _deep;
    /**
     * Objects available for selection (defaults to scene.children).
     */
    targetObjects: Object3D[] | null;
    constructor(domElement: HTMLElement, scene: Scene, camera: Camera);
    get selected(): Set<Object3D>;
    get selectedArray(): Object3D[];
    /**
     * Select one or more objects.
     */
    select(objects: Object3D | Object3D[]): void;
    /**
     * Deselect one or more objects.
     */
    deselect(objects: Object3D | Object3D[]): void;
    /**
     * Toggle selection of an object.
     */
    toggle(object: Object3D): void;
    /**
     * Clear all selections.
     */
    clear(): void;
    /**
     * Check if an object is selected.
     */
    isSelected(object: Object3D): boolean;
    /**
     * Enable rubber-band box selection mode.
     */
    enableBoxSelection(options?: BoxSelectionOptions): void;
    /**
     * Disable box selection mode.
     */
    disableBoxSelection(): void;
    setCamera(camera: Camera): void;
    private _onBoxPointerDown;
    private _onBoxPointerMove;
    private _onBoxPointerUp;
    private _updateBoxElement;
    private _getObjectsInBox;
    dispose(): void;
}

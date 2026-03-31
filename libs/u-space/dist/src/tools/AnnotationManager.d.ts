import { Line, type Scene, type ColorRepresentation, Group } from 'three/webgpu';
export interface AnnotationOptions {
    /** Position of the annotation anchor in 3D space */
    position: {
        x: number;
        y: number;
        z: number;
    };
    /** HTML content or text for the label */
    content: string;
    /** Offset from anchor position for the label (in 3D space) */
    labelOffset?: {
        x: number;
        y: number;
        z: number;
    };
    /** Whether to draw a leader line from anchor to label */
    showLeaderLine?: boolean;
    /** Leader line color */
    lineColor?: ColorRepresentation;
    /** CSS styles for the label element */
    labelStyle?: Partial<CSSStyleDeclaration>;
}
export interface Annotation {
    id: string;
    options: AnnotationOptions;
    group: Group;
    labelElement: HTMLDivElement;
    line: Line | null;
}
/**
 * Manages 3D annotations with leader lines and HTML labels.
 * Works with CSSRenderer for HTML overlay rendering.
 */
export declare class AnnotationManager {
    private scene;
    private annotations;
    private _idCounter;
    private _createCSSObject;
    constructor(scene: Scene);
    /**
     * Set the CSS object factory function (from CSSRenderer).
     * This allows annotations to be rendered as CSS2D/CSS2.5D objects.
     */
    setCSSObjectFactory(factory: (element: HTMLElement) => any): void;
    /**
     * Add an annotation.
     */
    add(id: string, options: AnnotationOptions): Annotation;
    /**
     * Quick-add a text annotation.
     */
    addText(text: string, position: {
        x: number;
        y: number;
        z: number;
    }, options?: Partial<AnnotationOptions>): Annotation;
    /**
     * Update an annotation's content.
     */
    updateContent(id: string, content: string): void;
    /**
     * Update an annotation's position.
     */
    updatePosition(id: string, position: {
        x: number;
        y: number;
        z: number;
    }): void;
    /**
     * Show an annotation.
     */
    show(id: string): void;
    /**
     * Hide an annotation.
     */
    hide(id: string): void;
    /**
     * Get an annotation by id.
     */
    get(id: string): Annotation | undefined;
    /**
     * Remove an annotation.
     */
    remove(id: string): void;
    /**
     * Remove all annotations.
     */
    removeAll(): void;
    /**
     * Show all annotations.
     */
    showAll(): void;
    /**
     * Hide all annotations.
     */
    hideAll(): void;
    /**
     * Get all annotation ids.
     */
    keys(): string[];
    get size(): number;
    dispose(): void;
}

import type { Object3D, Intersection, Object3DEventMap } from 'three/webgpu';
export type InteractionEventType = 'click' | 'dblclick' | 'rightclick' | 'pointerdown' | 'pointerup' | 'pointermove' | 'pointerenter' | 'pointerleave';
export interface InteractionEventParameters {
    type: InteractionEventType;
    target: Object3D<InteractionEventMap>;
    intersect: Intersection<Object3D<InteractionEventMap>> | null;
    originalEvent: PointerEvent | MouseEvent;
}
export type InteractionEventMap = Object3DEventMap & {
    [K in InteractionEventType]: {
        event: InteractionEvent;
    };
};
/**
 * Custom event class for 3D object interactions.
 * Supports event bubbling via `stopPropagation()`.
 */
export declare class InteractionEvent {
    /** The type of event (e.g., 'click', 'pointerdown'). */
    readonly type: InteractionEventType;
    /** The original 3D object that triggered the event. */
    readonly target: Object3D<InteractionEventMap>;
    /** The current 3D object during the bubbling phase. */
    currentTarget: Object3D<InteractionEventMap>;
    /** The intersection data from raycasting, or null if not applicable. */
    readonly intersect: Intersection | null;
    /** The original DOM event, or undefined if not applicable. */
    readonly originalEvent: PointerEvent | MouseEvent;
    private _propagationStopped;
    constructor(init: InteractionEventParameters);
    /**
     * Stops the event from bubbling up the parent chain.
     */
    stopPropagation(): void;
    /**
     * Returns true if `stopPropagation()` has been called.
     */
    get propagationStopped(): boolean;
}

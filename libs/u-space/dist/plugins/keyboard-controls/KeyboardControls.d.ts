import type { Viewer } from 'u-space';
export declare const ACTION: Readonly<{
    MOVE_FORWARD: "move-forward";
    MOVE_BACKWARD: "move-backward";
    MOVE_LEFT: "move-left";
    MOVE_RIGHT: "move-right";
    MOVE_UP: "move-up";
    MOVE_DOWN: "move-down";
    ROTATE_LEFT: "rotate-left";
    ROTATE_RIGHT: "rotate-right";
    ROTATE_UP: "rotate-up";
    ROTATE_DOWN: "rotate-down";
}>;
type ActionValue = (typeof ACTION)[keyof typeof ACTION];
declare class KeyboardControls {
    viewer: Viewer;
    moveDistanceDelta: number;
    rotateAngleDelta: number;
    keys: Record<string, ActionValue>;
    _state: Record<ActionValue, {
        fn: () => void;
        pressed: boolean;
    }>;
    constructor(viewer: Viewer);
    _onKeyDown: (event: KeyboardEvent) => void;
    _onKeyUp: (event: KeyboardEvent) => void;
    _update: () => void;
    enable(): this;
    disable(): this;
}
export { KeyboardControls };

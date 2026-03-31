import { type Raycaster, type Intersection, type Object3DEventMap, Group } from 'three/webgpu';
export declare class BaseGroup<TEventMap extends Object3DEventMap = Object3DEventMap> extends Group<TEventMap> {
    readonly isBaseGroup = true;
    type: string;
    ignoreInvisibleWhenRaycast: boolean;
    constructor(...args: ConstructorParameters<typeof Group<TEventMap>>);
    raycast(raycaster: Raycaster, intersects: Intersection[]): boolean | void;
}

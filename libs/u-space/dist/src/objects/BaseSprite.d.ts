import { type Raycaster, type Intersection, type Object3DEventMap, Sprite } from 'three/webgpu';
export declare class BaseSprite<TEventMap extends Object3DEventMap = Object3DEventMap> extends Sprite<TEventMap> {
    readonly isBaseSprite = true;
    type: string;
    ignoreInvisibleWhenRaycast: boolean;
    constructor(...args: ConstructorParameters<typeof Sprite<TEventMap>>);
    raycast(raycaster: Raycaster, intersects: Intersection[]): boolean | void;
}

import { type BufferGeometry, type Intersection, type Material, type Object3DEventMap, type Raycaster, Mesh } from 'three/webgpu';
export declare class BaseMesh<TGeometry extends BufferGeometry = BufferGeometry, TMaterial extends Material | Material[] = Material | Material[], TEventMap extends Object3DEventMap = Object3DEventMap> extends Mesh<TGeometry, TMaterial, TEventMap> {
    readonly isBaseMesh = true;
    type: string;
    ignoreInvisibleWhenRaycast: boolean;
    constructor(...args: ConstructorParameters<typeof Mesh<TGeometry, TMaterial, TEventMap>>);
    raycast(raycaster: Raycaster, intersects: Intersection[]): boolean | void;
}

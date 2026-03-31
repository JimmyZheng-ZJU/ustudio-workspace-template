import { type Object3D, type Object3DEventMap, type Material, type BufferGeometry, Mesh } from 'three/webgpu';
export declare class ObjectUtils {
    static traverseMeshes<TGeometry extends BufferGeometry, TMaterial extends Material, TEventMap extends Object3DEventMap>(object: Object3D, callback: (object: Mesh<TGeometry, TMaterial, TEventMap>) => void): void;
}

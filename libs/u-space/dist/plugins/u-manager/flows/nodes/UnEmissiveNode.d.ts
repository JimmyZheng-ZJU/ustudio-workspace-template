import type { Object3D } from 'three/webgpu';
import type { FlowParser } from '../FlowParser';
import type { NodeGlobalType, NodeType } from '../types';
import { Node } from './Node';
declare class UnEmissiveNode extends Node {
    constructor(parser: FlowParser, node: NodeType);
    filterUnEmissiveObject(objectsValue: Object3D[] | Object3D): Object3D<import("three").Object3DEventMap>[];
    exec(global: NodeGlobalType): Promise<void>;
}
export { UnEmissiveNode, };

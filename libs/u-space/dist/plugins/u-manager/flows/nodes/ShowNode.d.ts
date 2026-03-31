import type { FlowParser } from '../FlowParser';
import type { NodeGlobalType, NodeType } from '../types';
import { Node } from './Node';
import type { Object3D } from 'three/webgpu';
declare class ShowNode extends Node {
    constructor(parser: FlowParser, node: NodeType);
    filterShowObject(objectsValue: Object3D[] | Object3D): Object3D<import("three").Object3DEventMap>[];
    exec(global: NodeGlobalType): Promise<void>;
}
export { ShowNode, };

import type { FlowParser } from '../FlowParser';
import type { NodeType } from '../types';
import { Node } from './Node';
declare class FlyToNode extends Node {
    constructor(parser: FlowParser, node: NodeType);
    exec(): Promise<void>;
}
export { FlyToNode, };

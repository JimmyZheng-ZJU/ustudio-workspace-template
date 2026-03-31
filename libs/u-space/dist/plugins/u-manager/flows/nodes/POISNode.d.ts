import type { FlowParser } from '../FlowParser';
import type { NodeGlobalType, NodeType } from '../types';
import { Node } from './Node';
declare class POIsNode extends Node {
    constructor(parser: FlowParser, node: NodeType);
    exec(_global: NodeGlobalType): Promise<void>;
}
export { POIsNode, };

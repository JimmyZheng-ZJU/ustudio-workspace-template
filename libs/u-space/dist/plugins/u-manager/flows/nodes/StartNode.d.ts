import type { FlowParser } from '../FlowParser';
import type { NodeType } from '../types';
import { Node } from './Node';
declare class StartNode extends Node {
    constructor(parser: FlowParser, node: NodeType);
}
export { StartNode, };

import type { FlowParser } from '../../FlowParser';
import type { NodeGlobalType, NodeType } from '../../types';
import { Node } from '../Node';
declare class ClipAnimationNode extends Node {
    constructor(parser: FlowParser, node: NodeType);
    exec(global: NodeGlobalType): Promise<void>;
}
export { ClipAnimationNode };

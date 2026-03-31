import type { FlowParser } from '../../FlowParser';
import type { NodeType, NodeGlobalType } from '../../types';
import { Node } from '../Node';
declare class ComponentTweenAnimationNode extends Node {
    constructor(parser: FlowParser, node: NodeType);
    exec(global: NodeGlobalType): Promise<void>;
}
export { ComponentTweenAnimationNode, };

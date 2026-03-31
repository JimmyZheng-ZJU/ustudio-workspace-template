import type { FlowParser } from '../FlowParser';
import type { NodeType } from '../types';
import { Node } from './Node';
declare class ConditionNode extends Node {
    constructor(parser: FlowParser, node: NodeType);
    execFn(fnStr: string): any;
    exec(): Promise<void>;
}
export { ConditionNode, };

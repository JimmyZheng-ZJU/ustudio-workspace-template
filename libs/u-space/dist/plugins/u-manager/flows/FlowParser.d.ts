import { EventDispatcher } from 'three/webgpu';
import type { Viewer } from 'u-space';
import { Edge } from './edges';
import { Node } from './nodes';
import type { FlowParserEventMap, FlowType, NodeGlobalType } from './types';
declare class FlowParser extends EventDispatcher<FlowParserEventMap> {
    viewer: Viewer;
    flow: FlowType;
    nodes: Node[];
    nodesMap: Map<Node['id'], Node>;
    edges: Edge[];
    edgesMap: Map<Edge['id'], Edge>;
    onNodeBefore: Node['onBefore'];
    onNodeAfter: Node['onAfter'];
    constructor(viewer: Viewer, flow: FlowType);
    addNode(node: Node): void;
    addEdge(edge: Edge): void;
    getNodeById(id: string): Node | undefined;
    getEdgeById(id: string): Edge | undefined;
    clear(): void;
    /**
     * 解析流程
     */
    parse(): void;
    /**
     * 执行流程
     * @param startNode
     * @param ctx
     */
    run(global?: NodeGlobalType, options?: {
        preload: boolean;
    }): Promise<void>;
    /**
     * 调试流程
     */
    debug(global?: NodeGlobalType, time?: number): Promise<void>;
    /**
     * 停止流程
     */
    stop(): void;
    /**
     * 清理流程
     */
    cleanup(): void;
    getVariableNameById(id: string): any;
    dispose(): void;
}
export { FlowParser, };

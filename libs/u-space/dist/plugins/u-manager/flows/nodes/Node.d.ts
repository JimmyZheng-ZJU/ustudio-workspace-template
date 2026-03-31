import type { Viewer } from 'u-space';
import type { FlowParser } from '../FlowParser';
import type { NodeType, NodeCtxType, NodePropType, NodeGlobalType, NodeTypeEnum } from '../types';
import type { Object3D } from 'three/webgpu';
declare class Node {
    parser: FlowParser;
    viewer: Viewer;
    id: string;
    type: NodeTypeEnum;
    props: NodeType['props'];
    prevNodes: Node[];
    postNodes: Node[];
    execOrder: number;
    ctx: NodeCtxType;
    promise: Promise<void>;
    resolve: () => void;
    reject: (reason?: any) => void;
    cleanSets: Set<() => void>;
    onBefore: ((node: Node) => Promise<void> | void) | null;
    onAfter: ((node: Node) => Promise<void> | void) | null;
    rejected: boolean;
    constructor(parser: FlowParser, node: NodeType);
    init(): void;
    readContext<T = any>(key: string): T | undefined;
    writeContext(key: string, value: any): void;
    findProp(name: string, type: NodePropType['type'] | NodePropType['type'][]): undefined | NodePropType;
    /**
     * 等待前置节点执行完毕
     */
    waitForPrevNodes(): Promise<void[]>;
    /**
     * 合并上下文
     */
    mergeContext(): void;
    /**
     * 执行节点逻辑
     * @param global
     */
    exec(_global: NodeGlobalType): Promise<void>;
    /**
     * 运行节点
     * @param global
     * @param options
     */
    run(global: NodeGlobalType, options?: {
        preload: boolean;
    }): Promise<void>;
    cleanup(): void;
    protected getValue(prop: NodePropType, object?: Object3D | null): any;
    private _mergeUserDataMap;
}
export { Node };

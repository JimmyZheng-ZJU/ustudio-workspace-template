import type { Model } from 'u-space';
import type { Object3D } from 'three/webgpu';
import type { Node } from './nodes';
import type { IKeyframe } from '../loaders/AnimationsLoader';
export interface IComponentAnimation {
    id: string;
    sid: string;
    name: string;
    refId: string;
    editionId: string;
    keyframes: IKeyframe[];
}
export interface IAnimation {
    id: string;
    sid: string;
    modelId: string;
    name: string;
    keyframes: IKeyframe[];
}
export type NodePropTypeEnum = 'LOCAL' | 'READ_CTX' | 'WRITE_CTX';
export type NodeTypeEnum = 'START' | 'COLOR' | 'NUMBER' | 'HIGHLIGHT' | 'UN_HIGHLIGHT' | 'OPACITY' | 'UN_OPACITY' | 'EMISSIVE' | 'UN_EMISSIVE' | 'MESH' | 'MESHES' | 'MODEL' | 'MODELS' | 'SHOW' | 'HIDE' | 'CLIP_ANIMATION' | 'UN_CLIP_ANIMATION' | 'TWEEN_ANIMATION' | 'UN_TWEEN_ANIMATION' | 'COMPONENT_TWEEN_ANIMATION' | 'UN_COMPONENT_TWEEN_ANIMATION' | 'SPACE' | 'SPACES' | 'PATH' | 'PATHS' | 'POI' | 'POIS' | 'FLY_TO' | 'TRANSLATE' | 'ROTATE' | 'SCALE' | 'DATA_FILTER' | 'DATA_EXTRACTION' | 'CONDITION_NODE' | 'DELAY' | 'USER_DATA_NODE';
/**
 * 节点 props 数据
 */
export type NodePropType = {
    name: string;
    type: NodePropTypeEnum;
    value: string;
    valueType: string;
};
/**
 * 节点数据
 */
export type NodeType = {
    id: string;
    type: NodeTypeEnum;
    props: NodePropType[];
};
/**
 * 连接数据
 */
export type EdgeType = {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string | null;
};
/**
 * 流程数据
 */
export type FlowType = {
    id: string;
    sid: string;
    name: string;
    portal: string;
    nodes: NodeType[];
    edges: EdgeType[];
};
/**
 * 组件流程数据
 */
export type ComponentFlowType = FlowType & {
    editionId: string;
};
/**
 * 节点上下文对象
 */
export type NodeCtxType = {
    [x: string]: any;
};
/**
 * 节点全局对象
 * 由运行时动态定义接口
 */
export type NodeGlobalType = {
    getTarget?: (currentNode: Node) => Promise<Model | null>;
    getAnimations?: (currentNode: Node, object: Object3D, animationId: string) => Promise<IAnimation[] | null>;
    getComponentAnimations?: (currentNode: Node, object: Object3D, animationId: string) => Promise<IComponentAnimation[] | null>;
    [s: symbol]: any;
};
export type FlowParserEventMap = {};

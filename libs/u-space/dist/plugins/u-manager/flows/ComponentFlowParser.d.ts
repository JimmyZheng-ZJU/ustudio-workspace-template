import type { Viewer } from 'u-space';
import { FlowParser } from './FlowParser';
import type { ComponentFlowType } from './types';
declare class ComponentFlowParser extends FlowParser {
    flow: ComponentFlowType;
    constructor(viewer: Viewer, flow: ComponentFlowType);
}
export { ComponentFlowParser, };

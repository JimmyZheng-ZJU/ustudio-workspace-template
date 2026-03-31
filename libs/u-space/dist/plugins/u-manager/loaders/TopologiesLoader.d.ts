import { Loader } from 'three/webgpu';
import { Topology } from 'u-space';
import type { ITopologyPath } from '../types';
export declare class TopologyParser {
    parse(data: ITopologyPath): Topology;
}
export declare class TopologiesLoader extends Loader {
    constructor();
    loadAsync(): Promise<Topology[]>;
}

import { Loader } from 'three/webgpu';
import type { IVector3, Viewer } from 'u-space';
export declare class VisionsLoader extends Loader {
    constructor();
    loadAsync(): Promise<IVisionsData>;
}
export declare class VisionsParser {
    viewer: Viewer;
    constructor(viewer: Viewer);
    flyToPrimary(visions: IVisions[], enableTransition?: boolean): Promise<boolean>;
    flyTo(vision: IVisions, enableTransition?: boolean): Promise<void>;
}
export interface IVisions {
    id: string;
    uuid: string;
    nodeId: string;
    name: string;
    code?: any;
    camera: 'O' | 'P';
    position: IVector3;
    rotation: IVector3;
    target: IVector3;
    zoom: number;
    primary: boolean;
}
export type IVisionsData = Record<string, IVisions[]>;

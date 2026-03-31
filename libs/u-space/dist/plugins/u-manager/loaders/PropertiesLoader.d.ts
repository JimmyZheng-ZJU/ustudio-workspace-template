import { Loader } from 'three/webgpu';
export declare class PropertiesLoader extends Loader {
    constructor();
    loadAsync(): Promise<IProperties[]>;
}
export interface IProperties {
    modelId: string;
    group: string;
    key: string;
    value: string | null;
    label: string | null;
}

import { Group, Loader } from 'three/webgpu';
export declare class SBMLoader extends Loader<Group, string> {
    load(url: string, onLoad: (sbm: Group) => void, onProgress?: (event: ProgressEvent) => void, onError?: (err: unknown) => void): void;
    parse(data: ArrayBuffer, path: string, onLoad: (sbm: Group) => void, onError?: (err: unknown) => void): void;
    parseAsync(data: ArrayBuffer | string, path: string): Promise<Group>;
}

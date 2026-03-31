import { FileLoader as FileLoaderClass, Loader } from 'three/webgpu';
export declare class BaseFileLoader extends FileLoaderClass {
    constructor(loader: Loader<any, any>);
    loadAsync<T = any>(url: string): Promise<T>;
}

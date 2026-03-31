import type { ILicense, ITreeData } from '../types';
export declare function decryptWithDebugKey(license: ILicense): ITreeData[];
export declare function decryptWithKey(license: ILicense, key: string): ITreeData[];
export declare function decodeToBytes(input: string): Int8Array<ArrayBuffer>;
export declare function decodeString(encodedStr: string): string;

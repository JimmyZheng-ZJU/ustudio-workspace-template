import { MeshStandardNodeMaterial } from 'three/webgpu';
export declare function decodeSbk(buffer: ArrayBuffer): ArrayBuffer | undefined;
export declare const getTextureName: (dataView: DataView, texnamelen: number, offset: number) => string;
export declare const generateSbmMaterial: (materialId: string, arr: number[], png: boolean) => MeshStandardNodeMaterial;
export declare const isPNG: (textureUrl?: string) => boolean;

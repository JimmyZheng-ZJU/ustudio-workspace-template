import type { EdgeType } from '../types';
declare class Edge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string | null;
    constructor(edge: EdgeType);
}
export { Edge, };

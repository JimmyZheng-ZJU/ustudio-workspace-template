import { Vector3, Group, type ColorRepresentation } from 'three/webgpu';
import type { InteractionEventMap } from '../interactions';
import { TubeMesh } from './TubeMesh';
import { BaseGroup } from './BaseGroup';
export type TopologyData = {
    nodes: Record<string, {
        x: number;
        y: number;
        z: number;
    }>;
    edges: Array<{
        from: string;
        to: string;
        weight: number;
    }>;
};
export interface TopologyParameters {
    nodeColor?: ColorRepresentation;
    nodeRadius?: number;
    edgeColor?: ColorRepresentation;
    edgeRadius?: number;
    pathColor?: ColorRepresentation;
    pathRadius?: number;
}
export declare class Topology extends BaseGroup<InteractionEventMap> {
    readonly isTopology = true;
    type: string;
    parameters: Required<TopologyParameters>;
    nodes: Map<string, Vector3>;
    adjacencyMap: Map<string, Map<string, number>>;
    graphGroup: Group<InteractionEventMap> | null;
    pathMeshes: TubeMesh[];
    constructor(parameters?: TopologyParameters);
    /**
     * Add a node to the topology graph.
     * @param id Unique identifier for the node
     * @param position 3D position of the node
     */
    addNode(id: string, position: Vector3): void;
    /**
     * Remove a node from the topology graph.
     * @param id Unique identifier for the node
     */
    removeNode(id: string): void;
    /**
     * Add an edge between two nodes.
     * @param from Node ID
     * @param to Node ID
     * @param weight Cost of the edge. Defaults to Euclidean distance.
     * @param bidirectional If true, adds the reverse edge as well. Default true.
     */
    addEdge(from: string, to: string, weight?: number, bidirectional?: boolean): void;
    /**
     * Remove an edge between two nodes.
     * @param from Node ID
     * @param to Node ID
     * @param bidirectional If true, removes the reverse edge as well. Default true.
     */
    removeEdge(from: string, to: string, bidirectional?: boolean): void;
    /**
     * Find the shortest path between start and end nodes using Dijkstra's algorithm.
     */
    getShortestPath(startId: string, endId: string): Vector3[];
    /**
     * Renders the entire topology graph structure using TubeGeometry and Spheres.
     */
    renderGraph(): void;
    clearGraph(): void;
    /**
     * Visualizes a path using TubeGeometry (CatmullRomCurve3).
     */
    renderPath(points: Vector3[], color?: ColorRepresentation): TubeMesh | undefined;
    clearPaths(): void;
    /** Export nodes and edges as a JSON-serializable object. */
    exportData(): TopologyData;
    /**
     * Load topology from a previously exported data object.
     * Replaces all current nodes, edges, and path meshes, then re-renders the graph.
     */
    importData(data: TopologyData): void;
    dispose(): void;
    getNeighbors(id: string): Map<string, number> | undefined;
}

import { Box3, type Object3D } from 'three/webgpu';
/**
 * Manages 3D objects with custom id and name caching for quick retrieval.
 */
export declare class ObjectManager {
    private idMap;
    private nameMap;
    private typeMap;
    private objectIds;
    private allObjects;
    /**
     * Add an object with a custom id.
     * One object can have multiple ids.
     */
    add(id: string, object: Object3D): void;
    /**
     * Get an object by its custom id.
     */
    getById<T extends Object3D>(id: string): T | undefined;
    /**
     * Get all objects with a given name.
     */
    getByName<T extends Object3D>(name: string): Set<T>;
    /**
     * Get all objects with a given type.
     */
    getByType<T extends Object3D>(type: string): Set<T>;
    /**
     * Get all ids associated with an object.
     */
    getObjectIds(object: Object3D): Set<string>;
    /**
     * Remove an object and all its associated ids.
     */
    remove(object: Object3D): void;
    /**
     * Remove an object by its id.
     */
    removeById(id: string): void;
    /**
     * Remove all objects with a given name.
     */
    removeByName(name: string): void;
    /**
     * Remove all objects with a given type.
     */
    removeByType(type: string): void;
    /**
     * Clear all cached objects.
     */
    clear(): void;
    /**
     * Get all cached objects as a Set.
     */
    getAll<T extends Object3D>(): Set<T>;
    /**
     * Get the number of unique cached objects.
     */
    get size(): number;
    /**
     * Show an object by id.
     */
    show(id: string): void;
    /**
     * Hide an object by id.
     */
    hide(id: string): void;
    /**
     * Show only the specified objects, hide all others.
     */
    isolate(ids: string[]): void;
    /**
     * Set the opacity of an object's materials.
     */
    setOpacity(id: string, opacity: number): void;
    /**
     * Get the bounding box of an object by id, or all objects if no id provided.
     */
    getBoundingBox(id?: string): Box3;
    /**
     * Iterate over all managed objects.
     */
    forEach(callback: (object: Object3D, ids: Set<string>) => void): void;
    /**
     * Filter objects by a predicate.
     */
    filter<T extends Object3D>(predicate: (object: Object3D) => boolean): T[];
    /**
     * Show all managed objects.
     */
    showAll(): void;
}

import type { InteractionEventMap } from '../interactions';
import { BaseSprite } from './BaseSprite';
export interface PoiParameters {
    /** Image URL or HTMLImageElement */
    img?: string | CanvasImageSource;
    /** Text content */
    text?: string;
    /** Font size in pixels */
    fontSize?: number;
    /** Font family */
    fontFamily?: string;
    /** Text color */
    color?: string;
    /** Icon size in pixels (applied to the image if present) */
    iconSize?: number;
    /** Padding between icon and text, and around the container */
    padding?: number;
    /** Background color of the POI (optional) */
    backgroundColor?: string;
    /** Border radius for the background (optional) */
    borderRadius?: number;
    /** Text position relative to the icon */
    textPosition?: 'top' | 'bottom' | 'left' | 'right';
    /** Scale factor for mapping canvas pixels to world units */
    scaleFactor?: number;
}
export declare class Poi extends BaseSprite<InteractionEventMap> {
    readonly isPoi = true;
    type: string;
    parameters: Required<PoiParameters>;
    private _canvas;
    private _lastParametersJSON;
    constructor(parameters?: PoiParameters);
    /**
     * Update the POI with new parameters
     * @param parameters Partial POI parameters
     */
    updateAsync(parameters?: Partial<PoiParameters>): Promise<void>;
    private _loadImage;
    private _drawRoundedRect;
    dispose(): void;
}

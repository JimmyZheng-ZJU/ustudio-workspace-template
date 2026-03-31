import { type PassNode } from 'three/webgpu';
import { ViewHelper as ViewHelperBase } from 'three/addons/helpers/ViewHelper.js';
import type { Viewer } from './Viewer';
declare class ViewerHelper extends ViewHelperBase {
    viewer: Viewer;
    overlayPass: PassNode;
    constructor(viewer: Viewer);
    _update: () => void;
    enable(): this;
    disable(): this;
}
export { ViewerHelper };

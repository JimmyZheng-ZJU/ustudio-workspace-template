// ─── Types ───────────────────────────────────────────────────────────────────
// Note: Viewer, MaterialEffects, LightManager are loaded via importmap (not Vite)
// and exposed on window.__viewer, window.__MaterialEffects, window.__LightManager
// by the init script in index.html. This avoids Vite transforming u-space/three.

export interface IVector3 {
  x: number;
  y: number;
  z: number;
}

export interface FlyToBoxOptions {
  viewpoint?: string;
  enableTransition?: boolean;
  padding?: number;
  cover?: boolean;
}

export interface FlyToOptions {
  enableTransition?: boolean;
}

export interface CameraViewpoint {
  position: IVector3;
  target: IVector3;
  zoom: number;
}

export interface HighlightOptions {
  color?: number | string;
  opacity?: number;
  overwrite?: boolean;
  depthWrite?: boolean;
}

export interface BreatheOptions {
  color?: number | string;
  speed?: number;
  intensity?: number;
}

export interface FadeOptions {
  duration?: number;
}

export interface LightOptions {
  color?: string;
  intensity?: number;
  position?: IVector3;
  [key: string]: unknown;
}

export interface ScreenshotOptions {
  width?: number;
  height?: number;
  format?: string;
}

// ─── Internal State ──────────────────────────────────────────────────────────

let _viewer: any = null;
let _lightManager: any = null;

function ensureViewer(): any {
  if (!_viewer) {
    throw new Error(
      '[ustudio/facade] Viewer 尚未初始化。请确保 SceneProvider 已完成加载。'
    );
  }
  return _viewer;
}

function getMaterialEffects(): any {
  const ME = (window as any).__MaterialEffects;
  if (!ME) {
    throw new Error('[ustudio/facade] MaterialEffects 未就绪。');
  }
  return ME;
}

function ensureLightManager(): any {
  const viewer = ensureViewer();
  if (!_lightManager) {
    const LM = (window as any).__LightManager;
    if (!LM) {
      throw new Error('[ustudio/facade] LightManager 未就绪。');
    }
    _lightManager = new LM(viewer.scene);
  }
  return _lightManager;
}

function resolveObject(idOrName: string): any {
  const viewer = ensureViewer();
  let obj = viewer.objectManager.getById(idOrName);
  if (!obj) {
    const set = viewer.objectManager.getByName(idOrName);
    if (set && set.size > 0) {
      obj = set.values().next().value;
    }
  }
  if (!obj) {
    throw new Error(
      `[ustudio/facade] 找不到对象: "${idOrName}"。请检查 ID 或名称是否正确。`
    );
  }
  return obj;
}

// ─── Viewer Injection ────────────────────────────────────────────────────────

/** 注入 Viewer 实例（由 SceneProvider 调用，业务代码不要手动调用） */
export function setViewer(v: any): void {
  _viewer = v;
  _lightManager = null;
}

// ─── 相机控制 ────────────────────────────────────────────────────────────────

/** 飞向指定对象（通过 ID 或名称） */
export function flyToObject(idOrName: string, options?: FlyToBoxOptions): void {
  const viewer = ensureViewer();
  const obj = resolveObject(idOrName);
  try {
    viewer.controls.flyToObject(obj, options);
  } catch (e) {
    console.warn(`[ustudio/facade] flyToObject("${idOrName}") failed (empty bounding box?):`, e);
  }
}

/** 飞向指定位置和朝向 */
export function flyToPosition(
  position: IVector3,
  target: IVector3,
  options?: FlyToOptions
): void {
  const viewer = ensureViewer();
  viewer.controls.flyTo(position, target, options);
}

/** 切换 2D / 3D 视图模式 */
export function setViewMode(mode: '2d' | '3d'): void {
  const viewer = ensureViewer();
  viewer.controls.setViewMode(mode);
}

/** 锁定相机，禁止用户交互 */
export function lockCamera(): void {
  const viewer = ensureViewer();
  viewer.controls.lock();
}

/** 解锁相机，恢复用户交互 */
export function unlockCamera(): void {
  const viewer = ensureViewer();
  viewer.controls.unlock();
}

/** 获取当前相机视角信息 */
export function getCameraViewpoint(): CameraViewpoint {
  const viewer = ensureViewer();
  return viewer.controls.getCameraViewpoint();
}

/** 设置相机视角 */
export function setCameraViewpoint(viewpoint: CameraViewpoint): void {
  const viewer = ensureViewer();
  viewer.controls.setCameraViewpoint(viewpoint);
}

// ─── 对象查询 ────────────────────────────────────────────────────────────────

/** 通过 ID 获取单个对象 */
export function getObjectById(id: string): any {
  const viewer = ensureViewer();
  return viewer.objectManager.getById(id);
}

/** 通过名称模糊查询对象列表 */
export function getObjectsByName(name: string): any[] {
  const viewer = ensureViewer();
  const set = viewer.objectManager.getByName(name);
  return set ? Array.from(set) : [];
}

/** 通过类型查询对象列表 */
export function getObjectsByType(type: string): any[] {
  const viewer = ensureViewer();
  const set = viewer.objectManager.getByType(type);
  return set ? Array.from(set) : [];
}

/** 获取场景中所有对象 */
export function getAllObjects(): any[] {
  const viewer = ensureViewer();
  const set = viewer.objectManager.getAll();
  return set ? Array.from(set) : [];
}

/** 获取对象或整个场景的包围盒 */
export function getBoundingBox(id?: string): any {
  const viewer = ensureViewer();
  return viewer.objectManager.getBoundingBox(id);
}

// ─── 视觉特效 ────────────────────────────────────────────────────────────────

/** 高亮指定对象 */
export function highlight(idOrName: string, options?: HighlightOptions): void {
  const viewer = ensureViewer();
  const obj = resolveObject(idOrName);
  getMaterialEffects().highlightColor(obj, options);
  viewer.render();
}

/** 移除对象高亮 */
export function removeHighlight(idOrName: string): void {
  const obj = resolveObject(idOrName);
  getMaterialEffects().removeHighlightColor(obj);
  ensureViewer().render();
}

/** 对象呼吸灯效果 */
export function breathe(idOrName: string, options?: BreatheOptions): void {
  const obj = resolveObject(idOrName);
  getMaterialEffects().breatheColor(obj, options);
  ensureViewer().render();
}

/** 移除呼吸灯效果 */
export function removeBreathe(idOrName: string): void {
  const obj = resolveObject(idOrName);
  getMaterialEffects().removeBreatheColor(obj);
  ensureViewer().render();
}

/** 淡入显示对象 */
export function fadeIn(idOrName: string, options?: FadeOptions): void {
  const obj = resolveObject(idOrName);
  getMaterialEffects().fadeIn(obj, options);
  ensureViewer().render();
}

/** 淡出隐藏对象 */
export function fadeOut(idOrName: string, options?: FadeOptions): void {
  const obj = resolveObject(idOrName);
  getMaterialEffects().fadeOut(obj, options);
  ensureViewer().render();
}

/** 切换线框模式 */
export function wireframe(idOrName: string, enabled?: boolean): void {
  const obj = resolveObject(idOrName);
  getMaterialEffects().wireframe(obj, enabled);
  ensureViewer().render();
}

// ─── 可见性 ──────────────────────────────────────────────────────────────────

/** 显示指定对象 */
export function show(id: string): void {
  const viewer = ensureViewer();
  viewer.objectManager.show(id);
}

/** 隐藏指定对象 */
export function hide(id: string): void {
  const viewer = ensureViewer();
  viewer.objectManager.hide(id);
}

/** 隔离显示指定对象（隐藏其他所有） */
export function isolate(ids: string[]): void {
  const viewer = ensureViewer();
  viewer.objectManager.isolate(ids);
}

/** 显示所有对象 */
export function showAll(): void {
  const viewer = ensureViewer();
  viewer.objectManager.showAll();
}

/** 设置对象透明度 */
export function setOpacity(id: string, opacity: number): void {
  const viewer = ensureViewer();
  viewer.objectManager.setOpacity(id, opacity);
}

// ─── 交互事件 ────────────────────────────────────────────────────────────────

/** 注册点击事件 */
export function onClick(
  idOrName: string,
  callback: (event: MouseEvent) => void
): void {
  const obj = resolveObject(idOrName);
  obj.addEventListener('click', (e: any) => callback(e.event));
}

/** 注册双击事件 */
export function onDblClick(
  idOrName: string,
  callback: (event: MouseEvent) => void
): void {
  const obj = resolveObject(idOrName);
  obj.addEventListener('dblclick', (e: any) => callback(e.event));
}

/** 注册悬停事件 */
export function onHover(
  idOrName: string,
  enterCallback: (event: MouseEvent) => void,
  leaveCallback: (event: MouseEvent) => void
): void {
  const viewer = ensureViewer();
  viewer.interactionManager.pointerMoveEventsEnabled = true;
  const obj = resolveObject(idOrName);
  obj.addEventListener('pointerenter', (e: any) => enterCallback(e.event));
  obj.addEventListener('pointerleave', (e: any) => leaveCallback(e.event));
}

/** 移除事件监听 */
export function removeEventListener(
  idOrName: string,
  type: string,
  callback: Function
): void {
  const obj = resolveObject(idOrName);
  obj.removeEventListener(type, callback as EventListener);
}

// ─── 标注 ────────────────────────────────────────────────────────────────────

/** 添加 CSS 标签到指定位置 */
// TODO: 待验证 viewer.cssRenderer.addLabel API 是否存在
export function addCssLabel(
  id: string,
  options: { position: IVector3; content: string; className?: string }
): void {
  const viewer = ensureViewer();
  viewer.cssRenderer.addLabel(id, options);
}

/** 移除 CSS 标签 */
// TODO: 待验证 viewer.cssRenderer.removeLabel API 是否存在
export function removeCssLabel(id: string): void {
  const viewer = ensureViewer();
  viewer.cssRenderer.removeLabel(id);
}

// ─── 灯光 ────────────────────────────────────────────────────────────────────

/** 应用预设灯光方案 */
export function applyLightPreset(
  name: 'indoor' | 'outdoor' | 'studio' | 'warehouse'
): void {
  const lm = ensureLightManager();
  lm.applyPreset(name);
}

/** 添加环境光 */
export function addAmbientLight(id: string, options?: LightOptions): void {
  const lm = ensureLightManager();
  lm.addAmbient(id, options);
}

/** 添加平行光 */
export function addDirectionalLight(id: string, options?: LightOptions): void {
  const lm = ensureLightManager();
  lm.addDirectional(id, options);
}

/** 添加点光源 */
export function addPointLight(id: string, options?: LightOptions): void {
  const lm = ensureLightManager();
  lm.addPoint(id, options);
}

/** 添加聚光灯 */
export function addSpotLight(id: string, options?: LightOptions): void {
  const lm = ensureLightManager();
  lm.addSpot(id, options);
}

/** 添加半球光 */
export function addHemisphereLight(id: string, options?: LightOptions): void {
  const lm = ensureLightManager();
  lm.addHemisphere(id, options);
}

/** 移除灯光 */
export function removeLight(id: string): void {
  const lm = ensureLightManager();
  lm.remove(id);
}

// ─── 工具 ────────────────────────────────────────────────────────────────────

/** 截图并返回 base64 数据 */
export async function screenshot(options?: ScreenshotOptions): Promise<string> {
  const viewer = ensureViewer();
  const result = await viewer.screenshot(options);
  // 始终返回完整 data URL，不管底层返回的是 data URL 还是 raw base64
  if (typeof result === 'string' && result.startsWith('data:')) {
    return result;
  }
  return `data:image/png;base64,${result}`;
}

/** 获取底层 Viewer 实例（escape hatch，谨慎使用） */
export function getViewer(): any {
  return ensureViewer();
}

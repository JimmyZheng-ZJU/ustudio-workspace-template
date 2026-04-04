/**
 * GongVue 3D 场景桥接层
 *
 * 业务面板通过 postMessage 控制 GongVue 的 3D 场景。
 * 所有命令都通过 Zustand store 在 GongVue 主页面执行。
 */

type GongVueCommand =
  | { action: 'NAVIGATE_TO'; spaceId: string }
  | { action: 'CHANGE_FLOOR'; floorIndex: number }
  | { action: 'FIT_TO_VIEW' }
  | { action: 'ZOOM_IN' }
  | { action: 'ZOOM_OUT' }
  | { action: 'SET_VISIBILITY'; key: string; value: boolean }
  | { action: 'SET_STYLING'; key: string; value: string | number }
  | { action: 'MOVE_CAMERA'; direction: 'up' | 'down' | 'left' | 'right' }
  | { action: 'ROTATE_CAMERA'; direction: 'left' | 'right' };

function sendCommand(command: GongVueCommand) {
  window.parent.postMessage({ type: 'gongvue-command', ...command }, '*');
}

/**
 * GongVue 3D 场景控制命令
 *
 * 使用示例：
 *   gv.navigateTo('Space_5')     — 飞到指定空间
 *   gv.changeFloor(2)            — 切换到第3层
 *   gv.show('spaceNames')        — 显示空间名称标签
 *   gv.hide('walls3D')           — 隐藏3D墙体
 *   gv.fitToView()               — 适配视图
 */
export const gv = {
  /** 飞到指定空间 */
  navigateTo: (spaceId: string) => sendCommand({ action: 'NAVIGATE_TO', spaceId }),

  /** 切换楼层（0-based） */
  changeFloor: (index: number) => sendCommand({ action: 'CHANGE_FLOOR', floorIndex: index }),

  /** 适配视图（显示整栋建筑） */
  fitToView: () => sendCommand({ action: 'FIT_TO_VIEW' }),

  /** 放大 */
  zoomIn: () => sendCommand({ action: 'ZOOM_IN' }),

  /** 缩小 */
  zoomOut: () => sendCommand({ action: 'ZOOM_OUT' }),

  /** 显示图层 */
  show: (key: string) => sendCommand({ action: 'SET_VISIBILITY', key, value: true }),

  /** 隐藏图层 */
  hide: (key: string) => sendCommand({ action: 'SET_VISIBILITY', key, value: false }),

  /** 设置样式 */
  setStyle: (key: string, value: string | number) => sendCommand({ action: 'SET_STYLING', key, value }),

  /** 移动相机 */
  moveCamera: (direction: 'up' | 'down' | 'left' | 'right') => sendCommand({ action: 'MOVE_CAMERA', direction }),

  /** 旋转相机 */
  rotateCamera: (direction: 'left' | 'right') => sendCommand({ action: 'ROTATE_CAMERA', direction }),
};

export { sendCommand };
export type { GongVueCommand };

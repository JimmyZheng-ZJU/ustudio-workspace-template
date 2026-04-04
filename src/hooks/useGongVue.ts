/**
 * GongVue 事件监听 Hook
 *
 * 监听 GongVue 3D 场景中发生的事件（如用户点击了某个空间）。
 *
 * 使用示例：
 *   useGongVueEvents((event) => {
 *     if (event.event === 'SPACE_CLICKED') {
 *       console.log('用户点击了空间:', event.spaceId, event.spaceName);
 *     }
 *   });
 */

import { useEffect, useCallback } from 'react';

export type GongVueEvent =
  | { event: 'SPACE_CLICKED'; spaceId: string; spaceName: string }
  | { event: 'FLOOR_CHANGED'; floorIndex: number }
  | { event: 'CAMERA_MOVED'; position: { x: number; y: number; z: number } };

export function useGongVueEvents(callback: (event: GongVueEvent) => void) {
  const stableCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'gongvue-event') {
        stableCallback(e.data as GongVueEvent);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [stableCallback]);
}

---
name: ustudio-coding-rules
type: repo
version: 1.0.0
agent: CodeActAgent
---

# uStudio AI Coding 助手

你是 uStudio AI Coding 助手，在一个已加载好 3D 场景的模板项目中工作。你的任务是帮助用户基于已有的 3D 场景模板，编写业务逻辑和 UI 组件。

---

## CRITICAL — 绝对禁止

> **以下规则不可违反，任何情况下都必须遵守。**

1. **永远不要修改 `src/core/` 下的任何文件。** 这些文件是模板基础设施，由平台维护。
2. **永远不要直接 `import 'u-space'` 或 `import 'u-space/plugins/*'`。** 所有 3D 操作必须通过 `@ustudio/facade` 进行。
3. **永远不要自己编写 `SceneLoader`、`Viewer` 初始化、`setPath`、`setKey` 代码。** 场景加载已由模板完成。
4. **永远不要使用 `import {...} from 'three'`。** 如果确实需要 Three.js 类型，使用 `import {...} from 'three/webgpu'`。
5. **永远不要修改 `vite.config.ts`、`main.tsx`、`package.json`。** 构建配置和入口文件由平台管理。

### UI 布局规则（CRITICAL — 必须遵守）

3D 场景在底层，React UI 叠加在上层。`#root` 已设置 `pointer-events: none`，所以：

1. **页面最外层容器 background 必须是 transparent**，不能用不透明颜色
2. **每个需要交互的面板必须单独设置 `pointerEvents: 'auto'`**，否则按钮无法点击
3. 面板只占边缘位置，中间留给 3D 场景
4. **不要用一个 div 铺满整个屏幕（`inset: 0`）来包裹所有面板**，这会挡住 3D 交互

```tsx
// ✅ 正确：每个面板独立定位，各自设 pointerEvents: 'auto'
<>
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 60, background: 'rgba(0,20,40,0.9)', pointerEvents: 'auto' }}>
    工具栏
  </div>
  <div style={{ position: 'fixed', left: 16, top: 80, width: 140, background: 'rgba(0,20,40,0.9)', borderRadius: 12, padding: 16, pointerEvents: 'auto' }}>
    左面板
  </div>
  <div style={{ position: 'fixed', right: 16, top: 80, width: 320, background: 'rgba(0,20,40,0.9)', borderRadius: 12, padding: 16, pointerEvents: 'auto' }}>
    右面板
  </div>
  <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 50, background: 'rgba(0,20,40,0.9)', pointerEvents: 'auto' }}>
    状态栏
  </div>
</>

// ❌ 错误：外层容器铺满屏幕挡住 3D
<div style={{ position: 'fixed', inset: 0, background: 'transparent' }}>
  <header>...</header>
  <aside>...</aside>
</div>
```

---

## API 速查 — `@ustudio/facade`

所有 3D 场景操作统一通过 `@ustudio/facade` 调用。以下是完整 API 列表：

### 相机控制

```typescript
/** 飞向指定对象（通过 ID 或名称） */
flyToObject(idOrName: string, options?: { viewpoint?: string; enableTransition?: boolean; padding?: number; cover?: boolean }): void;

/** 飞向指定位置和朝向 */
flyToPosition(position: IVector3, target: IVector3, options?: { enableTransition?: boolean }): void;

/** 切换 2D / 3D 视图模式 */
setViewMode(mode: '2d' | '3d'): void;

/** 锁定相机，禁止用户交互 */
lockCamera(): void;

/** 解锁相机，恢复用户交互 */
unlockCamera(): void;

/** 获取当前相机视角信息，返回 { position: IVector3; target: IVector3; zoom: number } */
getCameraViewpoint(): CameraViewpoint;

/** 设置相机视角，参数类型 { position: IVector3; target: IVector3; zoom: number } */
setCameraViewpoint(viewpoint: CameraViewpoint): void;
```

> **注意：** flyToObject 对 Group 类型的空对象（没有子 mesh）会报 "Box3 is empty" 警告。建议始终用 try-catch 包裹：
> ```typescript
> try {
>   flyToObject(id, { enableTransition: true });
> } catch(e) {
>   console.warn('flyToObject failed:', e);
> }
> ```

### 对象查询

```typescript
/** 通过 ID 获取单个对象 */
getObjectById(id: string): Object3D | undefined;

/** 通过名称模糊查询对象列表 */
getObjectsByName(name: string): Object3D[];

/** 通过类型查询对象列表 */
getObjectsByType(type: string): Object3D[];

/** 获取场景中所有对象 */
getAllObjects(): Object3D[];

/** 获取对象或整个场景的包围盒 */
getBoundingBox(id?: string): Box3;
```

### 重要：对象 ID 的正确用法

facade 中所有接收 `idOrName` 参数的函数（`flyToObject`、`highlight`、`isolate` 等），内部会先尝试 `objectManager.getById()`，找不到再尝试 `getByName()`。

**正确做法——先查询再操作：**

```typescript
// ✅ 正确：先查到对象，用对象的 name 或 id 操作
const floors = getObjectsByName('3F');
if (floors.length > 0) {
  const floorId = floors[0].name;
  isolate([floorId]);
  flyToObject(floorId, { enableTransition: true });
}
```

```typescript
// ❌ 错误：直接用字符串，如果 objectManager 里没有注册这个名称会抛异常
isolate(['3F']);
flyToObject('3F');
```

`isolate()` 接收的是 ID 数组，每个 ID 必须是 objectManager 中已注册的对象 ID。

### 视觉特效

```typescript
/** 高亮指定对象 */
highlight(idOrName: string, options?: { color?: number | string; opacity?: number; overwrite?: boolean; depthWrite?: boolean }): void;

/** 移除对象高亮 */
removeHighlight(idOrName: string): void;

/** 对象呼吸灯效果 */
breathe(idOrName: string, options?: { color?: number | string; speed?: number; intensity?: number }): void;

/** 移除呼吸灯效果 */
removeBreathe(idOrName: string): void;

/** 淡入显示对象 */
fadeIn(idOrName: string, options?: FadeOptions): void;

/** 淡出隐藏对象 */
fadeOut(idOrName: string, options?: FadeOptions): void;

/** 切换线框模式 */
wireframe(idOrName: string, enabled?: boolean): void;
```

### 可见性

```typescript
/** 显示指定对象 */
show(id: string): void;

/** 隐藏指定对象 */
hide(id: string): void;

/** 隔离显示指定对象（隐藏其他所有） */
isolate(ids: string[]): void;

/** 显示所有对象 */
showAll(): void;

/** 设置对象透明度 */
setOpacity(id: string, opacity: number): void;
```

### 交互事件

```typescript
/** 注册点击事件 */
onClick(idOrName: string, callback: (event: MouseEvent) => void): void;

/** 注册双击事件 */
onDblClick(idOrName: string, callback: (event: MouseEvent) => void): void;

/** 注册悬停事件 */
onHover(idOrName: string, enterCallback: (event: MouseEvent) => void, leaveCallback: (event: MouseEvent) => void): void;

/** 移除事件监听 */
removeEventListener(idOrName: string, type: string, callback: Function): void;
```

### 标注

```typescript
/** 添加 CSS 标签到指定位置 */
addCssLabel(id: string, options: { position: IVector3; content: string; className?: string }): void;

/** 移除 CSS 标签 */
removeCssLabel(id: string): void;
```

### 灯光

```typescript
/** 应用预设灯光方案 */
applyLightPreset(name: 'indoor' | 'outdoor' | 'studio' | 'warehouse'): void;

/** 添加环境光 */
addAmbientLight(id: string, options?: LightOptions): void;

/** 添加平行光 */
addDirectionalLight(id: string, options?: LightOptions): void;

/** 添加点光源 */
addPointLight(id: string, options?: LightOptions): void;

/** 添加聚光灯 */
addSpotLight(id: string, options?: LightOptions): void;

/** 添加半球光 */
addHemisphereLight(id: string, options?: LightOptions): void;

/** 移除灯光 */
removeLight(id: string): void;
```

### 工具

```typescript
/** 截图并返回完整的 data URL（如 "data:image/png;base64,xxxxx"） */
screenshot(options?: ScreenshotOptions): Promise<string>;

/** 获取底层 Viewer 实例（escape hatch，谨慎使用） */
getViewer(): Viewer;
```

> **注意：** `screenshot()` 返回的是完整的 data URL（如 `"data:image/png;base64,xxxxx"`），可以直接赋值给 `<img>` 的 `src`。不要再拼接 `"data:image/png;base64,"` 前缀，否则会导致 ERR_INVALID_URL。
> ```typescript
> // ✅ 正确
> const dataUrl = await screenshot();
> <img src={dataUrl} />
>
> // ❌ 错误：双重编码
> <img src={`data:image/png;base64,${dataUrl}`} />
> ```

---

## 常用模式

### 示例 1：设备监控面板

查询所有传感器 → 点击高亮 → 飞向 → 显示数据面板

```tsx
import { getAllObjects, highlight, removeHighlight, flyToObject, onClick } from '@ustudio/facade';
import { useState } from 'react';

export default function DeviceMonitor() {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const sensors = getAllObjects().filter(obj => obj.name.startsWith('sensor_'));

  const handleSensorClick = (sensorId: string) => {
    if (selectedDevice) removeHighlight(selectedDevice);
    highlight(sensorId, { color: '#00ff00' });
    flyToObject(sensorId, { enableTransition: true });
    setSelectedDevice(sensorId);
  };

  // 为每个传感器注册点击事件
  sensors.forEach(sensor => {
    onClick(sensor.name, () => handleSensorClick(sensor.name));
  });

  return (
    <div className="monitor-panel">
      <h3>设备监控</h3>
      {selectedDevice && <div className="device-info">当前选中: {selectedDevice}</div>}
    </div>
  );
}
```

### 示例 2：告警联动

接收告警 → 定位对象 → 呼吸灯 → 弹窗

```tsx
import { breathe, removeBreathe, flyToObject } from '@ustudio/facade';
import { useEffect, useState } from 'react';

interface Alarm {
  id: string;
  objectId: string;
  message: string;
  level: 'warning' | 'error';
}

export default function AlarmHandler() {
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);

  useEffect(() => {
    // 模拟接收告警（实际项目中接入 WebSocket 或轮询）
    const ws = new WebSocket('/api/alarms');
    ws.onmessage = (e) => {
      const alarm: Alarm = JSON.parse(e.data);
      setActiveAlarm(alarm);
      flyToObject(alarm.objectId, { enableTransition: true });
      breathe(alarm.objectId, {
        color: alarm.level === 'error' ? '#ff0000' : '#ffaa00',
        speed: 1.5,
      });
    };
    return () => ws.close();
  }, []);

  const dismissAlarm = () => {
    if (activeAlarm) {
      removeBreathe(activeAlarm.objectId);
      setActiveAlarm(null);
    }
  };

  if (!activeAlarm) return null;

  return (
    <div className="alarm-popup">
      <h4>告警: {activeAlarm.message}</h4>
      <p>对象: {activeAlarm.objectId}</p>
      <button onClick={dismissAlarm}>确认</button>
    </div>
  );
}
```

### 示例 3：楼层切换

先查询对象 → isolate 目标楼层 → flyToObject（带 try-catch）

```tsx
import { getObjectsByName, isolate, showAll, flyToObject, highlight, removeHighlight } from '@ustudio/facade';
import { useState } from 'react';

const FLOORS = ['1F', '2F', '3F', '4F', '5F'];

export default function FloorSwitcher() {
  const [activeFloor, setActiveFloor] = useState<string | null>(null);

  const handleFloorClick = (floorName: string) => {
    if (activeFloor === floorName) {
      showAll();
      setActiveFloor(null);
      return;
    }
    const objects = getObjectsByName(floorName);
    if (objects.length === 0) {
      console.warn(`Floor ${floorName} not found`);
      return;
    }
    const ids = objects.map(o => o.name);
    isolate(ids);
    try {
      flyToObject(ids[0], { enableTransition: true });
    } catch(e) {
      console.warn('flyToObject failed:', e);
    }
    setActiveFloor(floorName);
  };

  return (
    <div style={{ position: 'fixed', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(20,20,30,0.85)', borderRadius: 12, padding: 16, color: '#fff' }}>
      <h3 style={{ margin: '0 0 12px' }}>楼层切换</h3>
      {FLOORS.map(f => (
        <button key={f} onClick={() => handleFloorClick(f)}
          style={{ display: 'block', width: '100%', padding: '10px', margin: '4px 0', borderRadius: 6, border: 'none', cursor: 'pointer', background: activeFloor === f ? '#22c55e' : 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 14 }}>
          {f}
        </button>
      ))}
      {activeFloor && (
        <button onClick={() => { showAll(); setActiveFloor(null); }}
          style={{ display: 'block', width: '100%', padding: '10px', margin: '8px 0 0', borderRadius: 6, border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: 14 }}>
          显示全部
        </button>
      )}
    </div>
  );
}
```

---

## 场景数据查询规范

当需要查询场景有哪些对象、空间、传感器等信息时，通过 uStudio OpenAPI 接口查询。

`BASE_URL` 从环境变量 `USTUDIO_API_BASE` 获取。

所有响应格式统一为：

```json
{
  "success": true,
  "errcode": "0000",
  "errmsg": "",
  "result": { ... }
}
```

分页数据位于 `result.rows`（数组）和 `result.total_count`（总数）。

### 最常用接口

```typescript
/** 获取场景详情 */
POST ${BASE_URL}/api/twins/scene/v1/detail
Body: { scene_id: string }
Response.result: { scene_id, name, scene_background_model_url, decrypt_key, ... }

/** 实体实例分页查询 */
POST ${BASE_URL}/api/twins/instance/v1/page
Body: { twins_name?: string, twins_identifier?: string, page_no: number, page_size: number }
Response.result: { rows: EntityInstance[], total_count: number }

/** 实体实例条件查询 */
POST ${BASE_URL}/api/twins/instance/v1/query
Body: { twins_id?: string, twins_identifier?: string }
Response.result: { rows: EntityInstance[], total_count: number }
```

---

## 你的工作目录

- `src/pages/` — 页面组件，你可以自由创建和修改。
- `src/components/` — 通用组件，你可以自由创建和修改。
- `src/App.tsx` — 路由配置，你可以添加新路由。
- **其他一切文件都是只读的。**

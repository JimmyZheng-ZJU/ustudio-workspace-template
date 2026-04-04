# 模板使用指南（给 AI Agent）

## 这是什么

这个模板生成的是**业务面板**，会以 iframe 的方式嵌入到 GongVue 3D 空间平台的右侧 Tab 中。

**你不需要写任何 3D/Three.js 代码。** 3D 场景由 GongVue 负责渲染。

## 3D 场景联动

### 控制 3D 场景（从业务面板发出命令）

```typescript
import { gv } from '../lib/gongvueBridge';

// 飞到指定空间
gv.navigateTo('Space_5');

// 切换楼层
gv.changeFloor(2);

// 适配视图
gv.fitToView();

// 显示/隐藏图层
gv.show('spaceNames');    // 显示空间名称
gv.hide('walls3D');       // 隐藏3D墙体

// 设置样式
gv.setStyle('spaceOpacity', 0.8);

// 缩放
gv.zoomIn();
gv.zoomOut();
```

### 监听 3D 场景事件（用户在 3D 中点击了空间）

```typescript
import { useGongVueEvents } from '../hooks/useGongVue';

useGongVueEvents((event) => {
  if (event.event === 'SPACE_CLICKED') {
    console.log('用户点击了:', event.spaceId, event.spaceName);
    // 在业务面板中显示该空间的信息
  }
});
```

## 后端 API

模板预置了 Express + SQLite 后端（端口 3001）。

### 新建业务表

在 `server/database.js` 的 `initDatabase()` 里加：

```javascript
db.exec(`CREATE TABLE IF NOT EXISTS inspections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  space_id TEXT,
  status TEXT DEFAULT 'pending',
  remark TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);
```

### 新建业务路由

参照以下模式在 `server/routes/` 下新建文件：

```javascript
const express = require('express');
const { findAll, insert, update, remove } = require('../database');
const { success, fail } = require('../response');
const router = express.Router();

router.get('/', (req, res) => {
  const result = findAll('inspections', { page: Number(req.query.page || 1) });
  success(res, result.rows, 'success', result.total);
});

router.post('/', (req, res) => {
  const item = insert('inspections', req.body);
  success(res, item);
});

module.exports = router;
```

在 `server/server.js` 注册：

```javascript
app.use('/api/inspections', require('./routes/inspections'));
```

### 前端调用 API

```typescript
import { useApi, apiCall } from '../hooks/useApi';

// GET 请求
const { data, total, loading } = useApi('/api/inspections', { page: 1 });

// POST 请求
await apiCall('POST', '/api/inspections', { space_id: 'Space_5', status: 'pending' });
```

## 启动

```bash
bash start.sh
```

## UI 风格

业务面板的背景是深色（`#0a0f1c`），与 GongVue 的深色主题一致。

## 注意事项

- 前端通过 `/api/...` 相对路径调用后端（Vite proxy 转发到 localhost:3001）
- 不要使用 `http://localhost:3001` 绝对路径
- 不要写任何 Three.js / 3D 渲染代码
- 所有 3D 交互通过 `gv.xxx()` 命令完成

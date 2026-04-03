# uStudio 模板使用指南（给 AI Agent）

## 模板已包含的能力

### 后端（server/ 目录，端口 3001）
- **Express API 服务** — CORS 已配置，JSON 解析已启用
- **SQLite 数据库** — 启动时自动初始化，支持 WAL 模式
- **JWT 用户认证** — 3 个默认账号：admin/admin123、captain/captain123、inspector/inspector123
- **文件上传** — POST /api/upload（单文件）、POST /api/upload/multiple（多文件）
- **操作日志** — 所有增删改操作自动记录到 operation_logs 表
- **统一响应格式** — { code: 0, message: "success", data: {...}, total: 100 }
- **数据导出** — exportCSV() 和 exportJSON() 工具函数

### 前端通用组件（src/components/common/）
| 组件 | 用途 | Props |
|------|------|-------|
| DataTable | 数据表格 | columns, data, total, page, pageSize, onPageChange, onSort, onRowClick |
| FormModal | 表单弹窗 | title, fields, initialValues, onSubmit, onClose |
| StatCard | 统计卡片 | title, value, unit, trend, color |
| StatusBadge | 状态标签 | status, statusMap |
| StatusFlow | 状态流转 | steps, currentStep |
| ImageUpload | 图片上传 | value, onChange, maxCount |
| SignaturePad | 手写签名 | onSave |
| Checklist | 检查清单 | items, onItemChange |
| BarChart | 柱状图 | data, width, height, color |
| PieChart | 饼图 | data, width, height |
| LineChart | 折线图 | data, width, height, color |

### API Hook（src/hooks/useApi.ts）
```tsx
import { useApi, apiCall } from '../hooks/useApi';

// GET 请求（自动加载）
const { data, total, loading, error, refetch } = useApi('/api/inspections', { page: 1, pageSize: 20 });

// POST/PUT/DELETE 请求
const result = await apiCall('POST', '/api/inspections', { name: '任务1', status: 'pending' });
```

### 3D 场景（src/core/，不要修改）
```tsx
import { getAllObjects, flyToObject, highlight } from '@ustudio/facade';
```

---

## 你需要做的

### 1. 建业务表

在 `server/database.js` 的 `initDatabase()` 函数底部加表：

```javascript
db.exec(`CREATE TABLE IF NOT EXISTS inspections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  station_id INTEGER,
  inspector_id INTEGER,
  status TEXT DEFAULT 'pending',
  score INTEGER DEFAULT 0,
  remark TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);
```

### 2. 写业务路由

参照 `server/routes/example.js`，在 `server/routes/` 下新建文件：

```javascript
// server/routes/inspections.js
const express = require('express');
const { findAll, findById, insert, update, remove } = require('../database');
const { success, fail } = require('../response');
const router = express.Router();

const TABLE = 'inspections';

router.get('/', (req, res) => {
  const { page = 1, pageSize = 20, status } = req.query;
  let where = '';
  const params = [];
  if (status) { where = 'status = ?'; params.push(status); }
  const result = findAll(TABLE, { page: Number(page), pageSize: Number(pageSize), where, params });
  success(res, result.rows, 'success', result.total);
});

router.post('/', (req, res) => {
  const item = insert(TABLE, req.body);
  success(res, item);
});

// ... 更多路由

module.exports = router;
```

### 3. 在 server.js 里注册路由

在 `// === Register business routes below this line ===` 注释下方加：

```javascript
app.use('/api/inspections', require('./routes/inspections'));
```

### 4. 写前端页面

在 `src/pages/` 下新建页面，使用通用组件：

```tsx
import { useApi, apiCall } from '../hooks/useApi';
import { DataTable } from '../components/common/DataTable';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { FormModal } from '../components/common/FormModal';
```

### 5. 启动

运行 `bash start.sh` 即可，不需要手动启动后端和前端。

---

## 注意事项

- **不要修改 src/core/ 目录** — 这是 3D 引擎的核心文件
- **不要修改 index.html、main.tsx、package.json** — 模板配置
- **使用 @ustudio/facade 的 API** — 不要直接访问 window.__viewer
- **前端通过 Vite 代理访问后端** — fetch('/api/...') 会自动代理到 localhost:3001
- **所有 UI 面板必须用 position: fixed + pointerEvents: auto** — 否则会阻挡 3D 交互

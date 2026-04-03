const express = require('express');
const { findAll, findById, insert, update, remove, createTable } = require('../database');
const { success, fail } = require('../response');
const { exportCSV } = require('../export');

const router = express.Router();
const TABLE = 'example_items';

// Initialize table
createTable(TABLE, `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  description TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
`);

// List with pagination + filtering
router.get('/', (req, res) => {
  const { page = 1, pageSize = 20, status, type, keyword } = req.query;
  let where = '';
  const params = [];
  if (status) { where += (where ? ' AND ' : '') + 'status = ?'; params.push(status); }
  if (type) { where += (where ? ' AND ' : '') + 'type = ?'; params.push(type); }
  if (keyword) { where += (where ? ' AND ' : '') + 'name LIKE ?'; params.push(`%${keyword}%`); }
  const result = findAll(TABLE, { page: Number(page), pageSize: Number(pageSize), where, params });
  success(res, result.rows, 'success', result.total);
});

// Get by ID
router.get('/:id', (req, res) => {
  const item = findById(TABLE, req.params.id);
  if (!item) return fail(res, '未找到', -1, 404);
  success(res, item);
});

// Create
router.post('/', (req, res) => {
  const { name, type, status, description } = req.body;
  if (!name) return fail(res, '名称不能为空');
  const item = insert(TABLE, { name, type: type || '', status: status || 'pending', description: description || '' });
  success(res, item);
});

// Update
router.put('/:id', (req, res) => {
  const existing = findById(TABLE, req.params.id);
  if (!existing) return fail(res, '未找到', -1, 404);
  const item = update(TABLE, req.params.id, { ...req.body, updated_at: new Date().toISOString() });
  success(res, item);
});

// Delete
router.delete('/:id', (req, res) => {
  const existing = findById(TABLE, req.params.id);
  if (!existing) return fail(res, '未找到', -1, 404);
  remove(TABLE, req.params.id);
  success(res, { id: req.params.id });
});

// Export
router.get('/actions/export', (req, res) => {
  const { rows } = findAll(TABLE, { pageSize: 10000 });
  exportCSV(res, rows, 'example_export.csv');
});

module.exports = router;

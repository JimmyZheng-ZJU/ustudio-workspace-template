const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'app.db');
let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDatabase() {
  const db = getDb();
  db.exec(`CREATE TABLE IF NOT EXISTS operation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    target_table TEXT,
    target_id INTEGER,
    detail TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  return db;
}

function createTable(name, columnsSql) {
  getDb().exec(`CREATE TABLE IF NOT EXISTS ${name} (${columnsSql})`);
}

function insert(table, data) {
  const db = getDb();
  const keys = Object.keys(data);
  const placeholders = keys.map(() => '?').join(', ');
  const stmt = db.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`);
  const result = stmt.run(...keys.map(k => data[k]));
  return { id: result.lastInsertRowid, ...data };
}

function update(table, id, data) {
  const db = getDb();
  const keys = Object.keys(data);
  const sets = keys.map(k => `${k} = ?`).join(', ');
  db.prepare(`UPDATE ${table} SET ${sets} WHERE id = ?`).run(...keys.map(k => data[k]), id);
  return findById(table, id);
}

function remove(table, id) {
  getDb().prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
}

function findById(table, id) {
  return getDb().prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
}

function findAll(table, { page = 1, pageSize = 20, orderBy = 'id DESC', where = '', params = [] } = {}) {
  const db = getDb();
  const w = where ? `WHERE ${where}` : '';
  const total = db.prepare(`SELECT COUNT(*) as count FROM ${table} ${w}`).get(...params).count;
  const offset = (Math.max(1, page) - 1) * pageSize;
  const rows = db.prepare(`SELECT * FROM ${table} ${w} ORDER BY ${orderBy} LIMIT ? OFFSET ?`).all(...params, pageSize, offset);
  return { rows, total, page, pageSize };
}

function count(table, where = '', params = []) {
  const w = where ? `WHERE ${where}` : '';
  return getDb().prepare(`SELECT COUNT(*) as count FROM ${table} ${w}`).get(...params).count;
}

module.exports = { getDb, initDatabase, createTable, insert, update, remove, findById, findAll, count };

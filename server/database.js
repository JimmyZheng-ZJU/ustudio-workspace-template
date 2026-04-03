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

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS operation_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT,
      target_table TEXT,
      target_id INTEGER,
      detail TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function createTable(name, columnsSql) {
  const db = getDb();
  db.exec(`CREATE TABLE IF NOT EXISTS ${name} (${columnsSql})`);
}

function insert(table, data) {
  const db = getDb();
  const keys = Object.keys(data);
  const placeholders = keys.map(() => '?').join(', ');
  const columns = keys.join(', ');
  const values = keys.map(k => data[k]);
  const stmt = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);
  const result = stmt.run(...values);
  return { id: result.lastInsertRowid, ...data };
}

function update(table, id, data) {
  const db = getDb();
  const keys = Object.keys(data);
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => data[k]);
  const stmt = db.prepare(`UPDATE ${table} SET ${setClause} WHERE id = ?`);
  stmt.run(...values, id);
  return findById(table, id);
}

function remove(table, id) {
  const db = getDb();
  const stmt = db.prepare(`DELETE FROM ${table} WHERE id = ?`);
  stmt.run(id);
}

function findById(table, id) {
  const db = getDb();
  const stmt = db.prepare(`SELECT * FROM ${table} WHERE id = ?`);
  return stmt.get(id);
}

function findAll(table, { page = 1, pageSize = 20, orderBy = 'id DESC', where = '', params = [] } = {}) {
  const db = getDb();
  const whereClause = where ? `WHERE ${where}` : '';
  const offset = (Math.max(1, page) - 1) * pageSize;

  const countStmt = db.prepare(`SELECT COUNT(*) as total FROM ${table} ${whereClause}`);
  const { total } = countStmt.get(...params);

  const rowsStmt = db.prepare(`SELECT * FROM ${table} ${whereClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`);
  const rows = rowsStmt.all(...params, pageSize, offset);

  return { rows, total, page, pageSize };
}

function count(table, where = '', params = []) {
  const db = getDb();
  const whereClause = where ? `WHERE ${where}` : '';
  const stmt = db.prepare(`SELECT COUNT(*) as total FROM ${table} ${whereClause}`);
  const result = stmt.get(...params);
  return result.total;
}

function query(sql, params = []) {
  const db = getDb();
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

function run(sql, params = []) {
  const db = getDb();
  const stmt = db.prepare(sql);
  return stmt.run(...params);
}

module.exports = {
  getDb,
  initDatabase,
  createTable,
  insert,
  update,
  remove,
  findById,
  findAll,
  count,
  query,
  run,
};

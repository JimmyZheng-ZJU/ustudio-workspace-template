const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'app.db');
let db;

async function getDb() {
  if (!db) {
    const SQL = await initSqlJs();
    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }
  }
  return db;
}

function saveDb() {
  if (db) {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
}

async function initDatabase() {
  const db = await getDb();
  db.run(`CREATE TABLE IF NOT EXISTS operation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    target_table TEXT,
    target_id INTEGER,
    detail TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  saveDb();
  return db;
}

async function createTable(name, columnsSql) {
  const db = await getDb();
  db.run(`CREATE TABLE IF NOT EXISTS ${name} (${columnsSql})`);
  saveDb();
}

async function insert(table, data) {
  const db = await getDb();
  const keys = Object.keys(data);
  const placeholders = keys.map(() => '?').join(', ');
  db.run(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`, keys.map(k => data[k]));
  const result = db.exec('SELECT last_insert_rowid() as id');
  const id = result[0]?.values[0]?.[0] || 0;
  saveDb();
  return { id, ...data };
}

async function update(table, id, data) {
  const db = await getDb();
  const keys = Object.keys(data);
  const sets = keys.map(k => `${k} = ?`).join(', ');
  db.run(`UPDATE ${table} SET ${sets} WHERE id = ?`, [...keys.map(k => data[k]), id]);
  saveDb();
  return await findById(table, id);
}

async function remove(table, id) {
  const db = await getDb();
  db.run(`DELETE FROM ${table} WHERE id = ?`, [id]);
  saveDb();
}

async function findById(table, id) {
  const db = await getDb();
  const result = db.exec(`SELECT * FROM ${table} WHERE id = ?`, [id]);
  if (!result[0] || !result[0].values[0]) return null;
  const cols = result[0].columns;
  const row = result[0].values[0];
  return Object.fromEntries(cols.map((c, i) => [c, row[i]]));
}

async function findAll(table, { page = 1, pageSize = 20, orderBy = 'id DESC', where = '', params = [] } = {}) {
  const db = await getDb();
  const w = where ? `WHERE ${where}` : '';
  const countResult = db.exec(`SELECT COUNT(*) as count FROM ${table} ${w}`, params);
  const total = countResult[0]?.values[0]?.[0] || 0;
  const offset = (Math.max(1, page) - 1) * pageSize;
  const result = db.exec(`SELECT * FROM ${table} ${w} ORDER BY ${orderBy} LIMIT ? OFFSET ?`, [...params, pageSize, offset]);
  const rows = [];
  if (result[0]) {
    const cols = result[0].columns;
    for (const row of result[0].values) {
      rows.push(Object.fromEntries(cols.map((c, i) => [c, row[i]])));
    }
  }
  return { rows, total, page, pageSize };
}

async function count(table, where = '', params = []) {
  const db = await getDb();
  const w = where ? `WHERE ${where}` : '';
  const result = db.exec(`SELECT COUNT(*) as count FROM ${table} ${w}`, params);
  return result[0]?.values[0]?.[0] || 0;
}

module.exports = { getDb, initDatabase, createTable, insert, update, remove, findById, findAll, count, saveDb };

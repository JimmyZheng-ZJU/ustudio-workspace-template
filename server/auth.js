const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../database');
const { success, fail } = require('../response');

const router = express.Router();
const JWT_SECRET = 'ustudio-secret-key-2026';

// POST /login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return fail(res, 'username and password are required');
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    return fail(res, 'invalid username or password', -1, 401);
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    return fail(res, 'invalid username or password', -1, 401);
  }

  const payload = { id: user.id, username: user.username, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  success(res, {
    token,
    user: { id: user.id, username: user.username, role: user.role, name: user.name, phone: user.phone },
  });
});

// POST /register
router.post('/register', (req, res) => {
  const { username, password, role = 'user', name = null, phone = null } = req.body;
  if (!username || !password) {
    return fail(res, 'username and password are required');
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return fail(res, 'username already exists');
  }

  const password_hash = bcrypt.hashSync(password, 10);
  const stmt = db.prepare(
    'INSERT INTO users (username, password_hash, role, name, phone) VALUES (?, ?, ?, ?, ?)'
  );
  const result = stmt.run(username, password_hash, role, name, phone);

  success(res, {
    id: result.lastInsertRowid,
    username,
    role,
    name,
    phone,
  });
});

// GET /me
router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return fail(res, 'authorization token required', -1, 401);
  }

  const token = authHeader.slice(7);
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return fail(res, 'invalid or expired token', -1, 401);
  }

  const db = getDb();
  const user = db
    .prepare('SELECT id, username, role, name, phone FROM users WHERE id = ?')
    .get(decoded.id);
  if (!user) {
    return fail(res, 'user not found', -1, 404);
  }

  success(res, user);
});

module.exports = router;

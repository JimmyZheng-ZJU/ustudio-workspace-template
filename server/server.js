const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const { initDatabase, insert, findAll } = require('./database');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database
initDatabase();

// Seed default users if admin doesn't exist
(async () => {
  const { rows } = findAll('users', { where: "username = 'admin'", pageSize: 1 });
  if (rows.length === 0) {
    const defaultUsers = [
      { username: 'admin',     password: 'admin123',     role: 'admin',     name: '管理员' },
      { username: 'captain',   password: 'captain123',   role: 'captain',   name: '队长' },
      { username: 'inspector', password: 'inspector123', role: 'inspector', name: '巡检员' },
    ];
    for (const u of defaultUsers) {
      const password_hash = bcrypt.hashSync(u.password, 10);
      insert('users', { username: u.username, password_hash, role: u.role, name: u.name });
    }
    console.log('Default users seeded.');
  }
})();

// Routes
app.get('/health', (req, res) => {
  res.json({ code: 0, message: 'ok' });
});

app.use('/api/auth', require('./auth'));
app.use('/api/upload', require('./upload'));
app.use('/api/example', require('./routes/example'));

app.listen(3001, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:3001');
});

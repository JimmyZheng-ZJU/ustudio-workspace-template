const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./database');
const { success } = require('./response');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

initDatabase();

app.get('/health', (req, res) => success(res, { status: 'ok' }));

// === Register business routes below this line ===

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Business API running on http://localhost:${PORT}`);
});

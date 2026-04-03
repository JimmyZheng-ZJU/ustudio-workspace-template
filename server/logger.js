const { getDb } = require('./database');

const METHOD_ACTION_MAP = {
  POST: 'create',
  PUT: 'update',
  DELETE: 'delete',
};

function operationLogger(req, res, next) {
  const originalJson = res.json.bind(res);

  res.json = function (body) {
    // Call the original res.json first
    originalJson(body);

    // Only log POST/PUT/DELETE with successful response (code === 0)
    const method = req.method;
    if (!METHOD_ACTION_MAP[method]) return;
    if (!body || body.code !== 0) return;

    try {
      const db = getDb();
      const action = METHOD_ACTION_MAP[method];

      // Derive target_table from URL path (first meaningful segment)
      const segments = req.path.replace(/^\//, '').split('/').filter(Boolean);
      const target_table = segments[0] || null;

      const target_id = (body.data && body.data.id) ? body.data.id : null;

      const detail = JSON.stringify({
        url: req.originalUrl || req.url,
        body: req.body,
      });

      const user_id = req.user ? req.user.id : null;

      db.prepare(
        `INSERT INTO operation_logs (user_id, action, target_table, target_id, detail) VALUES (?, ?, ?, ?, ?)`
      ).run(user_id, action, target_table, target_id, detail);
    } catch (err) {
      console.error('[operationLogger] Failed to write log:', err.message);
    }
  };

  next();
}

module.exports = { operationLogger };

const jwt = require('jsonwebtoken');
const { fail } = require('../response');

const JWT_SECRET = 'ustudio-secret-key-2026';

function authRequired(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return fail(res, 'authorization token required', -1, 401);
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return fail(res, 'invalid or expired token', -1, 401);
  }
}

function roleRequired(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return fail(res, 'forbidden: insufficient role', -1, 403);
    }
    next();
  };
}

module.exports = { authRequired, roleRequired };

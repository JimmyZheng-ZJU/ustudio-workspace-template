function success(res, data = null, message = 'success', total = undefined) {
  const body = { code: 0, message, data };
  if (total !== undefined) body.total = total;
  res.json(body);
}

function fail(res, message = 'error', code = -1, status = 400) {
  res.status(status).json({ code, message });
}

module.exports = { success, fail };

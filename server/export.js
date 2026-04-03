/**
 * Escape a single CSV cell value.
 * Wraps in double-quotes if the value contains commas, double-quotes, or newlines.
 */
function escapeCSVValue(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Convert an array of objects to a CSV string with BOM for Excel UTF-8 compatibility.
 * @param {object[]} data
 * @returns {string}
 */
function toCSVString(data) {
  if (!data || data.length === 0) return '\uFEFF';

  const headers = Object.keys(data[0]);
  const headerRow = headers.map(escapeCSVValue).join(',');
  const dataRows = data.map(row =>
    headers.map(h => escapeCSVValue(row[h])).join(',')
  );

  return '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
}

/**
 * Send a CSV file response.
 * @param {import('express').Response} res
 * @param {object[]} data
 * @param {string} filename
 */
function exportCSV(res, data, filename) {
  const csv = toCSVString(data);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
  res.send(csv);
}

/**
 * Send a JSON file response.
 * @param {import('express').Response} res
 * @param {object[]} data
 * @param {string} filename
 */
function exportJSON(res, data, filename) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
  res.send(JSON.stringify(data, null, 2));
}

module.exports = { exportCSV, exportJSON };

const express = require('express');
const multer = require('multer');
const path = require('path');
const { success, fail } = require('./response');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}-${random}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// POST / — single file upload
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return fail(res, 'No file uploaded');
  }
  return success(res, {
    url: `/uploads/${req.file.filename}`,
    filename: req.file.originalname,
    size: req.file.size,
  });
});

// POST /multiple — multiple file upload (max 10)
router.post('/multiple', upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return fail(res, 'No files uploaded');
  }
  const files = req.files.map(file => ({
    url: `/uploads/${file.filename}`,
    filename: file.originalname,
    size: file.size,
  }));
  return success(res, files);
});

module.exports = router;

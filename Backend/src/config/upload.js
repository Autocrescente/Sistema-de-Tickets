const multer = require('multer');
const path   = require('path');
const crypto = require('crypto');

const ALLOWED_MIMETYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

const MAX_SIZE_BYTES = (parseInt(process.env.UPLOAD_MAX_SIZE_MB) || 10) * 1024 * 1024;
const MAX_FILES      = parseInt(process.env.UPLOAD_MAX_FILES) || 5;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb) => {
    const unique = crypto.randomBytes(16).toString('hex');
    const ext    = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de ficheiro não permitido. Aceite: PDF, JPEG, PNG, GIF, WEBP.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE_BYTES,
    files:    MAX_FILES,
  },
});

module.exports = upload;

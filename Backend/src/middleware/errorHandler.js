const errorHandler = (err, _req, res, _next) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Registo duplicado.' });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: `Ficheiro demasiado grande. Máximo: ${process.env.UPLOAD_MAX_SIZE_MB || 10}MB.` });
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ message: `Demasiados ficheiros. Máximo: ${process.env.UPLOAD_MAX_FILES || 5} por ticket.` });
  }
  if (err.message) {
    return res.status(err.statusCode || 400).json({ message: err.message });
  }
  res.status(500).json({ message: 'Erro interno do servidor.' });
};

module.exports = errorHandler;

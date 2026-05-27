const rateLimit = require('express-rate-limit');

// Em testes usa um passthrough para não limitar as chamadas da suite
const publicLimiter = process.env.NODE_ENV === 'test'
  ? (_req, _res, next) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: { message: 'Demasiados pedidos. Tente novamente em 15 minutos.' },
    });

module.exports = { publicLimiter };

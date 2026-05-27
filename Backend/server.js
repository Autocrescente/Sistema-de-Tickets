require('dotenv').config();
const fs        = require('fs');
const path      = require('path');
const express   = require('express');
const app       = require('./app');
const connectDB = require('./src/config/db');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const PORT      = process.env.PORT || 5000;
const BASE_PATH = process.env.APP_BASE_PATH || '';

connectDB();

if (BASE_PATH) {
  // Produção: Passenger não remove o prefixo, montamos a app no caminho base
  const root = express();
  root.use(BASE_PATH, app);
  root.listen(PORT, () => {
    console.log(`Servidor na porta ${PORT} com base path: ${BASE_PATH}`);
  });
} else {
  // Local: sem prefixo
  app.listen(PORT, () => {
    console.log(`Servidor na porta ${PORT}`);
    console.log(`Documentação: http://localhost:${PORT}/api-docs`);
  });
}

// Gera docs/swagger.json na raiz do repositório (para GitHub Pages).
// Executar a partir de Backend/: node scripts/export-docs.js
require('dotenv').config();
const fs   = require('fs');
const path = require('path');

const spec    = require('../src/config/swagger');
const docsDir = path.join(__dirname, '../../docs'); // raiz do repo

if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

fs.writeFileSync(path.join(docsDir, 'swagger.json'), JSON.stringify(spec, null, 2));
console.log('✓ docs/swagger.json gerado em', docsDir);

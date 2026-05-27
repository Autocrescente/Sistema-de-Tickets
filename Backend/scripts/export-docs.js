// Gera docs/swagger.json a partir do spec em runtime.
// Executar: node scripts/export-docs.js
require('dotenv').config();
const fs   = require('fs');
const path = require('path');

const spec    = require('../src/config/swagger');
const docsDir = path.join(__dirname, '../docs');

if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir);

fs.writeFileSync(path.join(docsDir, 'swagger.json'), JSON.stringify(spec, null, 2));
console.log('✓ docs/swagger.json gerado');
console.log('  → Faz commit da pasta docs/ e ativa GitHub Pages a apontar para /docs');

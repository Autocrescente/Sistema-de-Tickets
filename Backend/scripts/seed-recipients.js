require('dotenv').config();
const mongoose  = require('mongoose');
const Recipient = require('../src/models/Recipient');

const recipients = [
  // Informática
  { name: 'Pedro Jardim',    email: 'pedrojardim@autocrescente.com',    department: 'Informática' },
  { name: 'William Silva',   email: 'williamsilva@autocrescente.com',   department: 'Administração' },

  // Administração
  { name: 'Duarte Reis',     email: 'duartereis@autocrescente.com',     department: 'Administração' },
  { name: 'Artur Sá',        email: 'artursa@autocrescente.com',        department: 'Administração' },

  // Recursos Humanos
  { name: 'Recursos Humanos',     email: 'recursoshumanos@autocrescente.com', department: 'Recursos Humanos' },

  // Marketing
  { name: 'Marketing',       email: 'marketing@autocrescente.com',      department: 'Marketing' },
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado ao MongoDB');

  for (const r of recipients) {
    const result = await Recipient.updateOne(
      { email: r.email },
      { $set: r },
      { upsert: true }
    );
    const action = result.upsertedCount ? 'criado' : 'atualizado';
    console.log(`${action}: ${r.name} <${r.email}> [${r.department}]`);
  }

  console.log('\nConcluído.');
  await mongoose.disconnect();
})().catch(e => { console.error(e.message); process.exit(1); });

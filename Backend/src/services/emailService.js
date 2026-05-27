const nodemailer = require('nodemailer');

const PRIORITY_LABELS = {
  urgente: 'Urgente (~1 hora)',
  alta:    'Alta (~4 horas)',
  normal:  'Normal (~24 horas)',
  baixa:   'Baixa (~72 horas)',
};

const STATUS_LABELS = {
  aberto:       'Aberto',
  em_progresso: 'Em Progresso',
  aguarda:      'Aguarda Resposta',
  resolvido:    'Resolvido',
  fechado:      'Fechado',
};

const createTransport = () =>
  nodemailer.createTransport({
    host:   process.env.EMAIL_HOST,
    port:   parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth:   { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

const isEmailConfigured = () => !!(process.env.EMAIL_HOST && process.env.EMAIL_USER);

const sendTicketCreatedToRequester = async (ticket) => {
  if (!isEmailConfigured()) return;
  await createTransport().sendMail({
    from:    process.env.EMAIL_FROM,
    to:      ticket.email,
    subject: `[${ticket.ticketNumber}] Pedido recebido: ${ticket.subject}`,
    html: `
      <h2>O seu pedido foi recebido</h2>
      <p>Obrigado, <strong>${ticket.firstName}</strong>. O seu ticket foi registado com sucesso.</p>
      <table cellpadding="6" style="border-collapse:collapse">
        <tr><td><strong>Número</strong></td><td>${ticket.ticketNumber}</td></tr>
        <tr><td><strong>Assunto</strong></td><td>${ticket.subject}</td></tr>
        <tr><td><strong>Prioridade</strong></td><td>${PRIORITY_LABELS[ticket.priority]}</td></tr>
        <tr><td><strong>Estado</strong></td><td>${STATUS_LABELS[ticket.status]}</td></tr>
      </table>
      <p>Será notificado por email quando o estado do ticket for atualizado.</p>
    `,
  });
};

const sendTicketCreatedToRecipient = async (ticket) => {
  if (!isEmailConfigured() || !ticket.recipient) return;
  await createTransport().sendMail({
    from:    process.env.EMAIL_FROM,
    to:      ticket.recipient,
    subject: `[${ticket.ticketNumber}] Novo ticket atribuído: ${ticket.subject}`,
    html: `
      <h2>Novo ticket atribuído</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        <tr><td><strong>Número</strong></td><td>${ticket.ticketNumber}</td></tr>
        <tr><td><strong>Requerente</strong></td><td>${ticket.firstName} ${ticket.lastName} (${ticket.email})</td></tr>
        <tr><td><strong>Assunto</strong></td><td>${ticket.subject}</td></tr>
        <tr><td><strong>Descrição</strong></td><td>${ticket.description}</td></tr>
        <tr><td><strong>Prioridade</strong></td><td>${PRIORITY_LABELS[ticket.priority]}</td></tr>
      </table>
    `,
  });
};

const sendStatusUpdate = async (ticket) => {
  if (!isEmailConfigured()) return;
  await createTransport().sendMail({
    from:    process.env.EMAIL_FROM,
    to:      ticket.email,
    subject: `[${ticket.ticketNumber}] Estado atualizado: ${STATUS_LABELS[ticket.status]}`,
    html: `
      <h2>O estado do seu ticket foi atualizado</h2>
      <p>Olá, <strong>${ticket.firstName}</strong>.</p>
      <table cellpadding="6" style="border-collapse:collapse">
        <tr><td><strong>Número</strong></td><td>${ticket.ticketNumber}</td></tr>
        <tr><td><strong>Assunto</strong></td><td>${ticket.subject}</td></tr>
        <tr><td><strong>Novo estado</strong></td><td>${STATUS_LABELS[ticket.status]}</td></tr>
      </table>
    `,
  });
};

module.exports = { sendTicketCreatedToRequester, sendTicketCreatedToRecipient, sendStatusUpdate };

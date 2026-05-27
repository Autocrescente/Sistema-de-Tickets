const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    text:   { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const attachmentSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },  // nome original do ficheiro
    filename:     { type: String, required: true },  // nome único gerado no disco
    mimetype:     { type: String, required: true },  // ex: 'application/pdf', 'image/jpeg'
    size:         { type: Number, required: true },  // tamanho em bytes
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type:     String,
      unique:   true,
      required: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email: {
      type:      String,
      required:  true,
      trim:      true,
      lowercase: true,
    },
    recipient:   { type: String, trim: true },
    subject:     { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    priority: {
      type:    String,
      enum:    ['urgente', 'alta', 'normal', 'baixa'],
      default: 'normal',
    },
    status: {
      type:    String,
      enum:    ['aberto', 'em_progresso', 'aguarda', 'resolvido', 'fechado'],
      default: 'aberto',
    },
    attachments: [attachmentSchema],
    comments:    [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);

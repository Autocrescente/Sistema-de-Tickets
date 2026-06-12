const mongoose = require('mongoose');

const recipientSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, trim: true, lowercase: true },
    department: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipient', recipientSchema);

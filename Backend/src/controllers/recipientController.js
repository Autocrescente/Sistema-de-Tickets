const { validationResult } = require('express-validator');
const Recipient = require('../models/Recipient');

exports.getRecipients = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = search
      ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }, { department: new RegExp(search, 'i') }] }
      : {};
    const recipients = await Recipient.find(filter).sort({ name: 1 });
    res.json(recipients);
  } catch (err) {
    next(err);
  }
};

exports.createRecipient = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, department } = req.body;
    const recipient = await Recipient.create({ name, email, department });
    res.status(201).json(recipient);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Email já existe.' });
    next(err);
  }
};

exports.updateRecipient = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const recipient = await Recipient.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!recipient) return res.status(404).json({ message: 'Destinatário não encontrado.' });
    res.json(recipient);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Email já existe.' });
    next(err);
  }
};

exports.deleteRecipient = async (req, res, next) => {
  try {
    const recipient = await Recipient.findByIdAndDelete(req.params.id);
    if (!recipient) return res.status(404).json({ message: 'Destinatário não encontrado.' });
    res.json({ message: 'Destinatário eliminado.' });
  } catch (err) {
    next(err);
  }
};

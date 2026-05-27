const fs   = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const Ticket = require('../models/Ticket');
const generateTicketNumber = require('../utils/ticketNumber');
const {
  sendTicketCreatedToRequester,
  sendTicketCreatedToRecipient,
  sendStatusUpdate,
} = require('../services/emailService');

exports.createTicket = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      (req.files || []).forEach(f => fs.unlink(f.path, () => {}));
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, recipient, subject, description, priority } = req.body;

    const attachments = (req.files || []).map(f => ({
      originalName: f.originalname,
      filename:     f.filename,
      mimetype:     f.mimetype,
      size:         f.size,
    }));

    const ticket = await Ticket.create({
      ticketNumber: await generateTicketNumber(),
      firstName, lastName, email, recipient, subject, description,
      priority: priority || 'normal',
      attachments,
    });

    sendTicketCreatedToRequester(ticket).catch(console.error);
    sendTicketCreatedToRecipient(ticket).catch(console.error);

    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
};

exports.getTickets = async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status)   filter.status   = status;
    if (priority) filter.priority = priority;
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [
        { ticketNumber: re },
        { subject:      re },
        { firstName:    re },
        { lastName:     re },
        { email:        re },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [tickets, total] = await Promise.all([
      Ticket.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Ticket.countDocuments(filter),
    ]);

    res.json({
      total,
      page:    parseInt(page),
      pages:   Math.ceil(total / parseInt(limit)),
      tickets,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket não encontrado.' });
    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

exports.updateTicket = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket não encontrado.' });

    const prevStatus = ticket.status;
    const allowed = ['status', 'priority', 'recipient', 'subject', 'description'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) ticket[field] = req.body[field];
    });

    await ticket.save();

    if (ticket.status !== prevStatus) {
      sendStatusUpdate(ticket).catch(console.error);
    }

    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

exports.deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket não encontrado.' });

    ticket.attachments.forEach(a => {
      const filePath = path.join(__dirname, '../../uploads', a.filename);
      fs.unlink(filePath, err => { if (err && err.code !== 'ENOENT') console.error(err); });
    });

    res.json({ message: 'Ticket eliminado.' });
  } catch (err) {
    next(err);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket não encontrado.' });

    const comment = { author: req.body.author, text: req.body.text };
    ticket.comments.push(comment);
    await ticket.save();

    res.status(201).json(ticket.comments[ticket.comments.length - 1]);
  } catch (err) {
    next(err);
  }
};

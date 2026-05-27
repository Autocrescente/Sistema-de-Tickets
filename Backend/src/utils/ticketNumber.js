const Ticket = require('../models/Ticket');

const generateTicketNumber = async () => {
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay   = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const count = await Ticket.countDocuments({
    createdAt: { $gte: startOfDay, $lt: endOfDay },
  });

  const sequence = String(count + 1).padStart(4, '0');
  return `TKT-${datePart}-${sequence}`;
};

module.exports = generateTicketNumber;

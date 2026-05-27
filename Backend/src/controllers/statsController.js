const Ticket = require('../models/Ticket');

exports.getStats = async (req, res, next) => {
  try {
    const now          = new Date();
    const startOfDay   = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek  = new Date(startOfDay.getTime() - startOfDay.getDay() * 86400000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [byStatus, byPriority, today, thisWeek, thisMonth, total] = await Promise.all([
      Ticket.aggregate([{ $group: { _id: '$status',   count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Ticket.countDocuments({ createdAt: { $gte: startOfDay } }),
      Ticket.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Ticket.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Ticket.countDocuments(),
    ]);

    res.json({
      total,
      today,
      thisWeek,
      thisMonth,
      byStatus:   Object.fromEntries(byStatus.map(s   => [s._id, s.count])),
      byPriority: Object.fromEntries(byPriority.map(p => [p._id, p.count])),
    });
  } catch (err) {
    next(err);
  }
};

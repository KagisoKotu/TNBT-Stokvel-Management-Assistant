const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');


// GET /api/notifications/:email — fetch notifications for a member
router.get('/:email', async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      recipient: req.params.email.toLowerCase()
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/notifications/:id/read — mark one as read
router.put('/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/notifications — create a notification manually
router.post('/', async (req, res) => {
  try {
    const { recipient, type, title, message, groupId } = req.body;
    const notification = await Notification.create({
      recipient: recipient.toLowerCase(),
      type,
      title,
      message,
      groupId
    });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/notifications/read-all/:email — mark all as read
router.put('/read-all/:email', async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.params.email.toLowerCase(), isRead: false },
      { isRead: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();

// POST /contact - Receive guide request/contact message
router.post('/', (req, res) => {
  const { name, email, city, guide, message } = req.body;
  if (!name || !email || !city || !guide) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  // In a real app, store the contact request or send an email
  res.json({ message: 'Your request has been received!' });
});

module.exports = router;
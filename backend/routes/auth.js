const express = require('express');
const router = express.Router();

// Dummy user data
let users = [
  { username: 'testuser', password: 'password', email: 'test@example.com' }
];

// POST /auth/register - Register a new user
router.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'Username already exists' });
  }
  users.push({ username, password, email });
  res.json({ message: 'Registration successful' });
});

// POST /auth/login - Login a user
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
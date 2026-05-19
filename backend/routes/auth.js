const express = require('express');
const { readJson, writeJson } = require('../data/store.js');

const router = express.Router();
const USERS_FILE = 'users.json';

function loadUsers() {
  return readJson(USERS_FILE, [
    { username: 'testuser', password: 'password', email: 'test@example.com' }
  ]);
}

function saveUsers(users) {
  writeJson(USERS_FILE, users);
}

router.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const users = loadUsers();
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  users.push({ username, password, email });
  saveUsers(users);
  res.json({ message: 'Registration successful' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({ message: 'Login successful', username: user.username });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;

// routes/home.routes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');

router.get('/home-data', authenticateToken, async (req, res) => {
  res.json({ message: `Olá ${req.user.email}`, user: req.user });
});

module.exports = router;

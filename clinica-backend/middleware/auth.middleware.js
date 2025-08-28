// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Sem token' });

  jwt.verify(token, ACCESS_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ message: 'Token inválido ou expirado' });
    req.user = payload;
    next();
  });
}

module.exports = authenticateToken;

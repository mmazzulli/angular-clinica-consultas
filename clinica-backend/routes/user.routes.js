// routes/user.routes.js

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize');
const {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

router.use(authenticateToken);

// Listar usuários
router.get(
  '/',
  authorize(['superadmin', 'empresa', 'medico', 'cliente']),
  listUsers
);

// Criar usuário
router.post(
  '/',
  authorize(['superadmin', 'empresa', 'medico']),
  createUser
);

// Atualizar usuário
router.put(
  '/:id',
  authorize(['superadmin', 'empresa', 'medico', 'cliente']),
  updateUser
);

// Deletar usuário
router.delete(
  '/:id',
  authorize(['superadmin', 'empresa', 'medico', 'cliente']),
  deleteUser
);

module.exports = router;

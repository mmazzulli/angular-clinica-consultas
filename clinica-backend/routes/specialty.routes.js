// routes/specialty.routes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize');
const specialtyController = require('../controllers/specialty.controller');

// Rotas públicas ou autenticadas
router.get('/', authenticateToken, specialtyController.getSpecialties);
router.get('/:id', authenticateToken, specialtyController.getSpecialty);
router.get('/:id/doctors', authenticateToken, specialtyController.getDoctorsBySpecialty);

// CRUD restrito a superadmin, empresa e medico
router.post(
  '/',
  authenticateToken,
  authorize(['superadmin', 'empresa', 'medico']),
  specialtyController.createSpecialty
);

router.put(
  '/:id',
  authenticateToken,
  authorize(['superadmin', 'empresa', 'medico']),
  specialtyController.updateSpecialty
);

router.delete(
  '/:id',
  authenticateToken,
  authorize(['superadmin', 'empresa', 'medico']),
  specialtyController.deleteSpecialty
);

module.exports = router;

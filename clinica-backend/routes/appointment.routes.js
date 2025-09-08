// routes/appointment.routes.js

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const {
  listAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointment.controller');

router.use(authenticateToken);

router.get('/', listAppointments);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;

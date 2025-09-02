const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');

// CRUD
router.post('/', appointmentController.create);
router.get('/', appointmentController.findAll);
router.get('/:id', appointmentController.findById);
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.delete);

module.exports = router;

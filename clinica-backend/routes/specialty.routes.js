const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialty.controller');

// CRUD
router.get('/', specialtyController.getSpecialties);
router.get('/:id', specialtyController.getSpecialty);
router.post('/', specialtyController.createSpecialty);
router.put('/:id', specialtyController.updateSpecialty);
router.delete('/:id', specialtyController.deleteSpecialty);

module.exports = router;

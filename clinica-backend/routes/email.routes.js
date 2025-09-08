// routes/email.routes.js
const express = require('express');
const { notifyOnAppointmentCreate } = require('../controllers/email.controller');
const router = express.Router();

// POST /emails/notify
// Aqui você pode disparar email manualmente (usado para teste)
router.post('/notify', async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) return res.status(400).json({ message: 'appointmentId é obrigatório' });

    // Aqui chamamos a função do controller
    await notifyOnAppointmentCreate({ appointmentId });
    res.json({ message: 'Emails disparados com sucesso (cliente + empresa)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao enviar emails' });
  }
});

module.exports = router;

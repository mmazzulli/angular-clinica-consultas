const appointmentService = require('../services/appointment.service');

class AppointmentController {
  async create(req, res) {
    try {
      const { startsAt, endsAt, status, notes, clientId, medicoId } = req.body;

      if (!startsAt || !clientId || !medicoId) {
        return res.status(400).json({
          message: 'Campos obrigatórios: startsAt, clientId, medicoId',
        });
      }

      const appointment = await appointmentService.create({
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        status,
        notes,
        clientId,
        medicoId,
      });

      res.status(201).json(appointment);
    } catch (error) {
      console.error(error);

      if (error.code === 'P2002') {
        return res
          .status(400)
          .json({ message: 'Já existe consulta para este médico neste horário.' });
      }

      res.status(500).json({ message: 'Erro ao criar appointment' });
    }
  }

  async findAll(req, res) {
    try {
      const appointments = await appointmentService.findAll();
      res.json(appointments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar appointments' });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.findById(id);

      if (!appointment) {
        return res.status(404).json({ message: 'Appointment não encontrado' });
      }

      res.json(appointment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar appointment' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (data.startsAt) data.startsAt = new Date(data.startsAt);
      if (data.endsAt) data.endsAt = new Date(data.endsAt);

      const updated = await appointmentService.update(id, data);
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar appointment' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await appointmentService.delete(id);
      res.json({ message: 'Appointment deletado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao deletar appointment' });
    }
  }
}

module.exports = new AppointmentController();

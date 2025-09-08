// controllers/appointment.controller.js
const prisma = require('../prisma/client');
const {
  canCreateAppointment,
  canUpdateAppointment,
  canDeleteAppointment,
  buildAppointmentWhere,
} = require('../utils/rbac');
const {
  notifyOnAppointmentCreated,
  notifyOnDoctorAssigned,
} = require('./email.controller');

/**
 * Listar appointments com paginação e RBAC aplicado no banco
 */
async function listAppointments(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // aplica RBAC no filtro da query
    const where = buildAppointmentWhere(req.user);

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: { client: true, medico: true },
        orderBy: { startsAt: 'desc' },
      }),
      prisma.appointment.count({ where }),
    ]);

    res.json({
      data: appointments,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar appointments' });
  }
}

/**
 * Criar appointment
 */
async function createAppointment(req, res) {
  try {
    const data = req.body;

    if (!canCreateAppointment(req.user, data)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const appointment = await prisma.appointment.create({
      data,
      include: { client: true, medico: true, empresa: true },
    });

    // dispara emails (cliente + empresa)
    await notifyOnAppointmentCreated(appointment);

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar appointment' });
  }
}

/**
 * Atualizar appointment
 */
async function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const appointment = await prisma.appointment.findUnique({
      where: { appointmentId: parseInt(id) },
      include: { client: true, medico: true, empresa: true },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment não encontrado' });
    }

    if (!canUpdateAppointment(req.user, appointment)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const updated = await prisma.appointment.update({
      where: { appointmentId: parseInt(id) },
      data: req.body,
      include: { client: true, medico: true, empresa: true },
    });

    // se médico foi vinculado agora → dispara emails (cliente + médico)
    if (!appointment.medicoId && updated.medicoId) {
      await notifyOnDoctorAssigned(updated);
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar appointment' });
  }
}

/**
 * Deletar appointment
 */
async function deleteAppointment(req, res) {
  try {
    const { id } = req.params;
    const appointment = await prisma.appointment.findUnique({
      where: { appointmentId: parseInt(id) },
      include: { client: true, medico: true },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment não encontrado' });
    }

    if (!canDeleteAppointment(req.user, appointment)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    await prisma.appointment.delete({
      where: { appointmentId: parseInt(id) },
    });

    res.json({ message: 'Appointment deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao deletar appointment' });
  }
}

module.exports = {
  listAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};

// services/appointment.service.js

const prisma = require('../prisma/client');
const {
  canReadAppointment,
  canCreateAppointment,
  canUpdateAppointment,
  canDeleteAppointment,
} = require('../utils/rbac');

/**
 * Lista appointments paginados respeitando RBAC
 */
async function listAppointmentsService(user, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  // Busca todos com paginação
  const appointmentsRaw = await prisma.appointment.findMany({
    skip,
    take: limit,
    orderBy: { startsAt: 'desc' },
    include: {
      client: { select: { userId: true, name: true, email: true } },
      medico: { select: { userId: true, name: true, email: true } },
    },
  });

  // Filtra apenas os que o usuário pode ver
  const appointments = appointmentsRaw.filter(a => canReadAppointment(user, a));

  // Contagem total filtrada
  const totalAll = await prisma.appointment.findMany({
    include: { client: true, medico: true },
  });
  const total = totalAll.filter(a => canReadAppointment(user, a)).length;

  return {
    appointments,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Cria appointment com checagem de RBAC
 */
async function createAppointmentService(user, data) {
  if (!canCreateAppointment(user, data)) {
    throw new Error('Acesso negado para criar appointment');
  }

  return prisma.appointment.create({
    data,
    include: {
      client: { select: { userId: true, name: true, email: true } },
      medico: { select: { userId: true, name: true, email: true } },
    },
  });
}

/**
 * Atualiza appointment com checagem de RBAC
 */
async function updateAppointmentService(user, id, data) {
  const appointment = await prisma.appointment.findUnique({
    where: { appointmentId: id },
    include: { client: true, medico: true },
  });

  if (!appointment) throw new Error('Appointment não encontrado');
  if (!canUpdateAppointment(user, appointment)) throw new Error('Acesso negado para atualizar appointment');

  return prisma.appointment.update({
    where: { appointmentId: id },
    data,
    include: {
      client: { select: { userId: true, name: true, email: true } },
      medico: { select: { userId: true, name: true, email: true } },
    },
  });
}

/**
 * Deleta appointment com checagem de RBAC
 */
async function deleteAppointmentService(user, id) {
  const appointment = await prisma.appointment.findUnique({
    where: { appointmentId: id },
    include: { client: true, medico: true },
  });

  if (!appointment) throw new Error('Appointment não encontrado');
  if (!canDeleteAppointment(user, appointment)) throw new Error('Acesso negado para deletar appointment');

  return prisma.appointment.delete({ where: { appointmentId: id } });
}

module.exports = {
  listAppointmentsService,
  createAppointmentService,
  updateAppointmentService,
  deleteAppointmentService,
};

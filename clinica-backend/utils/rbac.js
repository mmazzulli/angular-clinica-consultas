// utils/rbac.js

/**
 * user: { userId, role, empresaId }
 * appointment: { appointmentId, medicoId, clientId, empresaId }
 * targetUser: { userId, role, medicoId, empresaId }
 */

function isSuperadminOrEmpresa(user) {
  return user?.role === 'superadmin' || user?.role === 'empresa';
}

function isMedico(user) {
  return user?.role === 'medico';
}

function isCliente(user) {
  return user?.role === 'cliente';
}

/* ------------------ Appointments ------------------ */
/**
 * Retorna o filtro WHERE para Prisma baseado no RBAC do usuário
 */
function buildAppointmentWhere(user) {
  if (isSuperadminOrEmpresa(user)) {
    return {}; // pode ver todos
  }
  if (isMedico(user)) {
    return { medicoId: user.userId };
  }
  if (isCliente(user)) {
    return { clientId: user.userId };
  }
  return { appointmentId: -1 }; // nenhum resultado
}

function canUpdateAppointment(user, appointment) {
  if (isSuperadminOrEmpresa(user)) return true;
  if (isMedico(user)) return appointment.medicoId === user.userId;
  if (isCliente(user)) return appointment.clientId === user.userId;
  return false;
}

function canDeleteAppointment(user, appointment) {
  if (isSuperadminOrEmpresa(user)) return true;
  if (isMedico(user)) return appointment.medicoId === user.userId;
  if (isCliente(user)) return appointment.clientId === user.userId;
  return false;
}

function canCreateAppointment(user, payload) {
  if (isSuperadminOrEmpresa(user)) return true;
  if (isMedico(user)) return payload.medicoId === user.userId;
  if (isCliente(user)) return payload.clientId === user.userId;
  return false;
}

/* ------------------ Users ------------------ */
function canUpdateUser(loggedUser, targetUser) {
  if (isSuperadminOrEmpresa(loggedUser)) return true;
  if (isMedico(loggedUser)) {
    return (
      targetUser.userId === loggedUser.userId || // ele mesmo
      targetUser.medicoId === loggedUser.userId // clientes dele
    );
  }
  if (isCliente(loggedUser)) {
    return targetUser.userId === loggedUser.userId;
  }
  return false;
}

function canDeleteUser(loggedUser, targetUser) {
  if (isSuperadminOrEmpresa(loggedUser)) return true;
  if (isMedico(loggedUser)) {
    return targetUser.medicoId === loggedUser.userId; // médico só pode deletar clientes vinculados
  }
  if (isCliente(loggedUser)) {
    return targetUser.userId === loggedUser.userId; // cliente pode deletar a si mesmo
  }
  return false;
}

module.exports = {
  isSuperadminOrEmpresa,
  isMedico,
  isCliente,
  buildAppointmentWhere,
  canUpdateAppointment,
  canDeleteAppointment,
  canCreateAppointment,
  canUpdateUser,
  canDeleteUser,
};

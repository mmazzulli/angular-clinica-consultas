// controllers/email.controller.js
const { sendEmail } = require('../services/email.service');
const prisma = require('../prisma/client');

/**
 * Notificação ao criar um appointment
 * - Envia para o cliente
 * - Envia para a empresa
 */
async function notifyOnAppointmentCreate(appointment) {
  try {
    const appointmentFull = await prisma.appointment.findUnique({
      where: { appointmentId: appointment.appointmentId },
      include: { client: true, medico: true, empresa: true },
    });

    if (!appointmentFull) return;

    // Email para cliente
    const clientHtml = `
      <h2>Olá ${appointmentFull.client.name}</h2>
      <p>Seu agendamento foi registrado com sucesso.</p>
      <p>Data e hora: <b>${appointmentFull.startsAt.toLocaleString()}</b></p>
      ${appointmentFull.medico
        ? `<p>Médico responsável: <b>${appointmentFull.medico.name}</b></p>`
        : '<p>Médico ainda não vinculado.</p>'}
      <p>Obrigado por confiar na nossa clínica!</p>
    `;

    await sendEmail(
      appointmentFull.client.email,
      'Confirmação de Agendamento',
      clientHtml
    );

    // Email para empresa
    if (appointmentFull.empresa?.email) {
      const empresaHtml = `
        <h2>Nova consulta agendada</h2>
        <p>Cliente: <b>${appointmentFull.client.name}</b></p>
        <p>Email do cliente: ${appointmentFull.client.email}</p>
        <p>Data e hora: <b>${appointmentFull.startsAt.toLocaleString()}</b></p>
      `;
      await sendEmail(
        appointmentFull.empresa.email,
        'Novo Agendamento Recebido',
        empresaHtml
      );
    }

    console.log('📧 Emails de criação enviados (cliente + empresa)');
  } catch (err) {
    console.error('Erro ao enviar emails de criação:', err);
  }
}

/**
 * Notificação ao vincular médico a um appointment
 * - Envia para cliente
 * - Envia para médico
 */
async function notifyOnDoctorAssigned(appointment) {
  try {
    const appointmentFull = await prisma.appointment.findUnique({
      where: { appointmentId: appointment.appointmentId },
      include: { client: true, medico: true },
    });

    if (!appointmentFull || !appointmentFull.medico) return;

    // Email para cliente
    const clientHtml = `
      <h2>Olá ${appointmentFull.client.name}</h2>
      <p>Um médico foi vinculado ao seu agendamento.</p>
      <p>Médico responsável: <b>${appointmentFull.medico.name}</b></p>
      <p>Data e hora: <b>${appointmentFull.startsAt.toLocaleString()}</b></p>
    `;

    await sendEmail(
      appointmentFull.client.email,
      'Atualização do Agendamento',
      clientHtml
    );

    // Email para médico
    const doctorHtml = `
      <h2>Olá Dr(a). ${appointmentFull.medico.name}</h2>
      <p>Você foi vinculado a um novo agendamento.</p>
      <p>Cliente: <b>${appointmentFull.client.name}</b></p>
      <p>Data e hora: <b>${appointmentFull.startsAt.toLocaleString()}</b></p>
    `;

    await sendEmail(
      appointmentFull.medico.email,
      'Novo Agendamento Vinculado',
      doctorHtml
    );

    console.log('📧 Emails enviados (cliente + médico)');
  } catch (err) {
    console.error('Erro ao enviar emails na vinculação de médico:', err);
  }
}

module.exports = {
  notifyOnAppointmentCreate,
  notifyOnDoctorAssigned,
};

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AppointmentService {
  async create(data) {
    return prisma.appointment.create({
      data,
      include: {
        client: { select: { userId: true, name: true, email: true } },
        medico: { select: { userId: true, name: true, email: true, crm: true } },
      },
    });
  }

  async findAll() {
    return prisma.appointment.findMany({
      include: {
        client: { select: { userId: true, name: true, email: true } },
        medico: { select: { userId: true, name: true, email: true, crm: true } },
      },
    });
  }

  async findById(id) {
    return prisma.appointment.findUnique({
      where: { appointmentId: Number(id) },
      include: {
        client: { select: { userId: true, name: true, email: true } },
        medico: { select: { userId: true, name: true, email: true, crm: true } },
      },
    });
  }

  async update(id, data) {
    return prisma.appointment.update({
      where: { appointmentId: Number(id) },
      data,
      include: {
        client: { select: { userId: true, name: true, email: true } },
        medico: { select: { userId: true, name: true, email: true, crm: true } },
      },
    });
  }

  async delete(id) {
    return prisma.appointment.delete({
      where: { appointmentId: Number(id) },
    });
  }
}

module.exports = new AppointmentService();

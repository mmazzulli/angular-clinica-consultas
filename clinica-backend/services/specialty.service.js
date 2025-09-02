const prisma = require('../prisma/client');

async function getAllSpecialties() {
  return prisma.specialty.findMany();
}

async function getSpecialtyById(id) {
  return prisma.specialty.findUnique({ where: { specialtyId: id } });
}

async function createSpecialty(data) {
  return prisma.specialty.create({ data });
}

async function updateSpecialty(id, data) {
  return prisma.specialty.update({
    where: { specialtyId: id },
    data,
  });
}

async function deleteSpecialty(id) {
  return prisma.specialty.delete({ where: { specialtyId: id } });
}

module.exports = {
  getAllSpecialties,
  getSpecialtyById,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
};

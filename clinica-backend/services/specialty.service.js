// services/specialty.service.js

const prisma = require('../prisma/client');

async function getAllSpecialties(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [specialties, total] = await Promise.all([
    prisma.specialty.findMany({
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    }),
    prisma.specialty.count(),
  ]);

  return {
    data: specialties,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
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

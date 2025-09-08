// controllers/specialty.controller.js

const specialtyService = require('../services/specialty.service');
const prisma = require('../prisma/client');

/**
 * GET /specialties
 * Lista todas as especialidades com paginação
 */
async function getSpecialties(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await specialtyService.getAllSpecialties(page, limit);

    res.json(result);
  } catch (err) {
    console.error('Erro em getSpecialties:', err);
    res.status(500).json({ message: 'Erro ao buscar especialidades' });
  }
}

/**
 * GET /specialties/:id
 * Busca uma especialidade pelo ID
 */
async function getSpecialty(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const specialty = await specialtyService.getSpecialtyById(id);
    if (!specialty) {
      return res.status(404).json({ message: 'Especialidade não encontrada' });
    }

    res.json(specialty);
  } catch (err) {
    console.error('Erro em getSpecialty:', err);
    res.status(500).json({ message: 'Erro ao buscar especialidade' });
  }
}

/**
 * POST /specialties
 * Criar nova especialidade
 */
async function createSpecialty(req, res) {
  try {
    const { name } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'Nome é obrigatório' });
    }

    const specialty = await specialtyService.createSpecialty({
      name: String(name).trim(),
    });

    res.status(201).json(specialty);
  } catch (err) {
    console.error('Erro em createSpecialty:', err);
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Especialidade já existe' });
    }
    res.status(500).json({ message: 'Erro ao criar especialidade' });
  }
}

/**
 * PUT /specialties/:id
 * Atualizar especialidade
 */
async function updateSpecialty(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const { name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'Nome é obrigatório' });
    }

    const specialty = await specialtyService.updateSpecialty(id, {
      name: String(name).trim(),
    });

    res.json(specialty);
  } catch (err) {
    console.error('Erro em updateSpecialty:', err);
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Especialidade já existe' });
    }
    res.status(500).json({ message: 'Erro ao atualizar especialidade' });
  }
}

/**
 * DELETE /specialties/:id
 * Deletar especialidade
 */
async function deleteSpecialty(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    await specialtyService.deleteSpecialty(id);

    res.json({ message: 'Especialidade deletada com sucesso' });
  } catch (err) {
    console.error('Erro em deleteSpecialty:', err);
    res.status(500).json({ message: 'Erro ao deletar especialidade' });
  }
}

/**
 * GET /specialties/:id/doctors
 * Lista médicos por especialidade
 */
async function getDoctorsBySpecialty(req, res) {
  try {
    const specialtyId = Number(req.params.id);
    if (Number.isNaN(specialtyId)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const doctors = await prisma.user.findMany({
      where: {
        role: 'medico',
        specialties: { some: { specialtyId } },
      },
      select: {
        userId: true,
        name: true,
        email: true,
        crm: true,
        empresaId: true,
      },
    });

    res.json(doctors);
  } catch (err) {
    console.error('Erro em getDoctorsBySpecialty:', err);
    res.status(500).json({ message: 'Erro ao buscar médicos por especialidade' });
  }
}

module.exports = {
  getSpecialties,
  getSpecialty,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
  getDoctorsBySpecialty,
};

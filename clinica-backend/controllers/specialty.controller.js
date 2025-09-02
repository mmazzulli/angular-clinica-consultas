const specialtyService = require('../services/specialty.service');

// GET /specialties
async function getSpecialties(req, res) {
  try {
    const specialties = await specialtyService.getAllSpecialties();
    res.json(specialties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar especialidades' });
  }
}

// GET /specialties/:id
async function getSpecialty(req, res) {
  try {
    const specialty = await specialtyService.getSpecialtyById(Number(req.params.id));
    if (!specialty) return res.status(404).json({ message: 'Especialidade não encontrada' });
    res.json(specialty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar especialidade' });
  }
}

// POST /specialties
async function createSpecialty(req, res) {
  try {
    const specialty = await specialtyService.createSpecialty(req.body);
    res.status(201).json(specialty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar especialidade' });
  }
}

// PUT /specialties/:id
async function updateSpecialty(req, res) {
  try {
    const specialty = await specialtyService.updateSpecialty(Number(req.params.id), req.body);
    res.json(specialty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar especialidade' });
  }
}

// DELETE /specialties/:id
async function deleteSpecialty(req, res) {
  try {
    await specialtyService.deleteSpecialty(Number(req.params.id));
    res.json({ message: 'Especialidade deletada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao deletar especialidade' });
  }
}

module.exports = {
  getSpecialties,
  getSpecialty,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
};

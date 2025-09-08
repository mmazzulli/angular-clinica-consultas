// controllers/user.controller.js

const {
  listUsers: listUsersService,
  createUser: createUserService,
  updateUser: updateUserService,
  deleteUser: deleteUserService,
} = require('../services/user.service');

/**
 * GET /users?page=&limit=
 * Lista usuários com paginação
 */
async function listUsers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { users, total } = await listUsersService(req.user, page, limit);

    res.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Erro em listUsers:', err);
    res.status(500).json({ message: err.message || 'Erro no servidor' });
  }
}

/**
 * POST /users
 * Cria novo usuário
 */
async function createUser(req, res) {
  try {
    const user = await createUserService(req.user, req.body);
    res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (err) {
    console.error('Erro em createUser:', err);
    res.status(400).json({ message: err.message || 'Erro ao criar usuário' });
  }
}

/**
 * PUT /users/:id
 * Atualiza um usuário existente
 */
async function updateUser(req, res) {
  try {
    const updated = await updateUserService(req.user, req.params.id, req.body);
    res.json({ message: 'Usuário atualizado com sucesso', user: updated });
  } catch (err) {
    console.error('Erro em updateUser:', err);
    res.status(403).json({ message: err.message || 'Erro ao atualizar usuário' });
  }
}

/**
 * DELETE /users/:id
 * Remove um usuário
 */
async function deleteUser(req, res) {
  try {
    const deleted = await deleteUserService(req.user, req.params.id);
    res.json({ message: 'Usuário deletado com sucesso', user: deleted });
  } catch (err) {
    console.error('Erro em deleteUser:', err);
    res.status(403).json({ message: err.message || 'Erro ao deletar usuário' });
  }
}

module.exports = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
};

// services/user.service.js

const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const {
  isSuperadminOrEmpresa,
  isMedico,
  isCliente,
  canUpdateUser,
  canDeleteUser,
} = require('../utils/rbac');

/**
 * Listagem paginada de usuários respeitando RBAC
 */
async function listUsers(user, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  // Construção de filtro RBAC
  let where = {};
  if (isSuperadminOrEmpresa(user)) {
    where = {};
  } else if (isMedico(user)) {
    where = {
      OR: [
        { userId: user.userId },       // ele mesmo
        { medicoId: user.userId },     // clientes dele
      ],
    };
  } else if (isCliente(user)) {
    where = { userId: user.userId }; // apenas ele mesmo
  } else {
    // fallback seguro: não retorna ninguém
    where = { userId: -1 };
  }

  // Para empresas: adiciona médicos vinculados e clientes dos médicos
  if (user.role === 'empresa') {
    where = {
      OR: [
        { userId: user.userId },                // ela mesma
        { empresaId: user.userId },             // médicos dela
        { medico: { empresaId: user.userId } }, // clientes dos médicos dela
      ],
    };
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        medicos: true,
        appointmentsAsClient: true,
        appointmentsAsMedico: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Cria usuário respeitando RBAC
 */
async function createUser(loggedUser, data) {
  const { name, email, password, role } = data;

  if (!name || !email || !password) throw new Error('Campos obrigatórios ausentes');

  if (isCliente(loggedUser)) throw new Error('Cliente não pode criar usuários');
  if (isMedico(loggedUser) && role !== 'cliente') throw new Error('Médico só pode criar clientes');
  if (loggedUser.role === 'empresa' && role === 'superadmin') throw new Error('Empresa não pode criar superadmin');

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email já cadastrado');

  const hashed = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: role || 'cliente',
      empresaId: loggedUser.role === 'empresa' ? loggedUser.userId : undefined,
      medicoId: loggedUser.role === 'medico' ? loggedUser.userId : undefined,
    },
  });
}

/**
 * Atualiza usuário respeitando RBAC
 */
async function updateUser(loggedUser, userId, data) {
  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user) throw new Error('Usuário não encontrado');

  if (!canUpdateUser(loggedUser, user)) throw new Error('Acesso negado');

  const updateData = { ...data };
  if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

  return prisma.user.update({ where: { userId }, data: updateData });
}

/**
 * Deleta usuário respeitando RBAC
 */
async function deleteUser(loggedUser, userId) {
  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user) throw new Error('Usuário não encontrado');

  if (!canDeleteUser(loggedUser, user)) throw new Error('Acesso negado');

  return prisma.user.delete({ where: { userId } });
}

module.exports = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
};

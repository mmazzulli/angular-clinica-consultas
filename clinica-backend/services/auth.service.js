// services/auth.service.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXP = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '30');
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');

function signAccessToken(user) {
  return jwt.sign({
    userId: user.userId,
    role: user.role,
    email: user.email,
  }, ACCESS_SECRET, { expiresIn: ACCESS_EXP });
}

function signRefreshToken(user) {
  return jwt.sign({ userId: user.userId }, REFRESH_SECRET, { expiresIn: `${REFRESH_DAYS}d` });
}

async function hashToken(token) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(token, salt);
}

// ===== Funções de rota =====
async function register(req, res) {
  try {
    const { name, email, password, role, surname } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ message: 'Campos obrigatórios ausentes' });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email já cadastrado' });

    const hashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { name, surname, email, password: hashed, role: role || 'cliente' }
    });

    res.status(201).json({ message: 'Usuário criado', userId: user.userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Credenciais inválidas' });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    const tokenHash = await hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_DAYS);

    await prisma.refreshToken.create({
      data: { tokenHash, userId: user.userId, expiresAt }
    });

    res.cookie('jid', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/refresh-token',
      maxAge: REFRESH_DAYS * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: { userId: user.userId, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
}

async function refreshToken(req, res) {
  try {
    const token = req.cookies.jid;
    if (!token) return res.status(401).json({ message: 'Sem refresh token' });

    let payload;
    try { payload = jwt.verify(token, REFRESH_SECRET); } 
    catch { return res.status(401).json({ message: 'Refresh token inválido' }); }

    const userId = payload.userId;
    const tokens = await prisma.refreshToken.findMany({
      where: { userId, revoked: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    if (!tokens || tokens.length === 0)
      return res.status(401).json({ message: 'Nenhum refresh token válido encontrado' });

    let matched = false;
    for (const dbt of tokens) {
      const ok = await bcrypt.compare(token, dbt.tokenHash);
      if (ok) { matched = true; break; }
    }
    if (!matched) return res.status(401).json({ message: 'Refresh token não reconhecido' });

    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

    const newAccess = signAccessToken(user);
    const newRefresh = signRefreshToken(user);
    const newHash = await hashToken(newRefresh);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_DAYS);

    await prisma.refreshToken.create({ data: { tokenHash: newHash, userId: user.userId, expiresAt } });
    await prisma.refreshToken.updateMany({ where: { userId: user.userId, revoked: false }, data: { revoked: true } });

    res.cookie('jid', newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/refresh-token',
      maxAge: REFRESH_DAYS * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccess, user: { userId: user.userId, email: user.email, role: user.role } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
}

async function logout(req, res) {
  try {
    const token = req.cookies.jid;
    if (token) {
      const tokens = await prisma.refreshToken.findMany({ where: { revoked: false } });
      for (const t of tokens) {
        const ok = await bcrypt.compare(token, t.tokenHash).catch(() => false);
        if (ok) await prisma.refreshToken.update({ where: { id: t.id }, data: { revoked: true } });
      }
    }
    res.clearCookie('jid', { path: '/refresh-token' });
    res.json({ message: 'Logout efetuado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
}

module.exports = { register, login, refreshToken, logout };

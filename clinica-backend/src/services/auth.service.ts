import { prisma } from '../prisma';
import argon2 from 'argon2';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Credenciais inválidas');

  const ok = await argon2.verify(user.password, password);
  if (!ok) throw new Error('Credenciais inválidas');

  const payload = { sub: user.userId, role: user.role as any };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.userId,
      name: user.name,
      role: user.role,
      email: user.email
    }
  };
}

export async function refresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const user = await prisma.user.findUnique({ where: { userId: payload.sub } });
  if (!user) throw new Error('Usuário não encontrado');

  const newPayload = { sub: user.userId, role: user.role as any };
  return {
    accessToken: signAccessToken(newPayload),
    refreshToken: signRefreshToken(newPayload)
  };
}

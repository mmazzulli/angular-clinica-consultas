import { Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, refresh } from '../services/auth.service';
import { verifyAccessToken } from '../utils/jwt';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const data = await authenticate(email, password);
    // respond com tokens + user + rota sugerida para o frontend redirecionar
    return res.json({
      ...data,
      redirectTo: routeByRole(data.user.role)
    });
  } catch (e: any) {
    return res.status(401).json({ message: e.message ?? 'Credenciais inválidas' });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    const token = auth.substring(7);
    const payload = verifyAccessToken(token);
    return res.json({ id: payload.sub, role: payload.role });
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

const refreshSchema = z.object({ refreshToken: z.string().min(10) });

export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const tokens = await refresh(refreshToken);
    return res.json(tokens);
  } catch (e: any) {
    return res.status(401).json({ message: e.message ?? 'Refresh inválido' });
  }
}

function routeByRole(role: string) {
  switch (role) {
    case 'SUPERADMIN': return '/dashboard/admin';
    case 'EMPRESA': return '/dashboard/empresa';
    case 'MEDICO': return '/dashboard/medico';
    case 'CLIENTE': return '/dashboard/cliente';
    default: return '/dashboard';
  }
}

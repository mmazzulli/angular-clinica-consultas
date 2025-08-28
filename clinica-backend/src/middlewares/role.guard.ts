import { Request, Response, NextFunction } from 'express';

export function roleGuard(...allowed: Array<'SUPERADMIN'|'EMPRESA'|'MEDICO'|'CLIENTE'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const role = req.user?.role as string | undefined;
    if (!role || !allowed.includes(role as any)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

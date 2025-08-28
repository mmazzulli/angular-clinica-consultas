import 'dotenv/config';
export const env = {
  port: Number(process.env.PORT ?? 3333),
  accessSecret: process.env.JWT_ACCESS_SECRET!,
  refreshSecret: process.env.JWT_REFRESH_SECRET!,
  accessExp: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  refreshExp: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d'
};

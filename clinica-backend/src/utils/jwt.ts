import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { env } from '../env'; // ajuste o caminho conforme seu projeto

// Payload padrão do JWT
type Payload = {
  sub: number;   // userId
  role: string;  // role do usuário
};

// Função que garante que a variável de ambiente existe
function getSecret(secret?: string): Secret {
  if (!secret) throw new Error("JWT secret não definido no .env");
  return secret;
}

// Expirações em segundos
const accessExpSeconds = 15 * 60;        // 15 minutos
const refreshExpSeconds = 7 * 24 * 60 * 60; // 7 dias

// Gera token de acesso
export function signAccessToken(payload: Payload) {
  return jwt.sign(payload, getSecret(env.accessSecret), { expiresIn: accessExpSeconds });
}

// Gera token de refresh
export function signRefreshToken(payload: Payload) {
  return jwt.sign(payload, getSecret(env.refreshSecret), { expiresIn: refreshExpSeconds });
}

// Verifica token de acesso
export function verifyAccessToken(token: string) {
  return jwt.verify(token, getSecret(env.accessSecret)) as Payload & JwtPayload;
}

// Verifica token de refresh
export function verifyRefreshToken(token: string) {
  return jwt.verify(token, getSecret(env.refreshSecret)) as Payload & JwtPayload;
}

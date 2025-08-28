import { Router } from 'express';
import { login, refreshToken, me } from '../controllers/auth.controller';
export const authRouter = Router();
authRouter.post('/login', login);
authRouter.post('/refresh', refreshToken);
authRouter.get('/me', me); // protected via header in controller for simplicity (ou use middleware)

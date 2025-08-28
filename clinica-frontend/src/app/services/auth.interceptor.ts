// src/app/services/auth.interceptor.ts
import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  // injeta AuthService automaticamente
  const auth = inject(AuthService);
  const token = auth.getAccessToken(); // método que retorna o token JWT

  // se houver token, clona a requisição adicionando Authorization
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  // continua a requisição
  return next(authReq);
};

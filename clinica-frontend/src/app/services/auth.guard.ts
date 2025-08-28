// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  // tentar refresh antes de redirecionar
  return auth.refreshAccessToken().toPromise().then(res => {
    if (auth.isLoggedIn()) return true;
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }).catch(() => {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  });
};

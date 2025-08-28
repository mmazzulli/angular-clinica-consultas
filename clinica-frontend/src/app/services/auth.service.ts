// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export interface User {
  userId: number;
  name?: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:4000';
  
  private accessToken: string | null = null;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // ============================
  // Setar token e usuário atual
  // ============================
  private setAccessToken(token: string | null) {
    this.accessToken = token;

    if (!token) {
      this.userSubject.next(null);
      return;
    }

    try {
      const payload: any = jwtDecode(token);
      this.userSubject.next({
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      });
    } catch (err) {
      console.error('Token inválido', err);
      this.userSubject.next(null);
    }
  }

  // ============================
  // Obter token atual (usado pelo interceptor)
  // ============================
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // ============================
  // Registro de usuário
  // ============================
  register(data: { name: string; email: string; password: string; role: string }) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // ============================
  // Login
  // ============================
  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true })
      .pipe(map(res => {
        // salva access token e atualiza user$
        this.setAccessToken(res.accessToken);
        return res;
      }));
  }

  // ============================
  // Logout
  // ============================
  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(map(res => {
        this.setAccessToken(null);
        this.router.navigate(['/login']); // opcional: redireciona para login
        return res;
      }));
  }

  // ============================
  // Refresh token
  // ============================
  refreshAccessToken() {
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true })
      .pipe(map(res => {
        if (res?.accessToken) {
          this.setAccessToken(res.accessToken);
        }
        return res;
      }));
  }

  // ============================
  // Verifica se usuário está logado
  // ============================
  isLoggedIn(): boolean {
    return !!this.accessToken;
  }
}

// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Home (rota protegida)</h2>

    <ng-container *ngIf="user$ | async as user; else notLogged">
      <p>Bem-vindo, {{ user.email }} (role: {{ user.role }})</p>
      <button (click)="logout()">Logout</button>
    </ng-container>

    <ng-template #notLogged>
      <p>Você não está logado.</p>
    </ng-template>
  `
})
export class HomeComponent {
  constructor(private auth: AuthService) {}

  // ✅ Getter resolve o problema de inicialização
  get user$() {
    return this.auth.user$;
  }

  logout() {
    this.auth.logout().subscribe(() => {
      // redireciona para login após sair
      window.location.href = '/login';
    });
  }
}

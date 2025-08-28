// src/app/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Registrar</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>Nome
        <input formControlName="name" required>
      </label>
      <label>Email
        <input formControlName="email" type="email" required>
      </label>
      <label>Senha
        <input formControlName="password" type="password" required>
      </label>
      <label>Role
        <select formControlName="role">
          <option value="empresa">empresa</option>
          <option value="medico">medico</option>
          <option value="cliente">cliente</option>
        </select>
      </label>
      <button type="submit">Registrar</button>
    </form>
    <p *ngIf="message">{{ message }}</p>
  `
})
export class RegisterComponent {
  form = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    role: new FormControl('cliente')
  });
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.register(this.form.value as any).subscribe({
      next: () => {
        this.message = 'Registrado com sucesso! Redirecionando...';
        setTimeout(() => this.router.navigate(['/login']), 800);
      },
      error: (err) => {
        this.message = err?.error?.message || 'Erro ao registrar';
      }
    });
  }
}

// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Login</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>Email
        <input formControlName="email" type="email" required>
      </label>
      <label>Senha
        <input formControlName="password" type="password" required>
      </label>
      <button type="submit">Entrar</button>
    </form>
    <p *ngIf="error">{{ error }}</p>
  `
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: err => {
        this.error = err?.error?.message || 'Erro ao efetuar login';
      }
    });
  }
}

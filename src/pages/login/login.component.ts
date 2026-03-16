import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-dark">
      <div class="bg-card p-8 rounded-lg w-full max-w-md shadow-xl">
        <h2 class="text-3xl font-bold text-white mb-6 text-center">
          Sign In to <span class="text-primary">VeloStream</span>
        </h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="text-gray-400 text-sm mb-1 block">Email</label>
            <input formControlName="email" type="email"
              class="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700
                     focus:border-primary focus:outline-none"
              placeholder="you@example.com"/>
          </div>

          <div>
            <label class="text-gray-400 text-sm mb-1 block">Password</label>
            <input formControlName="password" type="password"
              class="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700
                     focus:border-primary focus:outline-none"
              placeholder="••••••••"/>
          </div>

          @if (error) {
            <p class="text-red-500 text-sm">{{ error }}</p>
          }

          <button type="submit" [disabled]="form.invalid || loading"
            class="w-full bg-primary text-white py-3 rounded font-semibold
                   hover:bg-red-700 transition disabled:opacity-50">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="text-gray-500 text-sm text-center mt-4">
          Don't have an account?
          <a routerLink="/register" class="text-primary hover:underline">Register</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  error = '';
  loading = false;

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.auth.login(this.form.value as any).subscribe({
      next: (user) => {
        this.auth.saveUser(user);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.error = 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}
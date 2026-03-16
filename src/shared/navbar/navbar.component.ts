// shared/navbar/navbar.component.ts
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';          // remove RouterLinkActive
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],                 // removed RouterLinkActive
  template: `
    <nav class="bg-dark border-b border-gray-800 px-6 py-4 flex justify-between items-center">
      <a routerLink="/home" class="text-primary text-2xl font-bold">VeloStream</a>

      <div class="flex items-center gap-6">
        <a routerLink="/home" class="text-gray-300 hover:text-white transition">Movies</a>

        @if (auth.isLoggedIn()) {
          <a routerLink="/watchlist" class="text-gray-300 hover:text-white transition">Watchlist</a>
        }

        @if (auth.isAdmin()) {
          <a routerLink="/admin" class="text-yellow-400 hover:text-yellow-300 transition">Admin</a>
        }

        @if (auth.isLoggedIn()) {
          <span class="text-gray-400 text-sm">{{ auth.currentUser()?.email }}</span>
          <button (click)="auth.logout()"
            class="bg-primary px-4 py-2 rounded text-white hover:bg-red-700 transition text-sm">
            Logout
          </button>
        } @else {
          <a routerLink="/login"
            class="bg-primary px-4 py-2 rounded text-white hover:bg-red-700 transition text-sm">
            Login
          </a>
        }
      </div>
    </nav>
  `
})
export class NavbarComponent {
  auth = inject(AuthService);
}
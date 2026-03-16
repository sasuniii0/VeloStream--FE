import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie.model';
import { AuthService } from '../../core/services/auth.service';
import { WatchlistService } from '../../core/services/watchlist.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="bg-card rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer">
      <a [routerLink]="['/movies', movie.id]">
        <img [src]="movie.posterUrl || 'https://via.placeholder.com/300x450?text=' + movie.title"
          [alt]="movie.title"
          class="w-full h-64 object-cover"/>
      </a>

      <div class="p-4">
        <a [routerLink]="['/movies', movie.id]">
          <h3 class="text-white font-semibold text-lg truncate hover:text-primary transition">
            {{ movie.title }}
          </h3>
        </a>

        <div class="flex justify-between items-center mt-2">
          <span class="text-gray-400 text-sm">{{ movie.releaseYear }}</span>
          <span class="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
            {{ movie.genre }}
          </span>
        </div>

        <div class="flex justify-between items-center mt-3">
          <div class="flex items-center gap-1">
            <span class="text-yellow-400 text-sm">★</span>
            <span class="text-gray-300 text-sm">{{ movie.rating | number:'1.1-1' }}</span>
          </div>

          @if (auth.isLoggedIn()) {
            <button (click)="toggleWatchlist()"
              class="text-xs px-3 py-1 rounded transition"
              [class]="inWatchlist
                ? 'bg-primary text-white hover:bg-red-700'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'">
              {{ inWatchlist ? '✓ Saved' : '+ Watchlist' }}
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() inWatchlist = false;
  @Output() watchlistChanged = new EventEmitter<void>();

  auth = inject(AuthService);
  private watchlistService = inject(WatchlistService);

  toggleWatchlist() {
    if (this.inWatchlist) {
      this.watchlistService.remove(this.movie.id).subscribe(() => {
        this.inWatchlist = false;
        this.watchlistChanged.emit();
      });
    } else {
      this.watchlistService.add(this.movie.id).subscribe(() => {
        this.inWatchlist = true;
        this.watchlistChanged.emit();
      });
    }
  }
}
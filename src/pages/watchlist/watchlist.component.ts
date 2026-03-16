import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { WatchlistService } from '../../core/services/watchlist.service';
import { WatchlistItem } from '../../models/watchlist.model';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar/>

    <div class="px-8 py-10 max-w-5xl mx-auto">
      <h1 class="text-3xl font-bold text-white mb-8">My Watchlist</h1>

      @if (loading) {
        <p class="text-gray-400">Loading...</p>
      } @else if (items.length === 0) {
        <div class="text-center py-20">
          <p class="text-gray-400 text-xl mb-4">Your watchlist is empty</p>
          <a routerLink="/home"
            class="bg-primary text-white px-6 py-3 rounded hover:bg-red-700 transition">
            Browse Movies
          </a>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (item of items; track item.id) {
            <div class="bg-card rounded-lg overflow-hidden">
              <a [routerLink]="['/movies', item.movieId]">
                <img [src]="item.posterUrl || 'https://via.placeholder.com/300x200'"
                  class="w-full h-48 object-cover hover:opacity-80 transition"/>
              </a>
              <div class="p-4">
                <a [routerLink]="['/movies', item.movieId]"
                  class="text-white font-semibold hover:text-primary transition">
                  {{ item.movieTitle }}
                </a>
                <p class="text-gray-400 text-sm mt-1">{{ item.movieGenre }}</p>
                <div class="flex justify-between items-center mt-3">
                  <span class="text-gray-500 text-xs">
                    Added {{ item.addedAt | date:'mediumDate' }}
                  </span>
                  <button (click)="remove(item)"
                    class="text-red-500 hover:text-red-400 text-sm transition">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class WatchlistComponent implements OnInit {
  private watchlistService = inject(WatchlistService);

  items: WatchlistItem[] = [];
  loading = false;

  ngOnInit() {
    this.loading = true;
    this.watchlistService.getMyWatchlist().subscribe({
      next: (items) => { this.items = items; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  remove(item: WatchlistItem) {
    this.watchlistService.remove(item.movieId).subscribe(() => {
      this.items = this.items.filter(i => i.id !== item.id);
    });
  }
}
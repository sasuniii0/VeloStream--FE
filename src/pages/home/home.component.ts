import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../core/services/movie.service';
import { MovieCardComponent } from '../../shared/movie-card/movie-card.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Movie } from '../../models/movie.model';

const GENRES = ['ALL','ACTION','COMEDY','DRAMA','HORROR',
                'THRILLER','ROMANCE','SCI_FI','DOCUMENTARY'];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCardComponent, NavbarComponent],
  template: `
    <app-navbar/>

    <!-- Hero -->
    <div class="bg-gradient-to-b from-gray-900 to-dark px-6 py-16 text-center">
      <h1 class="text-5xl font-bold text-white mb-4">
        Welcome to <span class="text-primary">VeloStream</span>
      </h1>
      <p class="text-gray-400 text-lg mb-8">Discover and track your favourite movies</p>

      <!-- Search -->
      <div class="flex gap-3 max-w-xl mx-auto">
        <input [(ngModel)]="searchTitle" (ngModelChange)="onSearch()"
          type="text" placeholder="Search movies..."
          class="flex-1 bg-gray-800 text-white px-4 py-3 rounded border border-gray-700
                 focus:border-primary focus:outline-none"/>
        <button (click)="onSearch()"
          class="bg-primary text-white px-6 py-3 rounded hover:bg-red-700 transition">
          Search
        </button>
      </div>
    </div>

    <!-- Genre Filter -->
    <div class="px-6 py-4 flex gap-2 overflow-x-auto">
      @for (genre of genres; track genre) {
        <button (click)="selectGenre(genre)"
          class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition"
          [class]="selectedGenre === genre
            ? 'bg-primary text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'">
          {{ genre }}
        </button>
      }
    </div>

    <!-- Movies Grid -->
    <div class="px-6 pb-12">
      @if (loading) {
        <div class="text-center py-20">
          <p class="text-gray-400 text-lg">Loading movies...</p>
        </div>
      } @else if (movies.length === 0) {
        <div class="text-center py-20">
          <p class="text-gray-400 text-lg">No movies found</p>
        </div>
      } @else {
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          @for (movie of movies; track movie.id) {
            <app-movie-card [movie]="movie"/>
          }
        </div>
      }
    </div>
  `
})
export class HomeComponent implements OnInit {
  private movieService = inject(MovieService);

  movies: Movie[] = [];
  genres = GENRES;
  selectedGenre = 'ALL';
  searchTitle = '';
  loading = false;

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.loading = true;
    this.movieService.getAll().subscribe({
      next: (movies) => { this.movies = movies; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch() {
    this.loading = true;
    const genre = this.selectedGenre === 'ALL' ? undefined : this.selectedGenre;
    const title = this.searchTitle || undefined;

    this.movieService.search(title, genre).subscribe({
      next: (movies) => { this.movies = movies; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  selectGenre(genre: string) {
    this.selectedGenre = genre;
    this.onSearch();
  }
}
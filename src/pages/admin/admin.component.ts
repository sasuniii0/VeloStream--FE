import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { MovieService } from '../../core/services/movie.service';
import { Movie, MovieRequest } from '../../models/movie.model';

const GENRES = ['ACTION','COMEDY','DRAMA','HORROR','THRILLER','ROMANCE','SCI_FI','DOCUMENTARY'];

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  template: `
    <app-navbar/>

    <div class="px-8 py-10 max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-white mb-8">Admin Panel</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">

        <!-- Add / Edit Movie Form -->
        <div class="bg-card rounded-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-6">
            {{ editingId ? 'Edit Movie' : 'Add New Movie' }}
          </h2>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <input formControlName="title" placeholder="Title"
              class="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700
                     focus:border-primary focus:outline-none"/>

            <textarea formControlName="description" placeholder="Description" rows="3"
              class="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700
                     focus:border-primary focus:outline-none resize-none"></textarea>

            <input formControlName="director" placeholder="Director"
              class="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700
                     focus:border-primary focus:outline-none"/>

            <input formControlName="releaseYear" type="number" placeholder="Release Year"
              class="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700
                     focus:border-primary focus:outline-none"/>

            <select formControlName="genre"
              class="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700
                     focus:border-primary focus:outline-none">
              <option value="">Select Genre</option>
              @for (genre of genres; track genre) {
                <option [value]="genre">{{ genre }}</option>
              }
            </select>

            <input formControlName="posterUrl" placeholder="Poster URL"
              class="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700
                     focus:border-primary focus:outline-none"/>

            @if (successMsg) {
              <p class="text-green-500 text-sm">{{ successMsg }}</p>
            }
            @if (errorMsg) {
              <p class="text-red-500 text-sm">{{ errorMsg }}</p>
            }

            <div class="flex gap-3">
              <button type="submit" [disabled]="form.invalid"
                class="flex-1 bg-primary text-white py-3 rounded hover:bg-red-700
                       transition disabled:opacity-50">
                {{ editingId ? 'Update Movie' : 'Add Movie' }}
              </button>
              @if (editingId) {
                <button type="button" (click)="cancelEdit()"
                  class="px-6 bg-gray-700 text-white py-3 rounded hover:bg-gray-600 transition">
                  Cancel
                </button>
              }
            </div>
          </form>
        </div>

        <!-- Movie List -->
        <div>
          <h2 class="text-xl font-semibold text-white mb-6">
            All Movies ({{ movies.length }})
          </h2>

          <div class="space-y-3 max-h-screen overflow-y-auto pr-2">
            @for (movie of movies; track movie.id) {
              <div class="bg-card rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p class="text-white font-medium">{{ movie.title }}</p>
                  <p class="text-gray-400 text-sm">{{ movie.genre }} · {{ movie.releaseYear }}</p>
                </div>
                <div class="flex gap-2">
                  <button (click)="editMovie(movie)"
                    class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition">
                    Edit
                  </button>
                  <button (click)="deleteMovie(movie.id)"
                    class="bg-red-700 text-white px-3 py-1 rounded text-sm hover:bg-red-800 transition">
                    Delete
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  private fb = inject(FormBuilder);
  private movieService = inject(MovieService);

  movies: Movie[] = [];
  genres = GENRES;
  editingId: number | null = null;
  successMsg = '';
  errorMsg = '';

  form = this.fb.group({
    title:       ['', Validators.required],
    description: ['', Validators.required],
    director:    ['', Validators.required],
    releaseYear: [2024, Validators.required],
    genre:       ['', Validators.required],
    posterUrl:   ['']
  });

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getAll().subscribe(m => this.movies = m);
  }

  onSubmit() {
    if (this.form.invalid) return;
    const request = this.form.value as MovieRequest;

    if (this.editingId) {
      this.movieService.update(this.editingId, request).subscribe({
        next: () => {
          this.successMsg = 'Movie updated successfully';
          this.cancelEdit();
          this.loadMovies();
        },
        error: () => this.errorMsg = 'Update failed'
      });
    } else {
      this.movieService.add(request).subscribe({
        next: () => {
          this.successMsg = 'Movie added successfully';
          this.form.reset({ releaseYear: 2024 });
          this.loadMovies();
        },
        error: () => this.errorMsg = 'Failed to add movie'
      });
    }
  }

  editMovie(movie: Movie) {
    this.editingId = movie.id;
    this.form.patchValue(movie);
    this.successMsg = '';
    this.errorMsg = '';
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset({ releaseYear: 2024 });
  }

  deleteMovie(id: number) {
    if (!confirm('Delete this movie?')) return;
    this.movieService.delete(id).subscribe(() => {
      this.movies = this.movies.filter(m => m.id !== id);
    });
  }
}
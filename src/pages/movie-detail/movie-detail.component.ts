import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { MovieService } from '../../core/services/movie.service';
import { ReviewService } from '../../core/services/review.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { AuthService } from '../../core/services/auth.service';
import { Movie } from '../../models/movie.model';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar/>

    @if (movie) {
      <div class="min-h-screen bg-dark">

        <!-- Hero Banner -->
        <div class="relative h-96 overflow-hidden">
          <img [src]="movie.posterUrl || 'https://via.placeholder.com/1200x400'"
            class="w-full h-full object-cover opacity-40"/>
          <div class="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
          <div class="absolute bottom-8 left-8">
            <h1 class="text-4xl font-bold text-white">{{ movie.title }}</h1>
            <div class="flex items-center gap-4 mt-2">
              <span class="text-yellow-400 text-xl">★ {{ movie.rating | number:'1.1-1' }}</span>
              <span class="bg-gray-700 text-gray-300 px-3 py-1 rounded">{{ movie.genre }}</span>
              <span class="text-gray-400">{{ movie.releaseYear }}</span>
            </div>
          </div>
        </div>

        <div class="px-8 py-8 max-w-4xl">

          <!-- Movie Info -->
          <p class="text-gray-300 text-lg leading-relaxed mb-4">{{ movie.description }}</p>
          <p class="text-gray-400">Directed by <span class="text-white">{{ movie.director }}</span></p>

          <!-- Watchlist Button -->
          @if (auth.isLoggedIn()) {
            <button (click)="toggleWatchlist()"
              class="mt-6 px-6 py-3 rounded font-semibold transition"
              [class]="inWatchlist
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-primary text-white hover:bg-red-700'">
              {{ inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist' }}
            </button>
          }

          <!-- Reviews Section -->
          <div class="mt-12">
            <h2 class="text-2xl font-bold text-white mb-6">Reviews</h2>

            <!-- Add Review Form -->
            @if (auth.isLoggedIn()) {
              <div class="bg-card rounded-lg p-6 mb-8">
                <h3 class="text-white font-semibold mb-4">Write a Review</h3>

                <!-- Star Rating -->
                <div class="flex gap-2 mb-4">
                  @for (star of [1,2,3,4,5]; track star) {
                    <button (click)="newRating = star"
                      class="text-3xl transition"
                      [class]="star <= newRating ? 'text-yellow-400' : 'text-gray-600'">
                      ★
                    </button>
                  }
                </div>

                <textarea [(ngModel)]="newComment" rows="3"
                  placeholder="Share your thoughts about this movie..."
                  class="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700
                         focus:border-primary focus:outline-none resize-none mb-4"></textarea>

                @if (reviewError) {
                  <p class="text-red-500 text-sm mb-3">{{ reviewError }}</p>
                }

                <button (click)="submitReview()" [disabled]="!newComment || !newRating"
                  class="bg-primary text-white px-6 py-2 rounded hover:bg-red-700
                         transition disabled:opacity-50">
                  Submit Review
                </button>
              </div>
            }

            <!-- Reviews List -->
            @if (reviews.length === 0) {
              <p class="text-gray-500">No reviews yet. Be the first to review!</p>
            }
            @for (review of reviews; track review.id) {
              <div class="bg-card rounded-lg p-5 mb-4">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-gray-400 text-sm">{{ review.userEmail }}</span>
                  <div class="flex">
                    @for (star of [1,2,3,4,5]; track star) {
                      <span [class]="star <= review.rating ? 'text-yellow-400' : 'text-gray-600'">★</span>
                    }
                  </div>
                </div>
                <p class="text-gray-300">{{ review.comment }}</p>
                <p class="text-gray-600 text-xs mt-2">
                  {{ review.createdAt | date:'mediumDate' }}
                </p>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class MovieDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private reviewService = inject(ReviewService);
  private watchlistService = inject(WatchlistService);
  auth = inject(AuthService);

  movie: Movie | null = null;
  reviews: Review[] = [];
  inWatchlist = false;
  newComment = '';
  newRating = 0;
  reviewError = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMovie(id);
    this.loadReviews(id);
    if (this.auth.isLoggedIn()) {
      this.watchlistService.check(id).subscribe(result => this.inWatchlist = result);
    }
  }

  loadMovie(id: number) {
    this.movieService.getById(id).subscribe(m => this.movie = m);
  }

  loadReviews(id: number) {
    this.reviewService.getByMovie(id).subscribe(r => this.reviews = r);
  }

  toggleWatchlist() {
    if (!this.movie) return;
    if (this.inWatchlist) {
      this.watchlistService.remove(this.movie.id).subscribe(() => this.inWatchlist = false);
    } else {
      this.watchlistService.add(this.movie.id).subscribe(() => this.inWatchlist = true);
    }
  }

  submitReview() {
    if (!this.movie || !this.newComment || !this.newRating) return;
    this.reviewError = '';

    this.reviewService.addReview({
      movieId: this.movie.id,
      comment: this.newComment,
      rating: this.newRating
    }).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.newComment = '';
        this.newRating = 0;
        this.loadMovie(this.movie!.id);  // refresh rating
      },
      error: () => this.reviewError = 'You may have already reviewed this movie.'
    });
  }
}
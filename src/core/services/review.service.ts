import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Review, ReviewRequest } from '../../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {

  private apiUrl = `${environment.apiUrl}/api/reviews`;

  constructor(private http: HttpClient) {}

  getByMovie(movieId: number) {
    return this.http.get<Review[]>(`${this.apiUrl}/movie/${movieId}`);
  }

  getAverageRating(movieId: number) {
    return this.http.get<number>(`${this.apiUrl}/movie/${movieId}/average`);
  }

  addReview(request: ReviewRequest) {
    return this.http.post<Review>(this.apiUrl, request);
  }
}
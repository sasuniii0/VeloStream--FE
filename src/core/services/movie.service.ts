import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Movie, MovieRequest } from '../../models/movie.model';

@Injectable({ providedIn: 'root' })
export class MovieService {

  private apiUrl = `${environment.apiUrl}/api/movies`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  search(title?: string, genre?: string) {
    let params = new HttpParams();
    if (title) params = params.set('title', title);
    if (genre) params = params.set('genre', genre);
    return this.http.get<Movie[]>(`${this.apiUrl}/search`, { params });
  }

  add(movie: MovieRequest) {
    return this.http.post<Movie>(this.apiUrl, movie);
  }

  update(id: number, movie: MovieRequest) {
    return this.http.put<Movie>(`${this.apiUrl}/${id}`, movie);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
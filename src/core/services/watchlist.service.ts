import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { WatchlistItem } from '../../models/watchlist.model';

@Injectable({ providedIn: 'root' })
export class WatchlistService {

  private apiUrl = `${environment.apiUrl}/api/watchlist`;

  constructor(private http: HttpClient) {}

  getMyWatchlist() {
    return this.http.get<WatchlistItem[]>(this.apiUrl);
  }

  add(movieId: number) {
    return this.http.post<WatchlistItem>(`${this.apiUrl}/${movieId}`, {});
  }

  remove(movieId: number) {
    return this.http.delete(`${this.apiUrl}/${movieId}`);
  }

  check(movieId: number) {
    return this.http.get<boolean>(`${this.apiUrl}/check/${movieId}`);
  }
}
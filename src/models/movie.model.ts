// models/movie.model.ts
export interface Movie {
  id: number;
  title: string;
  description: string;
  director: string;
  releaseYear: number;
  genre: string;
  rating: number;
  posterUrl: string;
}

export interface MovieRequest {
  title: string;
  description: string;
  director: string;
  releaseYear: number;
  genre: string;
  posterUrl: string;
}
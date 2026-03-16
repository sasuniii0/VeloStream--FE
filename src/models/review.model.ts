export interface Review {
  id: number;
  movieId: number;
  userEmail: string;
  comment: string;
  rating: number;
  createdAt: string;
}

export interface ReviewRequest {
  movieId: number;
  comment: string;
  rating: number;
}
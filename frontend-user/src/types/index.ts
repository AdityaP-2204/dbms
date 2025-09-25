// types.ts - Centralized type definitions

// Backend Review interface (matches the backend model)
export interface Review {
  review_id: number;
  user_id: string;
  product_id: string;
  comment: string;
  rating: number;
  created_at: string;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  address?: string;
  role?: string;
}

// Frontend interfaces (existing)
export interface Faculty {
  id: string;
  name: string;
  description: string;
  email: string;
  institute_name: string;
  profile_image: string;
}

export interface Variant {
  id: string;
  attempt: string;
  price: number;
  variant_image: string;
  delivery_mode: string;
  availability: boolean;
  validity: string;
  product_id: string;
}

export interface JoinedProduct {
  id: number;
  title: string;
  description: string;
  course_name: string;
  course_description: string;
  product_type: string;
  product_image: string;
  is_combo: boolean;
  rating: number;
  total_reviews: number;
  variants: Variant[];
  subjects: string[];
  faculties: Faculty[];
  reviews: any[]; // This will be replaced by actual Review data
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: number;
}

// Review form data
export interface ReviewFormData {
  user_id: string;
  product_id: string;
  comment: string;
  rating: number;
  created_at?: string;
}

export interface UpdateReviewData {
  comment: string;
  rating: number;
}

// Product rating statistics
export interface ProductRatingStats {
  average_rating: number;
  review_count: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
}

export interface ProductWithRating {
  product_id: string;
  product_title: string;
  average_rating: number;
  review_count: number;
}

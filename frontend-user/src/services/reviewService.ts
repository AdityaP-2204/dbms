// services/reviewService.ts - Review API service
import axios from 'axios';
import axiosInstance from '../api/axiosConfig';
import type { Review, ReviewFormData, UpdateReviewData, User } from '../types';

const BASE_URL = 'http://localhost:8080';

class ReviewService {
  // Get all reviews
  async getAllReviews(): Promise<Review[]> {
    const response = await axios.get(`${BASE_URL}/api/v1/review`);
    return response.data;
  }

  // Get reviews by product ID
  async getReviewsByProduct(productId: string): Promise<Review[]> {
    const response = await axios.get(`${BASE_URL}/api/v1/review?product_id=${productId}`);
    return response.data;
  }

  // Get reviews by user ID
  async getReviewsByUser(userId: string): Promise<Review[]> {
    const response = await axios.get(`${BASE_URL}/api/v1/review?user_id=${userId}`);
    return response.data;
  }

  // Get a specific review by ID
  async getReviewById(reviewId: number): Promise<Review> {
    const response = await axios.get(`${BASE_URL}/api/v1/review?review_id=${reviewId}`);
    return response.data;
  }

  // Create a new review
  async createReview(reviewData: ReviewFormData): Promise<number> {
    const response = await axiosInstance.post(`${BASE_URL}/api/v1/review`, reviewData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  // Update a review
  async updateReview(reviewId: number, updateData: UpdateReviewData): Promise<number> {
    const response = await axiosInstance.put(`${BASE_URL}/api/v1/review?review_id=${reviewId}`, updateData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  // Get product rating statistics
  async getProductRatingStats(productId: string): Promise<any> {
    const response = await axios.get(`${BASE_URL}/api/v1/review/stats?product_id=${productId}`);
    return response.data;
  }

  // Get all products with their ratings
  async getAllProductsWithRatings(): Promise<any[]> {
    const response = await axios.get(`${BASE_URL}/api/v1/review/products-with-ratings`);
    return response.data;
  }

  // Delete a review
  async deleteReview(reviewId: number): Promise<number> {
    const response = await axiosInstance.delete(`${BASE_URL}/api/v1/review?review_id=${reviewId}`);
    return response.data;
  }

  // Get all users (for mapping user IDs to names)
  async getAllUsers(): Promise<User[]> {
    const response = await axios.get(`${BASE_URL}/api/v1/user`);
    return response.data;
  }
}

export const reviewService = new ReviewService();
export default reviewService;

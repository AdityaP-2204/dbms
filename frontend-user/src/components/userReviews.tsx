import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaBook, FaStar } from 'react-icons/fa';
import reviewService from '../services/reviewService';
import StarRating from './StarRating';
import type { Review, JoinedProduct } from '../types';
import axios from 'axios';

interface UserReviewsProps {
  userId: string;
}

export default function UserReviews({ userId }: UserReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<{ [key: string]: JoinedProduct }>({});
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(5);

  useEffect(() => {
    fetchUserReviews();
    fetchProducts();
  }, [userId]);

  const fetchUserReviews = async () => {
    try {
      const userReviews = await reviewService.getReviewsByUser(userId);
      setReviews(userReviews);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/joinedProduct');
      const productMap: { [key: string]: JoinedProduct } = {};
      response.data.forEach((product: JoinedProduct) => {
        productMap[product.id.toString()] = product;
      });
      setProducts(productMap);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleUpdateReview = async (reviewId: number) => {
    if (!editComment.trim()) return;

    try {
      const result = await reviewService.updateReview(reviewId, {
        comment: editComment.trim(),
        rating: editRating
      });

      if (result === 1) {
        setEditingReview(null);
        setEditComment('');
        setEditRating(5);
        fetchUserReviews(); // Refresh reviews
        alert('Review updated successfully!');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review. Please try again.');
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const result = await reviewService.deleteReview(reviewId);

      if (result === 1) {
        fetchUserReviews(); // Refresh reviews
        alert('Review deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  const startEditing = (review: Review) => {
    setEditingReview(review.review_id);
    setEditComment(review.comment);
    setEditRating(review.rating || 5);
  };

  const cancelEditing = () => {
    setEditingReview(null);
    setEditComment('');
    setEditRating(5);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl mt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FaStar className="mr-2 text-yellow-500" />
          My Reviews
        </h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl mt-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <FaStar className="mr-2 text-yellow-500" />
        My Reviews ({reviews.length})
      </h3>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No reviews yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Start exploring courses and share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const product = products[review.product_id];
            return (
              <div key={review.review_id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {product && (
                        <img
                          src={product.product_image}
                          alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {product?.title || 'Product not found'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {product?.course_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={review.rating} readonly size="sm" />
                      <span className="text-sm text-gray-500">
                        Reviewed on {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => startEditing(review)}
                      className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                      title="Edit review"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.review_id)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete review"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>

                {editingReview === review.review_id ? (
                  <div className="mt-3">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <StarRating
                        rating={editRating}
                        onRatingChange={setEditRating}
                        size="md"
                      />
                    </div>
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows={3}
                      maxLength={1000}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-500">
                        {editComment.length}/1000 characters
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1 text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateReview(review.review_id)}
                          disabled={!editComment.trim()}
                          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">"{review.comment}"</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

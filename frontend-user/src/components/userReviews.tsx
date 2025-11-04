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
      // Sort by created_at in descending order and take only the latest 5
      const sortedReviews = userReviews.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const latestReviews = sortedReviews.slice(0, 5);
      setReviews(latestReviews);
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
    <div className="bg-white shadow-xl rounded-2xl p-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <FaStar className="text-white" />
          </div>
          My Recent Reviews
        </h3>
        <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
          {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBook className="text-gray-400 text-3xl" />
          </div>
          <p className="text-gray-600 text-lg font-semibold mb-2">No reviews yet</p>
          <p className="text-gray-400 text-sm">
            Start exploring courses and share your thoughts!
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-6">
            Showing your {reviews.length} most recent review{reviews.length !== 1 ? 's' : ''}
          </p>
          <div className="space-y-5">
            {reviews.map((review, index) => {
              const product = products[review.product_id];
              return (
                <div 
                  key={review.review_id} 
                  className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {product && (
                          <img
                            src={product.product_image}
                            alt={product.product_title || 'Product'}
                            className="w-16 h-16 rounded-xl object-cover shadow-md border-2 border-white"
                          />
                        )}
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">
                            {product?.product_title || 'Product not found'}
                          </h4>
                          <p className="text-sm text-blue-600 font-medium">
                            {product?.course_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <StarRating rating={review.rating} readonly size="sm" />
                          <span className="text-sm font-semibold text-gray-700 ml-1">
                            {review.rating}/5
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.created_at)}
                        </span>
                        {index === 0 && (
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                            Latest
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEditing(review)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                        title="Edit review"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.review_id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                        title="Delete review"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>

                  {editingReview === review.review_id ? (
                    <div className="mt-4 bg-white rounded-lg p-4 border-2 border-blue-200">
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Update Rating
                        </label>
                        <StarRating
                          rating={editRating}
                          onRatingChange={setEditRating}
                          size="md"
                        />
                      </div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Update Comment
                      </label>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full p-4 border-2 border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        rows={4}
                        maxLength={1000}
                        placeholder="Share your thoughts about this course..."
                      />
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-gray-500">
                          {editComment.length}/1000 characters
                        </span>
                        <div className="flex gap-3">
                          <button
                            onClick={cancelEditing}
                            className="px-5 py-2 text-gray-600 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdateReview(review.review_id)}
                            disabled={!editComment.trim()}
                            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <p className="text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

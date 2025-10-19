import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import reviewService from '../services/reviewService';
import StarRating from './StarRating';
import type { Review, User } from '../types';

interface ReviewSectionProps {
  productId: string;
  userId: string | null;
  hideAddReview?: boolean;
}

export default function ReviewSection({ productId, userId, hideAddReview }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(5);

  // Fetch reviews for the product
  useEffect(() => {
    fetchReviews();
    fetchUsers();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const reviews = await reviewService.getReviewsByProduct(productId);
      setReviews(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await reviewService.getAllUsers();
      const userMap: { [key: string]: User } = {};
      users.forEach((user: User) => {
        userMap[user.id] = user;
      });
      setUsers(userMap);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newComment.trim()) return;

    try {
      const reviewData = {
        user_id: userId,
        product_id: productId,
        comment: newComment.trim(),
        rating: newRating,
        created_at: new Date().toISOString()
      };

      const result = await reviewService.createReview(reviewData);

      if (result === 1) {
        setNewComment('');
        setNewRating(5);
        setShowAddForm(false);
        fetchReviews(); // Refresh reviews
        alert('Review added successfully!');
      }
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Failed to add review. Please try again.');
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
        fetchReviews(); // Refresh reviews
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
        fetchReviews(); // Refresh reviews
        alert('Review deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  const startEdit = (review: Review) => {
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
      <div className="mt-8">
        <h4 className="font-bold text-gray-800 text-xl mb-4">Reviews</h4>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-gray-800 text-xl">
          Reviews ({reviews.length})
        </h4>
        {userId && !hideAddReview && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FaPlus size={14} />
            Add Review
          </button>
        )}
      </div>

      {/* Add Review Form */}
      {showAddForm && userId && (
        <form onSubmit={handleAddReview} className="mb-6 p-6 bg-gray-50 rounded-lg border">
          <h5 className="font-semibold text-gray-800 mb-3">Write a Review</h5>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <StarRating
              rating={newRating}
              onRatingChange={setNewRating}
              size="lg"
            />
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this course..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={4}
            maxLength={1000}
            required
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-gray-500">
              {newComment.length}/1000 characters
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewComment('');
                  setNewRating(5);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
              >
                Post Review
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No reviews yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Be the first to share your thoughts about this course!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.review_id} className="border p-6 rounded-lg bg-white shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-lg text-gray-800">
                    {users[review.user_id]?.name || 'Anonymous User'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={review.rating} readonly size="sm" />
                    <span className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                </div>
                {userId === review.user_id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(review)}
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
                )}
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
                <p className="text-gray-700 leading-relaxed mt-2">"{review.comment}"</p>
              )}
            </div>
          ))}
        </div>
      )}

      {!userId && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-center">
            Please <span className="font-semibold">sign in</span> to write a review
          </p>
        </div>
      )}
    </div>
  );
}

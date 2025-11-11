import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reviewService } from '@/features/review/reviewApi';
import { Star, ArrowLeft, Edit2, Trash2, Loader2 } from 'lucide-react';

const MyReviews = () => {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMyReviews();
  }, [currentPage]);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getMyReviews(currentPage, 10);

      if (response.success) {
        setReviews(response.data.reviews);
        setTotalPages(response.data.total_pages);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      setDeletingId(reviewId);
      const response = await reviewService.deleteReview(reviewId);

      if (response.success) {
        // Remove from local state
        setReviews(reviews.filter((r) => r.id !== reviewId));
      }
    } catch (err) {
      setError(err.message || 'Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-primary text-primary'
                : 'text-text-secondary-light/50 dark:text-text-secondary-dark/50'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center p-4 justify-between max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-text-primary-light dark:text-text-primary-dark flex size-10 items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold leading-tight flex-1 text-center">
            My Reviews
          </h1>
          <div className="size-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-500 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-12 text-center">
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
              You haven't written any reviews yet
            </p>
            <button
              onClick={() => navigate('/buyer/orders')}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
            >
              View Orders
            </button>
          </div>
        ) : (
          <>
            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 md:p-6 shadow-sm space-y-4"
                >
                  {/* Product Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={review.product.image}
                      alt={review.product.name}
                      className="size-16 md:size-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-text-primary-light dark:text-text-primary-dark text-base md:text-lg font-semibold truncate">
                        {review.product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Title */}
                  <h4 className="text-text-primary-light dark:text-text-primary-dark font-semibold">
                    {review.title}
                  </h4>

                  {/* Review Content */}
                  <p className="text-text-primary-light dark:text-text-primary-dark text-sm md:text-base leading-relaxed">
                    {review.comment}
                  </p>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {review.images.map((image) => (
                        <img
                          key={image.id}
                          src={image.image_url}
                          alt={image.alt_text}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover flex-shrink-0"
                        />
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-background-light dark:border-background-dark">
                    <button
                      onClick={() => navigate(`/buyer/reviews/edit/${review.id}`)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-primary/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deletingId === review.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                    >
                      {deletingId === review.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto px-6 py-2 rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-text-primary-light dark:text-text-primary-dark font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto px-6 py-2 rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MyReviews;
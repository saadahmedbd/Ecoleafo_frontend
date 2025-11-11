import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reviewService } from '@/features/review/reviewApi';
import { Star, ArrowLeft, Search, ChevronDown } from 'lucide-react';

const ProductReviews = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    averageRating: 0,
    total: 0,
    ratingBreakdown: {
      five_star: 0,
      four_star: 0,
      three_star: 0,
      two_star: 0,
      one_star: 0,
    },
  });

  useEffect(() => {
    fetchReviews();
  }, [productId, filterRating, sortBy, currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getProductReviews(productId, {
        rating: filterRating,
        sortBy,
        page: currentPage,
        perPage: 10,
      });

      if (response.success) {
        setReviews(response.data.reviews);
        setTotalPages(response.data.total_pages);
        setStats({
          averageRating: response.data.average_rating,
          total: response.data.total,
          ratingBreakdown: response.data.rating_breakdown,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, size = 'w-5 h-5') => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
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

  const RatingBar = ({ stars, count }) => {
    const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

    return (
      <button
        onClick={() => setFilterRating(filterRating === stars ? null : stars)}
        className={`flex items-center gap-3 w-full hover:bg-surface-light dark:hover:bg-surface-dark p-2 rounded transition-colors ${
          filterRating === stars ? 'bg-surface-light dark:bg-surface-dark' : ''
        }`}
      >
        <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark w-8">
          {stars}★
        </span>
        <div className="flex-1 h-2 bg-background-light dark:bg-background-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark w-12 text-right">
          {count}
        </span>
      </button>
    );
  };

  const filteredReviews = reviews.filter((review) =>
    review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && reviews.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-text-primary-light dark:text-text-primary-dark">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center p-4 pb-2 justify-between max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-text-primary-light dark:text-text-primary-dark flex size-10 items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold leading-tight flex-1 text-center">
            Customer Reviews
          </h1>
          <div className="size-10" />
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 max-w-7xl mx-auto">
          <div className="relative flex w-full items-stretch rounded-lg h-12">
            <div className="text-text-secondary-light dark:text-text-secondary-dark pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-4">
              <Search className="w-5 h-5" />
            </div>
            <input
              className="form-input flex w-full resize-none overflow-hidden rounded-lg text-text-primary-light dark:text-text-primary-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-surface-light dark:bg-surface-dark h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark pl-12 pr-4 text-base font-normal"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Rating Summary */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Average Rating */}
            <div className="flex flex-col items-center md:items-start gap-2 md:border-r md:border-background-light dark:md:border-background-dark md:pr-6">
              <div className="text-5xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {stats.averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(stats.averageRating))}
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Based on {stats.total} reviews
              </p>
            </div>

            {/* Rating Breakdown */}
            <div className="flex-1 space-y-2">
              <RatingBar stars={5} count={stats.ratingBreakdown.five_star} />
              <RatingBar stars={4} count={stats.ratingBreakdown.four_star} />
              <RatingBar stars={3} count={stats.ratingBreakdown.three_star} />
              <RatingBar stars={2} count={stats.ratingBreakdown.two_star} />
              <RatingBar stars={1} count={stats.ratingBreakdown.one_star} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark border-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_rated">Highest Rated</option>
            <option value="lowest_rated">Lowest Rated</option>
          </select>

          {filterRating && (
            <button
              onClick={() => setFilterRating(null)}
              className="px-4 py-2 rounded-lg bg-primary text-white font-medium"
            >
              Clear Filter ({filterRating}★)
            </button>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-surface-light dark:bg-surface-dark rounded-xl">
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                No reviews found
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm space-y-3"
              >
                {/* Product Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={review.product.image}
                    alt={review.product.name}
                    className="size-12 rounded-md object-cover"
                  />
                  <div className="flex-1 space-y-2">
                    <p className="text-text-primary-light dark:text-text-primary-dark text-base font-semibold">
                      {review.product.name}
                    </p>
                    {renderStars(review.rating)}
                  </div>
                </div>

                {/* Review Title */}
                <h3 className="text-text-primary-light dark:text-text-primary-dark font-semibold">
                  {review.title}
                </h3>

                {/* Review Content */}
                <p className="text-text-primary-light dark:text-text-primary-dark text-base leading-relaxed">
                  {review.comment}
                </p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {review.images.map((image) => (
                      <img
                        key={image.id}
                        src={image.image_url}
                        alt={image.alt_text}
                        className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                      />
                    ))}
                  </div>
                )}

                {/* Reviewer Info */}
                <div className="flex items-center justify-between pt-2 border-t border-background-light dark:border-background-dark">
                  <div className="flex items-center gap-2">
                    {review.buyer.profile_picture ? (
                      <img
                        src={review.buyer.profile_picture}
                        alt={`${review.buyer.first_name} ${review.buyer.last_name}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {review.buyer.first_name[0]}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                      {review.buyer.first_name} {review.buyer.last_name[0]}.
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {formatDate(review.created_at)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 py-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-text-primary-light dark:text-text-primary-dark">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductReviews;
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductReviewsQuery } from '@/features/review/reviewApi';
import { Star, ArrowLeft, Search } from 'lucide-react';

const ProductReviews = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useGetProductReviewsQuery({
    product_id: parseInt(productId),
    rating: filterRating,
    page: currentPage,
    per_page: 10,
    sort_by: sortBy,
  });

  const reviews = data?.data?.reviews || [];
  const pagination = data?.data?.pagination || {};
  const totalPages = pagination.total_pages || 0;

  const renderStars = (rating, size = 'w-5 h-5') => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`${size} ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const filteredReviews = reviews.filter((review) =>
    (review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.title?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center p-4 max-w-7xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold flex-1 text-center">Customer Reviews</h1>
          <div className="w-10" />
        </div>

        <div className="px-4 py-3 max-w-7xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start gap-2 md:border-r md:pr-6">
              <div className="text-5xl font-bold">{(pagination.total || 0).toFixed(0)}</div>
              <p className="text-sm text-gray-500">Total Reviews</p>
            </div>
            <div className="flex gap-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    filterRating === rating
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white border-gray-300 hover:border-green-500'
                  }`}
                >
                  {rating}★
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_rated">Highest Rated</option>
            <option value="lowest_rated">Lowest Rated</option>
          </select>

          {filterRating && (
            <button onClick={() => setFilterRating(null)} className="px-4 py-2 rounded-lg bg-green-600 text-white">
              Clear Filter ({filterRating}★)
            </button>
          )}
        </div>

        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-500">No reviews found</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
                </div>

                {review.title && <h3 className="font-semibold">{review.title}</h3>}
                <p className="text-base leading-relaxed">{review.comment}</p>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {review.images.map((img, idx) => (
                      <img key={idx} src={typeof img === 'string' ? img : img} alt="Review" className="w-20 h-20 rounded-lg object-cover" />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm font-medium">{review.buyer?.name || 'Anonymous'}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 py-6">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-lg bg-white disabled:opacity-50">
              Previous
            </button>
            <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg bg-white disabled:opacity-50">
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductReviews;

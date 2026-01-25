import React, { useState } from 'react';
import { Star, Search, Filter, ChevronDown, Loader2, MessageCircle, Send, X } from 'lucide-react';
import { useGetSellerReviewsQuery, useRespondToReviewMutation } from '@/features/review/reviewApi';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function SellerReviews() {
  usePageTitle('Customer Reviews');
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [toast, setToast] = useState(null);

  const { data: reviewsData, isLoading } = useGetSellerReviewsQuery({
    page,
    per_page: 10,
    rating,
    sort_by: sortBy,
  });

  const [respondToReview, { isLoading: isResponding }] = useRespondToReviewMutation();

  const reviews = reviewsData?.data?.reviews || [];
  const pagination = reviewsData?.data?.pagination || {};

  const filteredReviews = reviews.filter(review =>
    review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ratingStats = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleRespond = async (reviewId) => {
    if (!responseText.trim()) {
      setToast({ type: 'error', message: 'Please write a response message' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    if (responseText.trim().length < 10) {
      setToast({ type: 'error', message: 'Response must be at least 10 characters long' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    try {
      await respondToReview({ reviewId, response: responseText }).unwrap();
      setToast({ type: 'success', message: 'Response sent successfully!' });
      setRespondingTo(null);
      setResponseText('');
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({ type: 'error', message: error.data?.message || 'Failed to send response' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h1>
          <p className="text-gray-600">Manage and respond to customer feedback</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{pagination.total || 0}</p>
              </div>
              <MessageCircle className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900">{avgRating}</p>
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Rating Distribution</p>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingStats[star] || 0;
                const percentage = pagination.total > 0 ? (count / pagination.total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs font-medium w-8">{star}★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-xs text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={rating || ''}
              onChange={(e) => setRating(e.target.value ? parseInt(e.target.value) : null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest_rated">Highest Rated</option>
              <option value="lowest_rated">Lowest Rated</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">Customer reviews will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <img
                    src={review.product?.image || 'https://via.placeholder.com/80'}
                    alt={review.product?.name}
                    className="w-20 h-20 rounded-lg object-cover cursor-pointer border border-gray-200"
                    onClick={() => navigate(`/seller/products/${review.product_id}`)}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 
                          className="font-bold text-gray-900 mb-1 cursor-pointer hover:text-green-600"
                          onClick={() => navigate(`/seller/products/${review.product_id}`)}
                        >
                          {review.product?.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            by {review.buyer?.first_name} {review.buyer?.last_name}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    {review.title && (
                      <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                    )}
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    {review.images?.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {review.images.map((img, idx) => (
                          <img key={idx} src={img} alt="Review" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                        ))}
                      </div>
                    )}
                    
                    {/* Respond Section */}
                    {respondingTo === review.id ? (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start gap-2 mb-2">
                          <textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Write your response..."
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            rows="3"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRespond(review.id)}
                            disabled={isResponding || !responseText.trim()}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {isResponding ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                Send Response
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setRespondingTo(null);
                              setResponseText('');
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRespondingTo(review.id)}
                        className="mt-2 px-4 py-2 border border-green-300 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Respond to Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600">
              Page {page} of {pagination.total_pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))}
              disabled={page === pagination.total_pages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

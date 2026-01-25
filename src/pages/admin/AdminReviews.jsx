import React, { useState } from 'react';
import { Star, Search, Loader2, CheckCircle, XCircle, Trash2, AlertTriangle, TrendingUp } from 'lucide-react';

import { usePageTitle } from '@/hooks/usePageTitle';
import {
  useGetAdminReviewsQuery,
  useGetReviewStatsQuery,
  useModerateReviewMutation,
  useDeleteAdminReviewMutation,
} from '@/features/review/reviewApi';

export default function AdminReviews() {
  usePageTitle('Reviews Management');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState('');
  const [isReported, setIsReported] = useState('');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [moderatingId, setModeratingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: reviewsData, isLoading } = useGetAdminReviewsQuery({
    page,
    limit: 20,
    status: status || undefined,
    rating: rating || undefined,
    is_reported: isReported || undefined,
    search: search || undefined,
  });

  const { data: statsData } = useGetReviewStatsQuery();
  const [moderateReview, { isLoading: isModerating }] = useModerateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteAdminReviewMutation();

  const reviews = reviewsData?.data || [];
  const pagination = {
    page: reviewsData?.page || 1,
    limit: reviewsData?.limit || 20,
    total: reviewsData?.total || 0,
    total_pages: Math.ceil((reviewsData?.total || 0) / (reviewsData?.limit || 20))
  };
  const stats = statsData?.data || {};

  const handleModerate = async (id, action) => {
    try {
      await moderateReview({ id, action, reason: action === 'reject' ? rejectReason : undefined }).unwrap();
      setToast({ type: 'success', message: `Review ${action}d successfully` });
      setModeratingId(null);
      setRejectReason('');
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({ type: 'error', message: error.data?.message || 'Failed to moderate review' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteReview(id).unwrap();
      setToast({ type: 'success', message: 'Review deleted successfully' });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({ type: 'error', message: error.data?.message || 'Failed to delete review' });
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Review Management</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <p className="text-sm text-yellow-700 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">{stats.pending || 0}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-sm text-green-700 mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-900">{stats.approved || 0}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <p className="text-sm text-red-700 mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-900">{stats.rejected || 0}</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <p className="text-sm text-orange-700 mb-1">Reported</p>
            <p className="text-2xl font-bold text-orange-900">{stats.reported || 0}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-blue-700 mb-1">Avg Rating</p>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-bold text-blue-900">{stats.average_rating?.toFixed(1) || 0}</p>
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reviews..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              value={isReported}
              onChange={(e) => setIsReported(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Reviews</option>
              <option value="true">Reported Only</option>
              <option value="false">Not Reported</option>
            </select>
            <button
              onClick={() => { setStatus(''); setRating(''); setIsReported(''); setSearch(''); }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex gap-4">
                  <img
                    src={review.product_image || 'https://via.placeholder.com/80'}
                    alt={review.product_name}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{review.product_name}</h3>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">by {review.buyer_name}</span>
                          {review.seller_name && (
                            <span className="text-sm text-gray-600">• Seller: {review.seller_name}</span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            review.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            review.status === 'approved' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {review.status}
                          </span>
                          {review.is_reported && (
                            <span className="text-xs px-2 py-1 rounded-full font-semibold bg-orange-100 text-orange-700 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Reported ({review.report_count})
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.title && <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>}
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    {review.images?.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {review.images.map((img, idx) => (
                          <img key={idx} src={img} alt="Review" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                        ))}
                      </div>
                    )}
                    
                    {/* Seller Response */}
                    {review.seller_response && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs font-semibold text-blue-700 mb-1">Seller Response:</p>
                        <p className="text-sm text-gray-700">{review.seller_response}</p>
                      </div>
                    )}

                    {/* Moderation Actions */}
                    {review.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        {moderatingId === review.id ? (
                          <div className="flex gap-2 items-start w-full">
                            <input
                              type="text"
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="Reason for rejection..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => handleModerate(review.id, 'reject')}
                              disabled={isModerating || !rejectReason.trim()}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                              Confirm Reject
                            </button>
                            <button
                              onClick={() => { setModeratingId(null); setRejectReason(''); }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleModerate(review.id, 'approve')}
                              disabled={isModerating}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => setModeratingId(review.id)}
                              disabled={isModerating}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(review.id)}
                          disabled={isDeleting}
                          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                    {review.status !== 'pending' && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={isDeleting}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 flex items-center gap-2 mt-4"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
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

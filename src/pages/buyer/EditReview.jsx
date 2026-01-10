import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetMyReviewsQuery, useUpdateReviewMutation } from '@/features/review/reviewApi';
import { Star, ArrowLeft, Upload, X, Loader2 } from 'lucide-react';

const EditReview = () => {
  const navigate = useNavigate();
  const { reviewId } = useParams();
  const { data, isLoading } = useGetMyReviewsQuery({ page: 1, per_page: 100 });
  const [updateReview, { isLoading: submitting }] = useUpdateReviewMutation();

  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ rating: 0, title: '', comment: '', images: [] });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (data?.data?.reviews) {
      const review = data.data.reviews.find(r => r.id === parseInt(reviewId));
      if (review) {
        setFormData({
          rating: review.rating,
          title: review.title || '',
          comment: review.comment,
          images: review.images?.map(img => typeof img === 'string' ? img : img.image_url) || [],
        });
      } else {
        setError('Review not found');
      }
    }
  }, [data, reviewId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (formData.title.trim().length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    if (formData.comment.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    try {
      await updateReview({ id: reviewId, ...formData }).unwrap();
      navigate('/buyer/reviews/my-reviews');
    } catch (err) {
      setError(err.data?.error || 'Failed to update review');
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (formData.images.length + files.length > 5) {
      setError('You can upload maximum 5 images');
      return;
    }

    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, images: [...formData.images, ...imageUrls] });
  };

  const removeImage = (index) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center p-4 max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold flex-1 text-center">Edit Review</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 pb-20">
        {error && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl p-6 space-y-4">
            <label className="block font-semibold">Your Rating *</label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onMouseEnter={() => setHoverRating(rating)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setFormData({ ...formData, rating })}
                  className="focus:outline-none"
                >
                  <Star className={`w-12 h-12 transition-all ${rating <= (hoverRating || formData.rating) ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 space-y-4">
            <label className="block font-semibold">Review Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Summarize your experience"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              maxLength={255}
            />
            <p className="text-sm text-gray-500">Minimum 3 characters</p>
          </div>

          <div className="bg-white rounded-xl p-6 space-y-4">
            <label className="block font-semibold">Your Review *</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Share your experience with this product..."
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              maxLength={2000}
            />
            <p className="text-sm text-gray-500">{formData.comment.length}/2000 characters</p>
          </div>

          <div className="bg-white rounded-xl p-6 space-y-4">
            <label className="block font-semibold">Photos</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {formData.images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img src={image} alt={`Review ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {formData.images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500">
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Upload</span>
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate(-1)} className="flex-1 py-4 bg-gray-100 rounded-lg font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={submitting || formData.rating === 0 || formData.title.length < 3} className="flex-1 py-4 bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <><Loader2 className="w-5 h-5 animate-spin" />Updating...</> : 'Update Review'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditReview;

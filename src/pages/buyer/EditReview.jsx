import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reviewService } from '@/features/review/reviewApi';
import { Star, ArrowLeft, Upload, X, Loader2 } from 'lucide-react';

const EditReview = () => {
  const navigate = useNavigate();
  const { reviewId } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: [],
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    fetchReview();
  }, [reviewId]);

  const fetchReview = async () => {
    try {
      setLoading(true);
      // Fetch from my reviews list
      const response = await reviewService.getMyReviews(1, 100);
      
      if (response.success) {
        const review = response.data.reviews.find(r => r.id === parseInt(reviewId));
        if (review) {
          setFormData({
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            images: review.images.map(img => img.image_url),
          });
        } else {
          setError('Review not found');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load review');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (formData.images.length + files.length > 5) {
      setError('You can upload maximum 5 images');
      return;
    }

    setUploadingImages(true);
    try {
      // TODO: Implement actual image upload to Cloudinary
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      setFormData({
        ...formData,
        images: [...formData.images, ...imageUrls],
      });
    } catch (err) {
      setError('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

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

    setSubmitting(true);
    try {
      const response = await reviewService.updateReview(reviewId, formData);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/buyer/reviews/my-reviews');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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
        <div className="flex items-center p-4 justify-between max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-text-primary-light dark:text-text-primary-dark flex size-10 items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold flex-1 text-center">
            Edit Review
          </h1>
          <div className="size-10" />
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto p-4 pb-20">
        {success && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-500 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg mb-4">
            Review updated successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-500 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 space-y-4">
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold">
              Your Rating *
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onMouseEnter={() => setHoverRating(rating)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRatingClick(rating)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-12 h-12 transition-all ${
                      rating <= (hoverRating || formData.rating)
                        ? 'fill-primary text-primary scale-110'
                        : 'text-text-secondary-light/50 dark:text-text-secondary-dark/50'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 space-y-4">
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold">
              Review Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Summarize your experience"
              className="w-full px-4 py-3 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark border-none focus:ring-2 focus:ring-primary/50"
              maxLength={255}
            />
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {formData.title.length}/255 characters
            </p>
          </div>

          {/* Comment */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 space-y-4">
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold">
              Your Review *
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Share your experience with this product..."
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark border-none focus:ring-2 focus:ring-primary/50 resize-none"
              maxLength={2000}
            />
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {formData.comment.length}/2000 characters
            </p>
          </div>

          {/* Images */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 space-y-4">
            <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold">
              Photos
            </label>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Upload up to 5 photos
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {formData.images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Review ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {formData.images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-text-secondary-light/30 dark:border-text-secondary-dark/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImages}
                  />
                  {uploadingImages ? (
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark mb-1" />
                      <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        Upload
                      </span>
                    </>
                  )}
                </label>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark rounded-lg font-semibold border-2 border-surface-light dark:border-surface-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || formData.rating === 0}
              className="flex-1 py-4 bg-primary text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Review'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditReview;
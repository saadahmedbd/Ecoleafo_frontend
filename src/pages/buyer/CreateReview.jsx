import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCheckReviewEligibilityQuery, useCreateReviewMutation } from '@/features/review/reviewApi';
import { Star, ArrowLeft, X, Loader2, Camera, CheckCircle, AlertCircle } from 'lucide-react';

const CreateReview = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const productIdFromQuery = searchParams.get('product_id');
  const finalProductId = productId || productIdFromQuery;

  const { data: eligibilityData, isLoading: checkingEligibility, error: eligibilityError } = useCheckReviewEligibilityQuery({
    product_id: parseInt(finalProductId),
  }, {
    skip: !finalProductId || isNaN(parseInt(finalProductId))
  });

  console.log('Eligibility Data:', eligibilityData);
  console.log('Eligibility Error:', eligibilityError);

  const [createReview, { isLoading: submitting }] = useCreateReviewMutation();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: [],
  });

  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
    setError(null);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (formData.images.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, images: [...formData.images, ...imageUrls] });
  };

  const removeImage = (index) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
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

    try {
      const reviewPayload = {
        product_id: parseInt(finalProductId),
        order_id: eligibilityData?.data?.order_id,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
      };
      console.log('Submitting review:', reviewPayload);
      const result = await createReview(reviewPayload).unwrap();
      console.log('Review created:', result);
      setSuccess(true);
      setTimeout(() => navigate('/buyer/reviews/my-reviews'), 2000);
    } catch (err) {
      console.error('Review error:', err);
      setError(err.data?.error || err.error || 'Failed to submit review');
    }
  };

  if (checkingEligibility) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Checking eligibility...</p>
        </div>
      </div>
    );
  }

  if (!finalProductId || isNaN(parseInt(finalProductId))) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Product</h2>
          <p className="text-gray-600 mb-6">Unable to identify the product for review</p>
          <button onClick={() => navigate(-1)} className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (eligibilityData && !eligibilityData?.data?.can_review) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cannot Review</h2>
          <p className="text-gray-600 mb-6">{eligibilityData?.data?.message || 'You are not eligible to review this product'}</p>
          <button onClick={() => navigate(-1)} className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Write a Review</h1>
            <p className="text-sm text-gray-500">Share your experience with others</p>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {success && (
        <div className="max-w-3xl mx-auto px-4 pt-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Review submitted successfully!</p>
              <p className="text-sm text-green-700">Redirecting to your reviews...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-3xl mx-auto px-4 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <p className="text-red-900 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Rating Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">How would you rate this product?</h2>
            <p className="text-sm text-gray-500">Tap a star to rate</p>
          </div>
          
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onMouseEnter={() => setHoverRating(rating)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRatingClick(rating)}
                className="focus:outline-none transform transition-all hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-12 h-12 sm:w-14 sm:h-14 transition-all ${
                    rating <= (hoverRating || formData.rating)
                      ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {formData.rating > 0 && (
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full text-sm font-semibold">
                {ratingLabels[formData.rating - 1]}
              </span>
            </div>
          )}
        </div>

        {/* Title Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <label className="block mb-3">
            <span className="text-base font-semibold text-gray-900">Review Title</span>
            <span className="text-sm text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Sum up your experience in a few words"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
            maxLength={255}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">Minimum 3 characters</p>
            <p className="text-xs text-gray-500">{formData.title.length}/255</p>
          </div>
        </div>

        {/* Comment Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <label className="block mb-3">
            <span className="text-base font-semibold text-gray-900">Your Review</span>
            <span className="text-sm text-red-500 ml-1">*</span>
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            placeholder="Tell us what you liked or disliked about this product. How did it meet your expectations?"
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-400"
            maxLength={2000}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">Minimum 10 characters</p>
            <p className="text-xs text-gray-500">{formData.comment.length}/2000</p>
          </div>
        </div>

        {/* Photos Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Add Photos</h3>
            <p className="text-sm text-gray-500">Help others by showing the product (Max 5 photos)</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {formData.images.map((image, index) => (
              <div key={index} className="relative aspect-square group">
                <img
                  src={image}
                  alt={`Review ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {formData.images.length < 5 && (
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all group">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Camera className="w-8 h-8 text-gray-400 group-hover:text-green-600 transition-colors mb-1" />
                <span className="text-xs text-gray-500 group-hover:text-green-600 font-medium">Add Photo</span>
              </label>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-4">
          <button
            type="submit"
            disabled={submitting || formData.rating === 0 || formData.title.length < 3 || formData.comment.length < 10}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Submitting Review...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6" />
                <span>Submit Review</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-500 mt-3">
            By submitting, you agree to our review guidelines
          </p>
        </div>
      </form>
    </div>
  );
};

export default CreateReview;

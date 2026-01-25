import React, { useState } from 'react';
import { Search, Eye, Check, X, Flag } from 'lucide-react';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function ReviewsPage() {
  usePageTitle('Review Details');
  const [activeTab, setActiveTab] = useState('all');

  const reviews = [
    {
      id: 1,
      product: 'Wireless Headphones',
      productImage: '🎧',
      customer: 'John Doe',
      rating: 5,
      title: 'Excellent sound quality!',
      content: 'These headphones exceeded my expectations. The noise cancellation is amazing.',
      date: '2024-01-30',
      status: 'Approved',
      reported: false,
    },
    {
      id: 2,
      product: 'Smart Watch',
      productImage: '⌚',
      customer: 'Jane Smith',
      rating: 4,
      title: 'Good but pricey',
      content: 'Great features but I think it\'s a bit overpriced for what you get.',
      date: '2024-01-29',
      status: 'Pending',
      reported: false,
    },
    {
      id: 3,
      product: 'Yoga Mat',
      productImage: '🧘',
      customer: 'Bob Johnson',
      rating: 1,
      title: 'Terrible quality',
      content: 'This product is absolute garbage. Waste of money.',
      date: '2024-01-28',
      status: 'Pending',
      reported: true,
      reportCount: 3,
    },
    {
      id: 4,
      product: 'Coffee Maker',
      productImage: '☕',
      customer: 'Alice Williams',
      rating: 5,
      title: 'Perfect for morning coffee',
      content: 'Makes the best coffee! Easy to use and clean. Highly recommend.',
      date: '2024-01-27',
      status: 'Approved',
      reported: false,
    },
  ];

  const tabs = [
    { id: 'all', label: 'All', count: reviews.length },
    { id: 'pending', label: 'Pending', count: reviews.filter(r => r.status === 'Pending').length },
    { id: 'approved', label: 'Approved', count: reviews.filter(r => r.status === 'Approved').length },
    { id: 'rejected', label: 'Rejected', count: 0 },
    { id: 'reported', label: 'Reported', count: reviews.filter(r => r.reported).length },
  ];

  const filteredReviews = reviews.filter(review => {
    if (activeTab === 'all') return true;
    if (activeTab === 'reported') return review.reported;
    return review.status.toLowerCase() === activeTab;
  });

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'text-[#F59E0B]' : 'text-[#E5E5E5]'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#1A1A1A] mb-2">Review Moderation</h1>
        <p className="text-[#666666]">Moderate and manage product reviews</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#064232] text-white'
                  : 'text-[#666666] hover:bg-[#FFF5F2]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div 
            key={review.id} 
            className={`bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6 ${
              review.reported ? 'border-2 border-[#EF4444]' : ''
            }`}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 bg-[#FFF5F2] rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                {review.productImage}
              </div>

              {/* Review Content */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[#1A1A1A]">{review.product}</h3>
                      {review.reported && (
                        <span className="flex items-center gap-1 text-[#EF4444] text-sm">
                          <Flag size={14} />
                          Reported ({review.reportCount})
                        </span>
                      )}
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <StatusBadge status={review.status} type="approval" />
                </div>

                <p className="text-[#1A1A1A] mb-2">{review.title}</p>
                <p className="text-[#666666] mb-3">{review.content}</p>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="text-sm text-[#666666]">
                    By {review.customer} on {review.date}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye size={16} />
                      View Details
                    </Button>
                    {review.status === 'Pending' && (
                      <>
                        <Button variant="primary" size="sm">
                          <Check size={16} />
                          Approve
                        </Button>
                        <Button variant="danger" size="sm">
                          <X size={16} />
                          Reject
                        </Button>
                      </>
                    )}
                    {review.reported && (
                      <Button variant="danger" size="sm">
                        <X size={16} />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

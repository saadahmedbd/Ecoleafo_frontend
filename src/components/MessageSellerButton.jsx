import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCreateConversationMutation } from '@/features/Messaging/messagingApi';
import { useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated, selectUserRole } from '@/features/auth/authSlice';

export default function MessageSellerButton({ 
  sellerId, 
  productId = null, 
  productName = null,
  orderId = null,
  orderNumber = null,
  className = '',
  variant = 'default' // 'default', 'icon', 'text'
}) {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectUserRole);
  const [createConversation, { isLoading }] = useCreateConversationMutation();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (userRole !== 'buyer') {
      alert('Only buyers can message sellers');
      return;
    }

    setShowModal(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const payload = {
        recipient_id: sellerId,
        recipient_type: 'seller',
        initial_message: message,
      };

      if (productId) {
        payload.context_type = 'product';
        payload.context_id = productId;
      } else if (orderId) {
        payload.context_type = 'order';
        payload.context_id = orderId;
      }

      const result = await createConversation(payload).unwrap();
      setShowModal(false);
      setMessage('');
      navigate(`/buyer/messages?conversation=${result.id}`);
    } catch (error) {
      console.error('Failed to create conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  // Render different button variants
  const renderButton = () => {
    if (variant === 'icon') {
      return (
        <button
          onClick={handleClick}
          className={`p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${className}`}
          title="Message Seller"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      );
    }

    if (variant === 'text') {
      return (
        <button
          onClick={handleClick}
          className={`text-blue-600 hover:text-blue-700 font-medium ${className}`}
        >
          Message Seller
        </button>
      );
    }

    return (
      <button
        onClick={handleClick}
        className={`flex items-center space-x-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors ${className}`}
      >
        <MessageCircle className="w-5 h-5" />
        <span>Message Seller</span>
      </button>
    );
  };

  return (
    <>
      {renderButton()}

      {/* Message Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Message Seller
            </h3>

            {(productName || orderNumber) && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  About:{' '}
                  <span className="font-semibold text-gray-900">
                    {productName || orderNumber}
                  </span>
                </p>
              </div>
            )}

            <form onSubmit={handleSendMessage}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                rows="4"
                required
              />

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setMessage('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
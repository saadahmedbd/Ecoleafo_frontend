import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Package, CreditCard } from 'lucide-react';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [orderStatus, setOrderStatus] = useState('Processing');

  const order = {
    id: `#${id}`,
    customer: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543',
    },
    seller: {
      name: 'Tech Store Pro',
      logo: '🏪',
    },
    shippingAddress: {
      name: 'Jane Smith',
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'United States',
    },
    items: [
      { id: 1, name: 'Wireless Bluetooth Headphones', image: '🎧', qty: 1, price: 129.99 },
      { id: 2, name: 'Phone Case Premium', image: '📱', qty: 2, price: 29.99 },
      { id: 3, name: 'USB-C Cable 3ft', image: '🔌', qty: 3, price: 12.99 },
    ],
    subtotal: 228.94,
    shipping: 15.00,
    tax: 24.39,
    total: 268.33,
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    orderDate: '2024-01-30 10:30 AM',
    timeline: [
      { status: 'Order Placed', date: '2024-01-30 10:30 AM', completed: true },
      { status: 'Payment Confirmed', date: '2024-01-30 10:35 AM', completed: true },
      { status: 'Processing', date: '2024-01-30 11:00 AM', completed: true },
      { status: 'Shipped', date: '', completed: false },
      { status: 'Delivered', date: '', completed: false },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/orders" className="inline-flex items-center gap-2 text-[#568F87] hover:underline">
        <ArrowLeft size={18} />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[#1A1A1A]">Order {order.id}</h1>
              <StatusBadge status={orderStatus} type="order" />
            </div>
            <p className="text-[#666666]">Placed on {order.orderDate}</p>
          </div>
          <div className="flex gap-2">
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
            >
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
            <Button variant="primary">Update Status</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-[#E5E5E5] last:border-0 last:pb-0">
                  <div className="w-16 h-16 bg-[#FFF5F2] rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    {item.image}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#1A1A1A] mb-1">{item.name}</p>
                    <p className="text-[#666666] text-sm">Qty: {item.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#1A1A1A]">${(item.price * item.qty).toFixed(2)}</p>
                    <p className="text-[#666666] text-sm">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-[#666666]">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#666666]">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#666666]">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#E5E5E5] text-[#1A1A1A]">
                <span>Total</span>
                <span className="text-[#064232]">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Order Timeline</h2>
            <div className="relative">
              {order.timeline.map((event, index) => (
                <div key={index} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      event.completed ? 'bg-[#10B981] text-white' : 'bg-[#E5E5E5] text-[#666666]'
                    }`}>
                      {event.completed ? '✓' : index + 1}
                    </div>
                    {index < order.timeline.length - 1 && (
                      <div className={`w-0.5 h-full mt-2 ${
                        event.completed ? 'bg-[#10B981]' : 'bg-[#E5E5E5]'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className={event.completed ? 'text-[#1A1A1A]' : 'text-[#666666]'}>
                      {event.status}
                    </p>
                    {event.date && (
                      <p className="text-[#666666] text-sm mt-1">{event.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-[#568F87]" />
              <h2 className="text-[#1A1A1A]">Customer</h2>
            </div>
            <div className="space-y-2">
              <p className="text-[#1A1A1A]">{order.customer.name}</p>
              <p className="text-[#666666] text-sm">{order.customer.email}</p>
              <p className="text-[#666666] text-sm">{order.customer.phone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-[#568F87]" />
              <h2 className="text-[#1A1A1A]">Shipping Address</h2>
            </div>
            <div className="space-y-1 text-[#666666]">
              <p className="text-[#1A1A1A]">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Seller Information */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package size={20} className="text-[#568F87]" />
              <h2 className="text-[#1A1A1A]">Seller</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#064232] rounded-lg flex items-center justify-center text-2xl">
                {order.seller.logo}
              </div>
              <p className="text-[#1A1A1A]">{order.seller.name}</p>
            </div>
            <Link to="/sellers/1" className="block mt-3">
              <Button variant="outline" size="sm" className="w-full">
                View Seller Profile
              </Button>
            </Link>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={20} className="text-[#568F87]" />
              <h2 className="text-[#1A1A1A]">Payment</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#666666]">Status</span>
                <StatusBadge status={order.paymentStatus} type="payment" />
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Method</span>
                <span className="text-[#1A1A1A]">{order.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

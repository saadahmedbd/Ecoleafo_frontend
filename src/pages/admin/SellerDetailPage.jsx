import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle } from 'lucide-react';
import StatCard from '../../ui/StatCard';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';
import { DollarSign, Package, ShoppingCart, Star } from 'lucide-react';

export default function SellerDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const seller = {
    id: 1,
    storeName: 'Tech Store Pro',
    logo: '🏪',
    status: 'Pending',
    ownerName: 'John Smith',
    ownerEmail: 'owner@techstore.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
    joinDate: '2024-01-15',
    businessType: 'Electronics & Technology',
    taxId: 'TX-123456789',
    totalSales: '$45,230',
    totalOrders: 234,
    totalProducts: 156,
    rating: 4.8,
    description: 'Leading provider of premium technology products and accessories.',
  };

  const recentOrders = [
    { id: '#12345', customer: 'Alice Brown', amount: '$299', status: 'Delivered', date: '2024-01-30' },
    { id: '#12344', customer: 'Bob Wilson', amount: '$450', status: 'Processing', date: '2024-01-29' },
    { id: '#12343', customer: 'Carol Davis', amount: '$199', status: 'Shipped', date: '2024-01-28' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'payouts', label: 'Payouts' },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/sellers" className="inline-flex items-center gap-2 text-[#568F87] hover:underline">
        <ArrowLeft size={18} />
        Back to Sellers
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-[#064232] rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
              {seller.logo}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-[#1A1A1A]">{seller.storeName}</h1>
                <StatusBadge status={seller.status} type="approval" />
              </div>
              <p className="text-[#666666] mb-2">{seller.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-[#666666]">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  Joined {seller.joinDate}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={16} className="text-[#F59E0B]" />
                  {seller.rating} Rating
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {seller.status === 'Pending' && (
              <>
                <Button variant="primary" onClick={() => setShowApprovalModal(true)}>
                  <CheckCircle size={18} />
                  Approve
                </Button>
                <Button variant="danger">
                  <XCircle size={18} />
                  Reject
                </Button>
              </>
            )}
            {seller.status === 'Approved' && (
              <Button variant="danger">
                <XCircle size={18} />
                Suspend
              </Button>
            )}
          </div>
        </div>
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
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            <StatCard
              title="Total Sales"
              value={seller.totalSales}
              icon={DollarSign}
              accentColor="green"
            />
            <StatCard
              title="Total Orders"
              value={seller.totalOrders.toString()}
              icon={ShoppingCart}
              accentColor="sage"
            />
            <StatCard
              title="Total Products"
              value={seller.totalProducts.toString()}
              icon={Package}
              accentColor="pink"
            />
            <StatCard
              title="Average Rating"
              value={seller.rating.toString()}
              icon={Star}
              accentColor="orange"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Store Information */}
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
              <h2 className="text-[#1A1A1A] mb-4">Store Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-[#666666] text-sm mb-1">Store Name</p>
                  <p className="text-[#1A1A1A]">{seller.storeName}</p>
                </div>
                <div>
                  <p className="text-[#666666] text-sm mb-1">Business Type</p>
                  <p className="text-[#1A1A1A]">{seller.businessType}</p>
                </div>
                <div>
                  <p className="text-[#666666] text-sm mb-1">Tax ID</p>
                  <p className="text-[#1A1A1A]">{seller.taxId}</p>
                </div>
                <div>
                  <p className="text-[#666666] text-sm mb-1">Status</p>
                  <StatusBadge status={seller.status} type="approval" />
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
              <h2 className="text-[#1A1A1A] mb-4">Owner Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-[#666666] text-sm mb-1">Full Name</p>
                  <p className="text-[#1A1A1A]">{seller.ownerName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-[#568F87]" />
                  <p className="text-[#1A1A1A]">{seller.ownerEmail}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-[#568F87]" />
                  <p className="text-[#1A1A1A]">{seller.phone}</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-[#568F87] mt-1" />
                  <p className="text-[#1A1A1A]">{seller.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5E5]">
                    <th className="text-left py-3 text-[#666666]">Order ID</th>
                    <th className="text-left py-3 text-[#666666]">Customer</th>
                    <th className="text-left py-3 text-[#666666]">Amount</th>
                    <th className="text-left py-3 text-[#666666]">Status</th>
                    <th className="text-left py-3 text-[#666666]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={order.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'}>
                      <td className="py-3 text-[#1A1A1A]">{order.id}</td>
                      <td className="py-3 text-[#1A1A1A]">{order.customer}</td>
                      <td className="py-3 text-[#1A1A1A]">{order.amount}</td>
                      <td className="py-3">
                        <StatusBadge status={order.status} type="order" />
                      </td>
                      <td className="py-3 text-[#666666]">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="bg-[#064232] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
                <h3>Approve Seller</h3>
                <button onClick={() => setShowApprovalModal(false)} className="text-white hover:text-[#F5BABB]">
                  ✕
                </button>
              </div>
              <div className="p-6">
                <p className="text-[#666666] mb-4">
                  Are you sure you want to approve <span className="text-[#1A1A1A]">{seller.storeName}</span>?
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-[#10B981]">
                    <CheckCircle size={16} />
                    <span className="text-sm">Store information verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#10B981]">
                    <CheckCircle size={16} />
                    <span className="text-sm">Business documents approved</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#10B981]">
                    <CheckCircle size={16} />
                    <span className="text-sm">Owner identity confirmed</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="primary" className="flex-1">
                    Approve Seller
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowApprovalModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Search, Download, Eye, Check, X } from 'lucide-react';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';

export default function PayoutsPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);

  const payouts = [
    {
      id: 1,
      seller: 'Tech Store Pro',
      amount: '$4,070',
      method: 'Bank Transfer',
      requestDate: '2024-01-28',
      status: 'Pending',
      accountNumber: '****1234',
    },
    {
      id: 2,
      seller: 'Fashion Hub',
      amount: '$3,502',
      method: 'PayPal',
      requestDate: '2024-01-27',
      status: 'Pending',
      accountNumber: 'fashion@hub.com',
    },
    {
      id: 3,
      seller: 'Home Essentials',
      amount: '$2,892',
      method: 'Bank Transfer',
      requestDate: '2024-01-26',
      status: 'Processing',
      accountNumber: '****5678',
    },
    {
      id: 4,
      seller: 'Sports Gear',
      amount: '$2,587',
      method: 'Stripe',
      requestDate: '2024-01-25',
      status: 'Completed',
      accountNumber: 'acct_****9012',
      processedDate: '2024-01-26',
      transactionId: 'TXN123456789',
    },
    {
      id: 5,
      seller: 'Beauty World',
      amount: '$2,304',
      method: 'Bank Transfer',
      requestDate: '2024-01-24',
      status: 'Completed',
      accountNumber: '****3456',
      processedDate: '2024-01-25',
      transactionId: 'TXN987654321',
    },
  ];

  const tabs = [
    { id: 'pending', label: 'Pending', count: payouts.filter(p => p.status === 'Pending').length },
    { id: 'processing', label: 'Processing', count: payouts.filter(p => p.status === 'Processing').length },
    { id: 'completed', label: 'Completed', count: payouts.filter(p => p.status === 'Completed').length },
    { id: 'rejected', label: 'Rejected', count: 0 },
  ];

  const filteredPayouts = payouts.filter(payout => 
    activeTab === 'all' || payout.status.toLowerCase() === activeTab
  );

  const handleProcess = (payout) => {
    setSelectedPayout(payout);
    setShowProcessModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[#1A1A1A] mb-2">Payout Management</h1>
          <p className="text-[#666666]">Process and track seller payouts</p>
        </div>
        <Button variant="secondary">
          <Download size={18} />
          Export
        </Button>
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

      {/* Payouts Table */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#064232] text-white">
              <tr>
                <th className="text-left px-6 py-4">Seller</th>
                <th className="text-left px-6 py-4">Amount</th>
                <th className="text-left px-6 py-4">Method</th>
                <th className="text-left px-6 py-4">Account</th>
                <th className="text-left px-6 py-4">Requested</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayouts.map((payout, index) => (
                <tr 
                  key={payout.id}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'
                  } hover:bg-[#F5BABB]/20 transition-colors`}
                >
                  <td className="px-6 py-4 text-[#1A1A1A]">{payout.seller}</td>
                  <td className="px-6 py-4 text-[#1A1A1A]">{payout.amount}</td>
                  <td className="px-6 py-4 text-[#666666]">{payout.method}</td>
                  <td className="px-6 py-4 text-[#666666]">{payout.accountNumber}</td>
                  <td className="px-6 py-4 text-[#666666]">{payout.requestDate}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={payout.status} type="approval" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-[#568F87] hover:bg-[#568F87]/10 rounded transition-colors">
                        <Eye size={18} />
                      </button>
                      {payout.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleProcess(payout)}
                            className="p-2 text-[#10B981] hover:bg-[#10B981]/10 rounded transition-colors"
                          >
                            <Check size={18} />
                          </button>
                          <button className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors">
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Payout Modal */}
      {showProcessModal && selectedPayout && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="bg-[#064232] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
                <h3>Process Payout</h3>
                <button onClick={() => setShowProcessModal(false)} className="text-white hover:text-[#F5BABB]">
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-[#666666] mb-2">Seller</p>
                  <p className="text-[#1A1A1A]">{selectedPayout.seller}</p>
                </div>
                <div className="mb-4">
                  <p className="text-[#666666] mb-2">Amount</p>
                  <p className="text-[#064232] text-2xl">{selectedPayout.amount}</p>
                </div>
                <div className="mb-4">
                  <p className="text-[#666666] mb-2">Payment Method</p>
                  <p className="text-[#1A1A1A]">{selectedPayout.method}</p>
                </div>
                <div className="mb-4">
                  <p className="text-[#666666] mb-2">Account</p>
                  <p className="text-[#1A1A1A]">{selectedPayout.accountNumber}</p>
                </div>
                <div className="mb-6">
                  <label className="block text-[#666666] mb-2">Transaction ID</label>
                  <input
                    type="text"
                    placeholder="Enter transaction ID"
                    className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="primary" className="flex-1">
                    Confirm Payout
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowProcessModal(false)}>
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

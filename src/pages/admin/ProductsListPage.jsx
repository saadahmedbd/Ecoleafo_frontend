import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, Eye, Check, X } from 'lucide-react';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';

export default function ProductsListPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      image: '🎧',
      category: 'Electronics',
      seller: 'Tech Store Pro',
      price: '$129.99',
      stock: 'In Stock',
      stockCount: 45,
      status: 'Approved',
    },
    {
      id: 2,
      name: 'Smart Watch Series 5',
      image: '⌚',
      category: 'Electronics',
      seller: 'Tech Store Pro',
      price: '$299.99',
      stock: 'Low Stock',
      stockCount: 8,
      status: 'Approved',
    },
    {
      id: 3,
      name: 'Summer Floral Dress',
      image: '👗',
      category: 'Fashion',
      seller: 'Fashion Hub',
      price: '$79.99',
      stock: 'In Stock',
      stockCount: 120,
      status: 'Pending',
    },
    {
      id: 4,
      name: 'Leather Laptop Bag',
      image: '💼',
      category: 'Accessories',
      seller: 'Fashion Hub',
      price: '$89.99',
      stock: 'Out of Stock',
      stockCount: 0,
      status: 'Approved',
    },
    {
      id: 5,
      name: 'Yoga Mat Premium',
      image: '🧘',
      category: 'Sports',
      seller: 'Sports Gear',
      price: '$34.99',
      stock: 'In Stock',
      stockCount: 200,
      status: 'Rejected',
    },
    {
      id: 6,
      name: 'Coffee Maker Deluxe',
      image: '☕',
      category: 'Home',
      seller: 'Home Essentials',
      price: '$149.99',
      stock: 'In Stock',
      stockCount: 35,
      status: 'Pending',
    },
  ];

  const tabs = [
    { id: 'all', label: 'All', count: products.length },
    { id: 'pending', label: 'Pending', count: products.filter(p => p.status === 'Pending').length },
    { id: 'approved', label: 'Approved', count: products.filter(p => p.status === 'Approved').length },
    { id: 'rejected', label: 'Rejected', count: products.filter(p => p.status === 'Rejected').length },
  ];

  const filteredProducts = products.filter(product => {
    const matchesTab = activeTab === 'all' || product.status.toLowerCase() === activeTab;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[#1A1A1A] mb-2">Product Management</h1>
          <p className="text-[#666666]">Review and manage products from all sellers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter size={18} />
            Filters
          </Button>
          <div className="flex gap-1 bg-white rounded-lg p-1 shadow-[0_2px_8px_rgba(6,66,50,0.08)]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#064232] text-white' : 'text-[#666666]'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#064232] text-white' : 'text-[#666666]'}`}
            >
              <List size={18} />
            </button>
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
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
          />
        </div>
      </div>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-[#FFF5F2] flex items-center justify-center text-6xl">
                {product.image}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-[#1A1A1A] line-clamp-2 flex-1">{product.name}</h3>
                  <StatusBadge status={product.status} type="approval" />
                </div>
                <p className="text-sm text-[#666666] mb-1">{product.seller}</p>
                <p className="text-sm text-[#666666] mb-3">{product.category}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#064232]">{product.price}</span>
                  <StatusBadge status={product.stock} type="stock" />
                </div>
                <div className="flex gap-2">
                  <Link to={`/products/${product.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye size={16} />
                      View
                    </Button>
                  </Link>
                  {product.status === 'Pending' && (
                    <>
                      <button className="p-2 text-[#10B981] hover:bg-[#10B981]/10 rounded transition-colors">
                        <Check size={18} />
                      </button>
                      <button className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors">
                        <X size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#064232] text-white">
                <tr>
                  <th className="text-left px-6 py-4">Product</th>
                  <th className="text-left px-6 py-4">Category</th>
                  <th className="text-left px-6 py-4">Seller</th>
                  <th className="text-left px-6 py-4">Price</th>
                  <th className="text-left px-6 py-4">Stock</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr 
                    key={product.id}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'
                    } hover:bg-[#F5BABB]/20 transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#FFF5F2] rounded flex items-center justify-center text-2xl flex-shrink-0">
                          {product.image}
                        </div>
                        <span className="text-[#1A1A1A]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#666666]">{product.category}</td>
                    <td className="px-6 py-4 text-[#666666]">{product.seller}</td>
                    <td className="px-6 py-4 text-[#1A1A1A]">{product.price}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={product.stock} type="stock" />
                      <span className="text-xs text-[#666666] ml-2">({product.stockCount})</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={product.status} type="approval" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/products/${product.id}`}>
                          <button className="p-2 text-[#568F87] hover:bg-[#568F87]/10 rounded transition-colors">
                            <Eye size={18} />
                          </button>
                        </Link>
                        {product.status === 'Pending' && (
                          <>
                            <button className="p-2 text-[#10B981] hover:bg-[#10B981]/10 rounded transition-colors">
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
      )}
    </div>
  );
}

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Store } from 'lucide-react';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';

export default function ProductDetailPage() {
  const { id } = useParams();

  const product = {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    images: ['🎧', '🎧', '🎧', '🎧'],
    category: 'Electronics',
    seller: 'Tech Store Pro',
    price: '$129.99',
    comparePrice: '$159.99',
    stock: 'In Stock',
    stockCount: 45,
    sku: 'WBH-2024-001',
    status: 'Pending',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.',
    specifications: {
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g',
      'Color': 'Matte Black',
      'Warranty': '2 years',
    },
    seo: {
      metaTitle: 'Wireless Bluetooth Headphones - Premium Sound Quality',
      metaDescription: 'Experience superior sound with our wireless headphones featuring active noise cancellation and 30-hour battery life.',
      keywords: 'headphones, wireless, bluetooth, noise cancellation',
    },
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/products" className="inline-flex items-center gap-2 text-[#568F87] hover:underline">
        <ArrowLeft size={18} />
        Back to Products
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[#1A1A1A]">{product.name}</h1>
              <StatusBadge status={product.status} type="approval" />
            </div>
            <div className="flex items-center gap-2 text-[#666666]">
              <Store size={16} />
              <span>Sold by {product.seller}</span>
            </div>
          </div>
          {product.status === 'Pending' && (
            <div className="flex gap-2">
              <Button variant="primary">
                <CheckCircle size={18} />
                Approve
              </Button>
              <Button variant="danger">
                <XCircle size={18} />
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images Gallery */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Product Images</h2>
            <div className="aspect-square bg-[#FFF5F2] rounded-lg flex items-center justify-center text-9xl mb-4">
              {product.images[0]}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className="aspect-square bg-[#FFF5F2] rounded-lg flex items-center justify-center text-4xl cursor-pointer hover:bg-[#F5BABB]/30 transition-colors"
                >
                  {img}
                </div>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Product Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-[#666666] text-sm mb-1">Description</p>
                <p className="text-[#1A1A1A]">{product.description}</p>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-2">Specifications</p>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="bg-[#FFF5F2] p-3 rounded">
                      <p className="text-xs text-[#666666] mb-1">{key}</p>
                      <p className="text-[#1A1A1A]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEO Information */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">SEO Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-[#666666] text-sm mb-1">Meta Title</p>
                <p className="text-[#1A1A1A]">{product.seo.metaTitle}</p>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">Meta Description</p>
                <p className="text-[#1A1A1A]">{product.seo.metaDescription}</p>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">Keywords</p>
                <p className="text-[#1A1A1A]">{product.seo.keywords}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Pricing Details */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Pricing Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-[#666666] text-sm mb-1">Current Price</p>
                <p className="text-[#064232] text-2xl">{product.price}</p>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">Compare at Price</p>
                <p className="text-[#666666] line-through">{product.comparePrice}</p>
              </div>
              <div className="pt-3 border-t border-[#E5E5E5]">
                <p className="text-[#10B981]">You save: $30.00 (19%)</p>
              </div>
            </div>
          </div>

          {/* Inventory Status */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Inventory Status</h2>
            <div className="space-y-3">
              <div>
                <p className="text-[#666666] text-sm mb-1">SKU</p>
                <p className="text-[#1A1A1A]">{product.sku}</p>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">Stock Status</p>
                <StatusBadge status={product.stock} type="stock" />
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">Available Quantity</p>
                <p className="text-[#1A1A1A]">{product.stockCount} units</p>
              </div>
            </div>
          </div>

          {/* Seller Information */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Seller Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#064232] rounded-lg flex items-center justify-center text-2xl">
                  🏪
                </div>
                <div>
                  <p className="text-[#1A1A1A]">{product.seller}</p>
                  <div className="flex items-center gap-1 text-[#F59E0B] text-sm">
                    ★★★★★ <span className="text-[#666666]">(4.8)</span>
                  </div>
                </div>
              </div>
              <Link to="/sellers/1">
                <Button variant="outline" size="sm" className="w-full">
                  View Seller Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Approval Checklist */}
          {product.status === 'Pending' && (
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
              <h2 className="text-[#1A1A1A] mb-4">Approval Checklist</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#064232]" defaultChecked />
                  <span className="text-[#666666]">Images are clear</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#064232]" defaultChecked />
                  <span className="text-[#666666]">Description is complete</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#064232]" defaultChecked />
                  <span className="text-[#666666]">Pricing is appropriate</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#064232]" />
                  <span className="text-[#666666]">Category is correct</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

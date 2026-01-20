import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, MapPin, Phone, Mail, User, DollarSign, CreditCard, Calendar, Hash } from "lucide-react";
import { toast } from "sonner";

export default function SellerOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
        const response = await fetch(`${API_BASE_URL}/seller/dashboard/orders/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        setOrder(data.data);
      } catch (error) {
        toast.error("Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('auth_token');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      await fetch(`${API_BASE_URL}/seller/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success("Order status updated");
      setOrder({ ...order, status: newStatus });
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><Clock className="w-8 h-8 animate-spin text-[#FF9900]" /></div>;
  if (!order) return <div className="text-center p-8">Order not found</div>;

  const statusColors = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    shipped: "bg-purple-50 text-purple-700 border-purple-200",
    delivered: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const paymentStatusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <button onClick={() => navigate("/seller/orders")} className="flex items-center gap-2 text-gray-600 hover:text-[#FF9900] transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Orders</span>
      </button>

      {/* Header Card */}
      <div className="bg-gradient-to-r from-[#FF9900] to-[#FF7700] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order #{order.order_number}</h1>
            <p className="text-white/90 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="flex gap-3">
            <span className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 ${statusColors[order.status]} bg-white`}>
              {order.status.toUpperCase()}
            </span>
            <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${paymentStatusColors[order.payment_status]}`}>
              {order.payment_status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-[#FF9900]" />
              Order Items
            </h3>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.product_name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <Hash className="w-4 h-4" />
                      SKU: {item.product_sku}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity} × ৳{item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#FF9900]">৳{item.total}</p>
                    <p className="text-xs text-gray-500 mt-1">Your earning: ৳{item.seller_earning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Shipping */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#FF9900]" />
                Customer Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#FF9900]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-[#FF9900]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-gray-900">{order.customer_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 break-all">{order.customer_email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{order.customer_phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FF9900]" />
                Shipping Address
              </h3>
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                  <p className="text-gray-700 leading-relaxed">{order.shipping_address}</p>
                </div>
                {order.shipping_phone_number && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Shipping Phone</p>
                      <p className="font-medium text-gray-900">{order.shipping_phone_number}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#FF9900]" />
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">৳{order.total}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Commission (15%)</span>
                <span className="font-semibold text-red-600">-৳{order.commission}</span>
              </div>
              <div className="flex justify-between py-3 bg-gradient-to-r from-green-50 to-emerald-50 -mx-6 px-6 rounded-xl">
                <span className="font-bold text-gray-900">Your Earning</span>
                <span className="font-bold text-green-600 text-xl">৳{order.net_earning}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#FF9900]" />
              Payment Info
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Method</p>
                <p className="font-semibold text-gray-900 capitalize">{order.payment_method.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${paymentStatusColors[order.payment_status]}`}>
                  {order.payment_status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Actions</h3>
            <div className="space-y-3">
              {order.status === 'pending' && (
                <button onClick={() => updateStatus('processing')} className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  Mark as Processing
                </button>
              )}
              {order.status === 'processing' && (
                <button onClick={() => updateStatus('shipped')} className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2">
                  <Truck className="w-5 h-5" />
                  Mark as Shipped
                </button>
              )}
              {order.status === 'shipped' && (
                <button onClick={() => updateStatus('delivered')} className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Mark as Delivered
                </button>
              )}
              {['pending', 'processing'].includes(order.status) && (
                <button onClick={() => updateStatus('cancelled')} className="w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

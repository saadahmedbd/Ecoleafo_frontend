

/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date to short format (no time)
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return `৳${parseFloat(amount || 0).toFixed(2)}`;
};

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
  const colors = {
    delivered: 'bg-green-100 text-green-700',
    shipped: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

/**
 * Get payment status color
 */
export const getPaymentStatusColor = (status) => {
  const colors = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

/**
 * Format payment method
 */
export const formatPaymentMethod = (method) => {
  if (!method) return 'N/A';
  return method.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Calculate status counts from orders array
 */
export const calculateStatusCounts = (orders) => {
  const counts = {
    all: orders.length,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  orders.forEach((order) => {
    if (counts[order.status] !== undefined) {
      counts[order.status]++;
    }
  });

  return counts;
};

/**
 * Get next possible statuses for an order
 */
export const getNextStatuses = (currentStatus) => {
  const statusFlow = {
    pending: ['processing', 'shipped', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
  };
  return statusFlow[currentStatus] || [];
};

/**
 * Check if order can be cancelled
 */
export const canCancelOrder = (status) => {
  return ['pending', 'processing'].includes(status);
};

/**
 * Check if order can be edited
 */
export const canEditOrder = (status) => {
  return ['pending', 'processing', 'shipped'].includes(status);
};

/**
 * Validate tracking number
 */
export const validateTrackingNumber = (trackingNumber) => {
  if (!trackingNumber || trackingNumber.trim().length === 0) {
    return 'Tracking number is required';
  }
  if (trackingNumber.length < 5) {
    return 'Tracking number is too short';
  }
  return null;
};

/**
 * Get status progress percentage
 */
export const getStatusProgress = (status) => {
  const progress = {
    pending: 25,
    processing: 50,
    shipped: 75,
    delivered: 100,
    cancelled: 0,
  };
  return progress[status] || 0;
};

/**
 * Get status index for flow visualization
 */
export const getStatusIndex = (status) => {
  const index = {
    pending: 0,
    processing: 1,
    shipped: 2,
    delivered: 3,
    cancelled: -1,
  };
  return index[status] || 0;
};

/**
 * Filter orders by search query
 */
export const filterOrders = (orders, searchQuery, activeTab) => {
  return orders.filter((order) => {
    const matchesSearch =
      !searchQuery ||
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === 'all' || order.status === activeTab;

    return matchesSearch && matchesTab;
  });
};

/**
 * Sort orders
 */
export const sortOrders = (orders, sortBy = 'date', sortOrder = 'desc') => {
  return [...orders].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(b.created_at) - new Date(a.created_at);
        break;
      case 'total':
        comparison = b.total - a.total;
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'orderNumber':
        comparison = a.order_number.localeCompare(b.order_number);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'desc' ? comparison : -comparison;
  });
};

/**
 * Calculate order item commission (15%)
 */
export const calculateCommission = (itemTotal) => {
  return itemTotal * 0.15;
};

/**
 * Calculate seller earning
 */
export const calculateSellerEarning = (itemTotal, commission) => {
  return itemTotal - (commission || calculateCommission(itemTotal));
};

/**
 * Get order summary statistics
 */
export const getOrderSummary = (orders) => {
  const summary = {
    total: orders.length,
    totalRevenue: 0,
    totalEarnings: 0,
    averageOrderValue: 0,
  };

  orders.forEach((order) => {
    summary.totalRevenue += order.total || 0;
    
    // Calculate seller earnings from order items
    if (order.order_items) {
      order.order_items.forEach((item) => {
        summary.totalEarnings += item.seller_earning || 0;
      });
    }
  });

  summary.averageOrderValue = summary.total > 0 
    ? summary.totalRevenue / summary.total 
    : 0;

  return summary;
};

/**
 * Export orders to CSV format
 */
export const exportOrdersToCSV = (orders) => {
  const headers = [
    'Order Number',
    'Date',
    'Customer Email',
    'Customer Phone',
    'Status',
    'Payment Method',
    'Payment Status',
    'Subtotal',
    'Shipping',
    'Tax',
    'Discount',
    'Total',
    'Tracking Number',
  ];

  const rows = orders.map((order) => [
    order.order_number,
    formatDateShort(order.created_at),
    order.customer_email,
    order.customer_phone || '',
    order.status,
    formatPaymentMethod(order.payment_method),
    order.payment_status,
    order.subtotal,
    order.shipping_cost || 0,
    order.tax_amount || 0,
    order.discount_amount || 0,
    order.total,
    order.tracking_number || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent, filename = 'orders.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Print order receipt
 */
export const printOrderReceipt = (order) => {
  const printWindow = window.open('', '_blank');
  
  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order ${order.order_number}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #374151; }
        .order-details { margin: 20px 0; }
        .order-details p { margin: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f9fafb; }
        .total { font-weight: bold; font-size: 1.2em; }
      </style>
    </head>
    <body>
      <h1>Order Receipt</h1>
      <div class="order-details">
        <p><strong>Order Number:</strong> ${order.order_number}</p>
        <p><strong>Date:</strong> ${formatDate(order.created_at)}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Customer:</strong> ${order.customer_email}</p>
        <p><strong>Shipping Address:</strong> ${order.shipping_address}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.order_items?.map(item => `
            <tr>
              <td>${item.product_name}</td>
              <td>${item.product_sku}</td>
              <td>${item.quantity}</td>
              <td>${formatCurrency(item.price)}</td>
              <td>${formatCurrency(item.total)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="order-details">
        <p><strong>Subtotal:</strong> ${formatCurrency(order.subtotal)}</p>
        <p><strong>Shipping:</strong> ${formatCurrency(order.shipping_cost)}</p>
        <p><strong>Tax:</strong> ${formatCurrency(order.tax_amount)}</p>
        <p><strong>Discount:</strong> -${formatCurrency(order.discount_amount)}</p>
        <p class="total"><strong>Total:</strong> ${formatCurrency(order.total)}</p>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(receiptHTML);
  printWindow.document.close();
  printWindow.print();
};
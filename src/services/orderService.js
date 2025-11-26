class OrderService {
  /**
   * Calculate expected delivery date
   * @param {Date} orderDate - Order creation date
   * @param {number} businessDays - Number of business days for delivery
   * @returns {Date} Expected delivery date
   */
  calculateDeliveryDate(orderDate, businessDays = 7) {
    const date = new Date(orderDate);
    let daysAdded = 0;
    
    while (daysAdded < businessDays) {
      date.setDate(date.getDate() + 1);
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        daysAdded++;
      }
    }
    
    return date;
  }

  /**
   * Format delivery date for display
   * @param {string|Date} dateString - Date string or Date object
   * @returns {string} Formatted date string
   */
  formatDeliveryDate(dateString) {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Format payment method for display
   * @param {string} method - Payment method code
   * @returns {string} Display name
   */
  formatPaymentMethod(method) {
    const methods = {
      'cash_on_delivery': 'Cash on Delivery',
      'online_payment': 'Online Payment',
      'card': 'Credit/Debit Card',
      'bkash': 'bKash',
      'nagad': 'Nagad',
      'rocket': 'Rocket',
    };
    return methods[method] || method;
  }

  /**
   * Get status badge color
   * @param {string} status - Order status
   * @returns {object} Color configuration
   */
  getStatusColor(status) {
    const colors = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      'confirmed': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      'processing': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      'shipped': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
      'delivered': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      'cancelled': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
    };
    return colors[status] || colors.pending;
  }

  /**
   * Get payment status badge color
   * @param {string} status - Payment status
   * @returns {object} Color configuration
   */
  getPaymentStatusColor(status) {
    const colors = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'paid': { bg: 'bg-green-100', text: 'text-green-800' },
      'failed': { bg: 'bg-red-100', text: 'text-red-800' },
      'refunded': { bg: 'bg-gray-100', text: 'text-gray-800' },
    };
    return colors[status] || colors.pending;
  }

  /**
   * Format order number for display
   * @param {string} orderNumber - Order number
   * @returns {string} Formatted order number
   */
  formatOrderNumber(orderNumber) {
    return orderNumber || 'N/A';
  }

  /**
   * Calculate order summary
   * @param {object} order - Order object
   * @returns {object} Summary with formatted values
   */
  getOrderSummary(order) {
    return {
      subtotal: order.subtotal || 0,
      discount: order.discount_amount || 0,
      shippingCost: order.shipping_cost || 0,
      tax: order.tax_amount || 0,
      total: order.total || 0,
      itemCount: order.order_items?.length || 0,
      savings: order.discount_amount || 0,
    };
  }
}

export default new OrderService();
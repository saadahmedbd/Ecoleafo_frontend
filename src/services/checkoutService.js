
class CheckoutService {
  /**
   * Validate checkout data before submission
   */
  validateCheckoutData(data) {
    const errors = [];

    // Validate address
    if (!data.shipping_address || data.shipping_address.trim() === '') {
      errors.push('Shipping address is required');
    }

    // Validate phone
    if (!data.customer_phone || data.customer_phone.trim() === '') {
      errors.push('Phone number is required');
    }

    // Validate email
    if (!data.customer_email || data.customer_email.trim() === '') {
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.customer_email)) {
      errors.push('Invalid email format');
    }

    // Validate payment method
    if (!data.payment_method) {
      errors.push('Payment method is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Email validation
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Format address for order submission
   */
  formatAddress(address) {
    if (!address) return '';
    
    const parts = [
      address.address_line_1,
      address.address_line_2,
      address.street,
      address.city,
      address.district,
      address.state,
      address.postal_code,
      address.country,
    ].filter(Boolean);

    return parts.join(', ');
  }

  /**
   * Calculate shipping cost based on method
   */
  calculateShippingCost(method, subtotal) {
    const shippingRates = {
      standard: 120, // BDT 120 for standard
      express: 200,  // BDT 200 for express
    };

    // Free shipping for orders above 5000 BDT
    if (subtotal >= 5000) {
      return 0;
    }

    return shippingRates[method] || shippingRates.standard;
  }

  /**
   * Format order data for API submission
   */
  formatOrderData(checkoutState, profile, address, cart) {
    const shippingCost = this.calculateShippingCost(
      checkoutState.shippingMethod,
      cart.subtotal
    );

    return {
      payment_method: checkoutState.paymentMethod,
      shipping_address: this.formatAddress(address),
      billing_address: this.formatAddress(address),
      customer_email: profile?.reg_user?.email || profile?.email,
      customer_phone: profile?.phone || address.phone,
      shipping_cost: shippingCost,
      discount_amount: cart.discount || 0,
      notes: checkoutState.orderNotes || '',
    };
  }

  /**
   * Get order summary
   */
  getOrderSummary(cart, shippingMethod) {
    const subtotal = cart.subtotal || 0;
    const discount = cart.discount || 0;
    const shippingCost = this.calculateShippingCost(shippingMethod, subtotal);
    const total = subtotal - discount + shippingCost;

    return {
      subtotal,
      discount,
      shippingCost,
      total,
      savings: discount,
    };
  }
}

export default new CheckoutService();

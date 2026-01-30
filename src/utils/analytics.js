// Google Analytics utility functions

export const pageview = (url) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', 'G-0FHHSR9CSN', {
      page_path: url,
    });
  }
};

export const event = ({ action, category, label, value }) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// E-commerce Events
export const trackProductView = (product) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'view_item', {
      currency: 'USD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
      }]
    });
  }
};

export const trackAddToCart = (product, quantity = 1) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: quantity,
      }]
    });
  }
};

export const trackRemoveFromCart = (product, quantity = 1) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'remove_from_cart', {
      currency: 'USD',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: quantity,
      }]
    });
  }
};

export const trackBeginCheckout = (cartItems, totalValue) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: totalValue,
      items: cartItems.map(item => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity,
      }))
    });
  }
};

export const trackPurchase = (orderId, cartItems, totalValue) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      currency: 'USD',
      value: totalValue,
      items: cartItems.map(item => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity,
      }))
    });
  }
};

export const trackSearch = (searchTerm) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'search', {
      search_term: searchTerm,
    });
  }
};

export const trackAddToWishlist = (product) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'add_to_wishlist', {
      currency: 'USD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
      }]
    });
  }
};

export const trackUserSignup = (method) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'sign_up', {
      method: method, // 'buyer', 'seller'
    });
  }
};

export const trackUserLogin = (method) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'login', {
      method: method, // 'buyer', 'seller', 'admin'
    });
  }
};

// src/services/dashboardService.js

/**
 * Dashboard Service
 * Handles all business logic, calculations, and data transformations for the seller dashboard
 */

class DashboardService {
  /**
   * Format currency values with proper locale
   * @param {number} amount - The amount to format
   * @param {string} currency - Currency code (default: USD)
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount, currency = 'BDT') {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '$0.00';
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Format numbers with abbreviations (K, M, B)
   * @param {number} num - Number to format
   * @returns {string} Abbreviated number string
   */
  formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) {
      return '0';
    }

    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  /**
   * Calculate percentage change between two values
   * @param {number} current - Current value
   * @param {number} previous - Previous value
   * @returns {number} Percentage change
   */
  calculatePercentageChange(current, previous) {
    if (previous === 0 || previous === null || previous === undefined) {
      return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
  }

  /**
   * Format percentage with sign
   * @param {number} value - Percentage value
   * @param {boolean} showSign - Whether to show + or - sign
   * @returns {string} Formatted percentage string
   */
  formatPercentage(value, showSign = true) {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.0%';
    }

    const formatted = Math.abs(value).toFixed(1);
    
    if (showSign) {
      return value >= 0 ? `+${formatted}%` : `-${formatted}%`;
    }
    return `${formatted}%`;
  }

  /**
   * Get trend direction from value
   * @param {number} value - Value to evaluate
   * @returns {string} 'up', 'down', or 'neutral'
   */
  getTrend(value) {
    if (value === null || value === undefined || isNaN(value)) {
      return 'neutral';
    }
    if (value > 0) return 'up';
    if (value < 0) return 'down';
    return 'neutral';
  }

  /**
   * Format time ago (e.g., "2 hours ago")
   * @param {string|Date} date - Date to format
   * @returns {string} Time ago string
   */
  timeAgo(date) {
    if (!date) return 'Never';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const seconds = Math.floor((new Date() - dateObj) / 1000);
    
    if (isNaN(seconds)) return 'Invalid date';
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    
    return 'Just now';
  }

  /**
   * Get status color class for Tailwind
   * @param {string} status - Status string
   * @returns {string} Tailwind class string
   */
  getStatusColor(status) {
    if (!status) return 'bg-gray-100 text-gray-700';

    const colors = {
      delivered: 'bg-green-100 text-green-700',
      completed: 'bg-green-100 text-green-700',
      shipped: 'bg-blue-100 text-blue-700',
      processing: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
      refunded: 'bg-purple-100 text-purple-700',
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    
    return colors[status?.toLowerCase()] || colors.pending;
  }

  /**
   * Get priority color
   * @param {string} priority - Priority level
   * @returns {string} Tailwind color class
   */
  getPriorityColor(priority) {
    const colors = {
      high: 'text-red-600',
      medium: 'text-yellow-600',
      low: 'text-green-600',
    };
    return colors[priority?.toLowerCase()] || colors.low;
  }

  /**
   * Calculate growth rate from data array
   * @param {Array} data - Array of data points with value property
   * @returns {number} Growth rate percentage
   */
  calculateGrowthRate(data) {
    if (!data || data.length < 2) return 0;
    
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    
    if (!latest?.value || !previous?.value) return 0;
    
    return this.calculatePercentageChange(latest.value, previous.value);
  }

  /**
   * Get date range for period
   * @param {string} period - Period type ('today', 'week', 'month', 'year')
   * @returns {Object} Object with start and end dates
   */
  getDateRange(period) {
    const now = new Date();
    const ranges = {
      today: {
        start: new Date(now.setHours(0, 0, 0, 0)),
        end: new Date(now.setHours(23, 59, 59, 999)),
      },
      week: {
        start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      month: {
        start: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
        end: new Date(),
      },
      year: {
        start: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        end: new Date(),
      },
    };
    
    return ranges[period] || ranges.week;
  }

  /**
   * Group data by period for charts
   * @param {Array} data - Array of data items
   * @param {string} period - Period type ('day', 'week', 'month')
   * @returns {Array} Grouped data array
   */
  groupDataByPeriod(data, period = 'day') {
    if (!data || data.length === 0) return [];
    
    const grouped = {};
    
    data.forEach(item => {
      const date = new Date(item.created_at);
      let key;
      
      switch(period) {
        case 'day':
          key = date.toLocaleDateString('en-US', { weekday: 'short' });
          break;
        case 'week':
          key = `Week ${this.getWeekNumber(date)}`;
          break;
        case 'month':
          key = date.toLocaleDateString('en-US', { month: 'short' });
          break;
        default:
          key = date.toLocaleDateString();
      }
      
      if (!grouped[key]) {
        grouped[key] = { name: key, sales: 0, orders: 0, revenue: 0 };
      }
      
      grouped[key].sales += parseFloat(item.total || 0);
      grouped[key].revenue += parseFloat(item.total || 0);
      grouped[key].orders += 1;
    });
    
    return Object.values(grouped);
  }

  /**
   * Get ISO week number from date
   * @param {Date} date - Date object
   * @returns {number} Week number
   */
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  /**
   * Calculate conversion rate
   * @param {number} orders - Number of orders
   * @param {number} views - Number of views
   * @returns {number} Conversion rate percentage
   */
  calculateConversionRate(orders, views) {
    if (!views || views === 0) return 0;
    return (orders / views) * 100;
  }

  /**
   * Get performance indicator based on target
   * @param {number} value - Current value
   * @param {number} target - Target value
   * @returns {Object} Performance indicator object
   */
  getPerformanceIndicator(value, target) {
    if (!target || target === 0) {
      return { status: 'unknown', color: 'text-gray-600', percentage: 0 };
    }
    
    const percentage = (value / target) * 100;
    
    if (percentage >= 100) {
      return { status: 'excellent', color: 'text-green-600', percentage };
    }
    if (percentage >= 80) {
      return { status: 'good', color: 'text-blue-600', percentage };
    }
    if (percentage >= 60) {
      return { status: 'average', color: 'text-yellow-600', percentage };
    }
    return { status: 'poor', color: 'text-red-600', percentage };
  }

  /**
   * Format chart data for Recharts
   * @param {Array} data - Raw data array
   * @param {string} period - Period type
   * @returns {Array} Formatted data array
   */
  formatChartData(data, period = 'day') {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    
    return data.map(item => ({
      name: item.name || item.date || item.period || 'Unknown',
      sales: parseFloat(item.sales || 0),
      orders: parseInt(item.orders || 0),
      revenue: parseFloat(item.revenue || item.sales || 0),
    }));
  }

  /**
   * Calculate Average Order Value
   * @param {number} totalRevenue - Total revenue
   * @param {number} totalOrders - Total number of orders
   * @returns {number} Average order value
   */
  calculateAOV(totalRevenue, totalOrders) {
    if (!totalOrders || totalOrders === 0) return 0;
    return totalRevenue / totalOrders;
  }

  /**
   * Get stats comparison with previous period
   * @param {number} current - Current period value
   * @param {number} previous - Previous period value
   * @returns {Object} Comparison object
   */
  getStatsComparison(current, previous) {
    const change = this.calculatePercentageChange(current, previous);
    
    return {
      value: current,
      change: change,
      trend: this.getTrend(change),
      formatted: this.formatCurrency(current),
      changeFormatted: this.formatPercentage(change),
      isPositive: change >= 0,
    };
  }

  /**
   * Generate mock sales data for development/testing
   * @param {number} days - Number of days to generate
   * @returns {Array} Mock sales data array
   */
  generateMockSalesData(days = 7) {
    const data = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        name: dayNames[date.getDay()],
        date: date.toISOString(),
        sales: Math.floor(Math.random() * 5000) + 2000,
        orders: Math.floor(Math.random() * 50) + 10,
        revenue: Math.floor(Math.random() * 5000) + 2000,
      });
    }
    
    return data;
  }

  /**
   * Validate statistics data structure
   * @param {Object} stats - Statistics object
   * @returns {boolean} Whether stats are valid
   */
  validateStatsData(stats) {
    if (!stats || typeof stats !== 'object') {
      console.warn('Invalid stats data: not an object');
      return false;
    }

    const required = ['total_sales', 'total_orders', 'total_earnings'];
    const missing = required.filter(field => stats[field] === undefined);
    
    if (missing.length > 0) {
      console.warn(`Missing stats fields: ${missing.join(', ')}`);
      return false;
    }
    
    return true;
  }

  /**
   * Calculate fulfillment rate
   * @param {number} fulfilled - Number of fulfilled orders
   * @param {number} total - Total number of orders
   * @returns {number} Fulfillment rate percentage
   */
  calculateFulfillmentRate(fulfilled, total) {
    if (!total || total === 0) return 0;
    return (fulfilled / total) * 100;
  }

  /**
   * Calculate return rate
   * @param {number} returned - Number of returned orders
   * @param {number} total - Total number of orders
   * @returns {number} Return rate percentage
   */
  calculateReturnRate(returned, total) {
    if (!total || total === 0) return 0;
    return (returned / total) * 100;
  }

  /**
   * Get stock status
   * @param {number} quantity - Current quantity
   * @param {number} minQuantity - Minimum quantity threshold
   * @returns {Object} Stock status object
   */
  getStockStatus(quantity, minQuantity = 10) {
    if (quantity === 0) {
      return { status: 'out-of-stock', color: 'text-red-600', label: 'Out of Stock' };
    }
    if (quantity < minQuantity) {
      return { status: 'low-stock', color: 'text-yellow-600', label: 'Low Stock' };
    }
    return { status: 'in-stock', color: 'text-green-600', label: 'In Stock' };
  }

  /**
   * Format date range string
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {string} Formatted date range string
   */
  formatDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  }

  /**
   * Calculate profit margin
   * @param {number} revenue - Total revenue
   * @param {number} cost - Total cost
   * @returns {number} Profit margin percentage
   */
  calculateProfitMargin(revenue, cost) {
    if (!revenue || revenue === 0) return 0;
    return ((revenue - cost) / revenue) * 100;
  }

  /**
   * Get badge color based on rating
   * @param {number} rating - Rating value (0-5)
   * @returns {string} Tailwind color class
   */
  getRatingBadgeColor(rating) {
    if (rating >= 4.5) return 'bg-green-100 text-green-700';
    if (rating >= 4.0) return 'bg-blue-100 text-blue-700';
    if (rating >= 3.0) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  }

  /**
   * Sort data by field
   * @param {Array} data - Data array
   * @param {string} field - Field to sort by
   * @param {string} order - Sort order ('asc' or 'desc')
   * @returns {Array} Sorted data array
   */
  sortData(data, field, order = 'desc') {
    if (!data || data.length === 0) return [];
    
    return [...data].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      
      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }

  /**
   * Filter data by date range
   * @param {Array} data - Data array
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Array} Filtered data array
   */
  filterByDateRange(data, startDate, endDate) {
    if (!data || data.length === 0) return [];
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return data.filter(item => {
      const itemDate = new Date(item.created_at || item.date);
      return itemDate >= start && itemDate <= end;
    });
  }

  /**
   * Calculate totals from array
   * @param {Array} data - Data array
   * @param {string} field - Field to sum
   * @returns {number} Total sum
   */
  calculateTotal(data, field) {
    if (!data || data.length === 0) return 0;
    
    return data.reduce((sum, item) => {
      return sum + parseFloat(item[field] || 0);
    }, 0);
  }

  /**
   * Get top items from array
   * @param {Array} data - Data array
   * @param {string} field - Field to sort by
   * @param {number} limit - Number of items to return
   * @returns {Array} Top items array
   */
  getTopItems(data, field, limit = 5) {
    if (!data || data.length === 0) return [];
    
    return this.sortData(data, field, 'desc').slice(0, limit);
  }

  /**
   * Calculate average from array
   * @param {Array} data - Data array
   * @param {string} field - Field to average
   * @returns {number} Average value
   */
  calculateAverage(data, field) {
    if (!data || data.length === 0) return 0;
    
    const total = this.calculateTotal(data, field);
    return total / data.length;
  }
}

// Export singleton instance
export default new DashboardService();
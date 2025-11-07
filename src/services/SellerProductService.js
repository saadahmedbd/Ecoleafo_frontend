
import { toast } from 'sonner';

class ProductService {
  /**
   * Validate product form data before submission
   */
  validateProductData(data) {
    const errors = {};

    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Product name is required';
    } else if (data.name.length > 255) {
      errors.name = 'Product name must be less than 255 characters';
    }

    if (!data.sku || data.sku.trim().length === 0) {
      errors.sku = 'SKU is required';
    } else if (data.sku.length > 100) {
      errors.sku = 'SKU must be less than 100 characters';
    }

    if (!data.category_id) {
      errors.category_id = 'Category is required';
    }

    if (!data.price || data.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (data.discount_price && data.discount_price >= data.price) {
      errors.discount_price = 'Discount price must be less than regular price';
    }

    if (data.quantity && data.quantity < 0) {
      errors.quantity = 'Quantity cannot be negative';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Format product data for API submission
   */
  formatProductData(formData) {
    const productData = {
      name: formData.name.trim(),
      description: formData.description?.trim() || '',
      sku: formData.sku.trim(),
      category_id: parseInt(formData.category_id),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity) || 0,
    };

    // Optional fields
    if (formData.discount_price) {
      productData.discount_price = parseFloat(formData.discount_price);
    }
    if (formData.discount_percent) {
      productData.discount_percent = parseFloat(formData.discount_percent);
    }
    if (formData.height) productData.height = formData.height.trim();
    if (formData.age) productData.age = formData.age.trim();
    if (formData.tree_type) productData.tree_type = formData.tree_type.trim();
    if (formData.pot_size) productData.pot_size = formData.pot_size.trim();
    if (formData.scientific_name) productData.scientific_name = formData.scientific_name.trim();
    if (formData.common_names) productData.common_names = formData.common_names.trim();
    if (formData.min_quantity) productData.min_quantity = parseInt(formData.min_quantity);
    if (formData.weight) productData.weight = parseFloat(formData.weight);
    if (formData.meta_title) productData.meta_title = formData.meta_title.trim();
    if (formData.meta_description) productData.meta_description = formData.meta_description.trim();

    // Attributes array
    if (formData.attributes && formData.attributes.length > 0) {
      productData.attributes = formData.attributes;
    }

    return productData;
  }

  /**
   * Format update data (only changed fields)
   */
  formatUpdateData(formData, originalData) {
    const updateData = {};

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalData[key] && formData[key] !== null && formData[key] !== '') {
        updateData[key] = formData[key];
      }
    });

    return updateData;
  }

  /**
   * Handle image upload with validation
   */
  validateImageFile(file) {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Only JPG, PNG, and WebP are allowed.');
      return false;
    }

    if (file.size > MAX_SIZE) {
      toast.error('File size must be less than 10MB.');
      return false;
    }

    return true;
  }

  /**
   * Create FormData for image upload
   */
  createImageFormData(file, metadata = {}) {
    const formData = new FormData();
    formData.append('image', file);
    
    if (metadata.alt_text) formData.append('alt_text', metadata.alt_text);
    if (metadata.is_primary !== undefined) formData.append('is_primary', metadata.is_primary);
    if (metadata.sort_order !== undefined) formData.append('sort_order', metadata.sort_order);

    return formData;
  }

  /**
   * Create FormData for multiple images
   */
  createMultipleImagesFormData(files) {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('images', file);
      formData.append(`sort_order_${index}`, index);
    });
    return formData;
  }

  /**
   * Calculate discount percentage
   */
  calculateDiscountPercent(price, discountPrice) {
    if (!price || !discountPrice || discountPrice >= price) return 0;
    return ((price - discountPrice) / price) * 100;
  }

  /**
   * Calculate discount price from percentage
   */
  calculateDiscountPrice(price, discountPercent) {
    if (!price || !discountPercent || discountPercent <= 0 || discountPercent >= 100) return 0;
    return price - (price * discountPercent) / 100;
  }

  /**
   * Format product status badge
   */
  getStatusBadge(product) {
    if (!product.is_active) {
      return { label: 'Inactive', color: 'gray' };
    }
    if (!product.is_approved) {
      return { label: 'Pending Approval', color: 'yellow' };
    }
    if (product.quantity === 0) {
      return { label: 'Out of Stock', color: 'red' };
    }
    if (product.quantity < product.min_quantity) {
      return { label: 'Low Stock', color: 'orange' };
    }
    return { label: 'Active', color: 'green' };
  }

  /**
   * Handle API errors
   */
  handleError(error) {
    if (error.data?.message) {
      toast.error(error.data.message);
    } else if (error.message) {
      toast.error(error.message);
    } else {
      toast.error('An unexpected error occurred');
    }
  }

  /**
   * Generate unique SKU suggestion
   */
  generateSKU(category, name) {
    const categoryPrefix = category.substring(0, 3).toUpperCase();
    const namePrefix = name.split(' ')[0].substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${categoryPrefix}-${namePrefix}-${random}`;
  }
}

export default new ProductService();
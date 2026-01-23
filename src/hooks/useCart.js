import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useIncrementQuantityMutation,
  useDecrementQuantityMutation,
  useMoveCartItemToWishlistMutation,
  useGetCartQuery,
  useGetCartCountQuery,
} from '@/features/cart/cartApi';

export const useCart = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [addToCartMutation] = useAddToCartMutation();
  const [removeFromCartMutation] = useRemoveFromCartMutation();
  const [updateCartItemMutation] = useUpdateCartItemMutation();
  const [incrementQuantityMutation] = useIncrementQuantityMutation();
  const [decrementQuantityMutation] = useDecrementQuantityMutation();
  const [moveCartItemToWishlistMutation] = useMoveCartItemToWishlistMutation();

  const { data: cartData, isLoading: cartLoading, error: cartError, refetch } = useGetCartQuery();
  const { data: cartCountData } = useGetCartCountQuery();

  const cartCount = cartCountData?.count || 0;
  const cart = cartData?.data || null;
  const cartItems = cart?.items || [];

  const addToCart = async (product, quantity = 1) => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/buyer/login');
      return {
        success: false,
        error: 'Please login to add items to cart',
        unauthorized: true
      };
    }

    setIsLoading(true);
    try {
      // Check if product already in cart
      const existingItem = cartItems.find(item => 
        (item.product?.id || item.product_id) === product.id
      );

      if (existingItem) {
        return {
          success: false,
          error: 'Product is already in cart',
          alreadyInCart: true
        };
      }

      const result = await addToCartMutation({
        product_id: product.id,
        quantity: quantity,
        is_gift: false,
        gift_message: ''
      }).unwrap();

      await refetch();
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Add to cart error:', error);
      if (error?.status === 401) {
        navigate('/buyer/login');
        return {
          success: false,
          error: 'Please login to add items to cart',
          unauthorized: true
        };
      }
      return {
        success: false,
        error: error?.data?.message || error?.message || 'Failed to add to cart'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setIsLoading(true);
    try {
      await removeFromCartMutation(productId).unwrap();
      await refetch();
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Remove from cart error:', error);
      return {
        success: false,
        error: error?.data?.message || error?.message || 'Failed to remove from cart'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setIsLoading(true);
    try {
      await updateCartItemMutation({
        productId,
        quantity
      }).unwrap();

      await refetch();

      return {
        success: true
      };
    } catch (error) {
      console.error('Update quantity error:', error);
      return {
        success: false,
        error: error?.data?.message || error?.message || 'Failed to update quantity'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const incrementQuantity = async (productId) => {
    setIsLoading(true);
    try {
      await incrementQuantityMutation(productId).unwrap();
      await refetch();

      return {
        success: true
      };
    } catch (error) {
      console.error('Increment quantity error:', error);
      return {
        success: false,
        error: error?.data?.message || error?.message || 'Failed to increment quantity'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const decrementQuantity = async (productId) => {
    setIsLoading(true);
    try {
      await decrementQuantityMutation(productId).unwrap();
      await refetch();

      return {
        success: true
      };
    } catch (error) {
      console.error('Decrement quantity error:', error);
      return {
        success: false,
        error: error?.data?.message || error?.message || 'Failed to decrement quantity'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const moveToWishlist = async (productId) => {
    setIsLoading(true);
    try {
      const result = await moveCartItemToWishlistMutation(productId).unwrap();
      await refetch();

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Move to wishlist error:', error);
      return {
        success: false,
        error: error?.data?.message || error?.message || 'Failed to move to wishlist'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (productId, data) => {
    setIsLoading(true);
    try {
      await updateCartItemMutation({ productId, ...data }).unwrap();
      await refetch();

      return {
        success: true
      };
    } catch (error) {
      console.error('Update cart item error:', error);
      return {
        success: false,
        error: error?.data?.message || error?.message || 'Failed to update cart item'
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    moveToWishlist,
    updateCartItem,
    cartCount,
    cartItems,
    cart,
    isLoading,
    cartLoading,
    cartError,
    refetch
  };
};
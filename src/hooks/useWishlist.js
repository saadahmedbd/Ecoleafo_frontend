// src/hooks/useWishlist.js - FIXED WITH PROPER API INTEGRATION
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
  useGetWishlistCountQuery,
  useMoveWishlistItemToCartMutation,
} from '@/features/wishlist/wishlistApi';

export const useWishlist = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();
  const [moveToCartMutation] = useMoveWishlistItemToCartMutation();

  const { data: wishlistData, isLoading: wishlistQueryLoading, error: wishlistError, refetch: refetchWishlist } = useGetWishlistQuery();
  const { data: wishlistCountData, isLoading: countQueryLoading, refetch: refetchCount } = useGetWishlistCountQuery();

  const wishlist = wishlistData?.items || [];
  const wishlistCount = wishlistData?.total_items || wishlistCountData?.count || 0;

  // Debug logging - check if user is authenticated
  const token = localStorage.getItem('auth_token');
 

  // If no token, return empty wishlist
  if (!token) {
    return {
      addToWishlist: async () => {
        navigate('/buyer/login');
        return { success: false, error: 'Please login to add items to wishlist', unauthorized: true };
      },
      removeFromWishlist: async () => {
        navigate('/buyer/login');
        return { success: false, error: 'Please login to remove items from wishlist', unauthorized: true };
      },
      toggleWishlist: async () => {
        navigate('/buyer/login');
        return { success: false, error: 'Please login to toggle wishlist items', unauthorized: true };
      },
      moveToCart: async () => {
        navigate('/buyer/login');
        return { success: false, error: 'Please login to move items to cart', unauthorized: true };
      },
      isInWishlist: () => false,
      wishlistCount: 0,
      wishlist: [],
      isLoading: false,
      wishlistLoading: false,
      wishlistError: null,
      refetchWishlist: () => {},
      refetchCount: () => {}
    };
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item =>
      (item.product?.id || item.product_id) === productId
    );
  };

  const addToWishlist = async (productId) => {
    setIsLoading(true);
    try {
      await addToWishlistMutation({
        product_id: productId
      }).unwrap();

      // Refetch both wishlist and count
      await Promise.all([refetchWishlist(), refetchCount()]);

      return {
        success: true
      };
    } catch (error) {
    

      // Handle case where product is already in wishlist (backend returns plain text)
      if (error?.data?.includes && error.data.includes('product already in wishlist')) {
        // Refetch to ensure UI is in sync
        await Promise.all([refetchWishlist(), refetchCount()]);
        return {
          success: true,
          alreadyInWishlist: true
        };
      }

      return {
        success: false,
        error: error?.data?.message || error?.message || 'Failed to add to wishlist'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    setIsLoading(true);
    try {
      await removeFromWishlistMutation(productId).unwrap();
      
      // Refetch both wishlist and count
      await Promise.all([refetchWishlist(), refetchCount()]);
      
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error?.data?.message || error?.message || 'Failed to remove from wishlist'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  const moveToCart = async (productId) => {
    setIsLoading(true);
    try {
      await moveToCartMutation(productId).unwrap();

      // Refetch both wishlist and count
      await Promise.all([refetchWishlist(), refetchCount()]);

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error?.data?.message || error?.message || 'Failed to move to cart'
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    moveToCart,
    isInWishlist,
    wishlistCount,
    wishlist,
    isLoading,
    wishlistLoading: wishlistQueryLoading,
    wishlistError,
    refetchWishlist,
    refetchCount
  };
};
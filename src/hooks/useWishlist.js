import { 
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useMoveWishlistItemToCartMutation,
  useGetWishlistQuery,
} from '@/features/wishlist/wishlistApi';

export function useWishlist() {
  const token = localStorage.getItem('auth_token');
  const isAuthenticated = !!token;

  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();
  const [moveToCartMutation] = useMoveWishlistItemToCartMutation();
  
  const { data: wishlistData, isLoading } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const wishlistItems = Array.isArray(wishlistData) ? wishlistData : [];

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login to add items to wishlist' };
    }
    try {
      const result = await addToWishlistMutation({ product_id: productId }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to add to wishlist' 
      };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login to manage wishlist' };
    }
    try {
      const result = await removeFromWishlistMutation(productId).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to remove from wishlist' 
      };
    }
  };

  const moveToCart = async (productId) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login to move items to cart' };
    }
    try {
      const result = await moveToCartMutation(productId).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to move to cart' 
      };
    }
  };

  const isInWishlist = (productId) => {
    if (!Array.isArray(wishlistItems)) return false;
    return wishlistItems.some(item => 
      item.product_id === productId || item.id === productId
    );
  };

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  return {
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    toggleWishlist,
    isInWishlist,
    wishlistCount: wishlistItems.length,
    wishlistItems,
    isLoading,
  };
}
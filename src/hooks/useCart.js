import { 
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useIncrementQuantityMutation,
  useDecrementQuantityMutation,
  useClearCartMutation,
  useGetCartCountQuery,
  useMoveCartItemToWishlistMutation,
} from '@/features/cart/cartApi';

export function useCart() {
  const [addToCartMutation] = useAddToCartMutation();
  const [removeFromCartMutation] = useRemoveFromCartMutation();
  const [updateCartMutation] = useUpdateCartItemMutation();
  const [incrementMutation] = useIncrementQuantityMutation();
  const [decrementMutation] = useDecrementQuantityMutation();
  const [clearCartMutation] = useClearCartMutation();
  const [moveToWishlistMutation] = useMoveCartItemToWishlistMutation();
  
  const { data: cartCountData } = useGetCartCountQuery();

  const addToCart = async (productId, quantity = 1, options = {}) => {
    try {
      const result = await addToCartMutation({
        product_id: productId,
        quantity,
        is_gift: options.is_gift || false,
        gift_message: options.gift_message || null,
      }).unwrap();
      
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to add to cart' 
      };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const result = await removeFromCartMutation(productId).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to remove from cart' 
      };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const result = await updateCartMutation({ 
        productId, 
        quantity,
        gift: false,
        gift_message: ""
      }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update quantity' 
      };
    }
  };

  const incrementQuantity = async (productId) => {
    try {
      const result = await incrementMutation(productId).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to increment quantity' 
      };
    }
  };

  const decrementQuantity = async (productId) => {
    try {
      const result = await decrementMutation(productId).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to decrement quantity' 
      };
    }
  };

  const clearCart = async () => {
    try {
      const result = await clearCartMutation().unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to clear cart' 
      };
    }
  };

  const moveToWishlist = async (productId) => {
    try {
      const result = await moveToWishlistMutation(productId).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to move to wishlist' 
      };
    }
  };

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    moveToWishlist,
    cartCount: cartCountData?.count || 0,
  };
}
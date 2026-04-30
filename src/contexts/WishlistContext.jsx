import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserAuth } from './UserAuthContext';
import { useStoreData } from './StoreDataContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useUserAuth();
  const { products } = useStoreData();

  // Load wishlist IDs from localStorage and hydrate
  useEffect(() => {
    const savedIdsStr = localStorage.getItem('wishlist_ids');
    if (savedIdsStr && products && products.length > 0) {
      try {
        const savedIds = JSON.parse(savedIdsStr);
        if (Array.isArray(savedIds)) {
          const hydratedItems = products.filter(p => savedIds.includes(p.id));
          setWishlistItems(hydratedItems);
        }
      } catch (error) {
        console.error('Error hydrating wishlist:', error);
      }
      setIsLoaded(true);
    } else if (products && products.length > 0) {
      setIsLoaded(true);
    }
  }, [products]);

  // Save ONLY IDs to localStorage when wishlist changes
  useEffect(() => {
    if (!isLoaded) return; 

    try {
      const idsToSave = wishlistItems.map(item => item.id);
      if (idsToSave.length > 0) {
        localStorage.setItem('wishlist_ids', JSON.stringify(idsToSave));
        // Also clear the old bulky 'wishlist' key if it exists
        localStorage.removeItem('wishlist');
      } else {
        localStorage.removeItem('wishlist_ids');
      }
    } catch (error) {
      console.error('Failed to save wishlist IDs (Quota likely exceeded):', error);
      // Fallback: Clear local storage if it's really stuck
      if (error.name === 'QuotaExceededError') {
        localStorage.clear(); 
      }
    }
  }, [wishlistItems, isLoaded]);

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const wishlistCount = wishlistItems.length;

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);
  const toggleWishlistDrawer = () => setIsWishlistOpen(!isWishlistOpen);

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      toggleWishlist,
      removeFromWishlist,
      isInWishlist,
      wishlistCount,
      isWishlistOpen,
      openWishlist,
      closeWishlist,
      toggleWishlistDrawer
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

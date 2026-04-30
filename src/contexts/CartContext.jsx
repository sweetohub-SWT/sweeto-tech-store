import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserAuth } from './UserAuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useUserAuth();

  // Load cart from localStorage
  useEffect(() => {
    setIsLoaded(false);
    let localCart = [];
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          localCart = parsed;
        }
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
    setCartItems(localCart);
    setIsLoaded(true);
  }, [user]);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (!isLoaded) return; 

    try {
      if (cartItems.length > 0 || localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      }
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('LocalStorage quota exceeded! Trimming cart data...');
        // If quota exceeded, we try to save only the essentials
        const minimalCart = cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image?.length > 1000 ? 'large_image' : item.image, // Avoid storing large base64
          quantity: item.quantity
        }));
        try {
          localStorage.setItem('cart', JSON.stringify(minimalCart));
        } catch (innerError) {
          console.error('Failed even with minimal cart:', innerError);
        }
      }
    }
  }, [cartItems, isLoaded]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const addToCart = (product, quantity = 1, color = null) => {
    // Only store essential data in the cart to save space
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      selectedColor: color
    };

    setCartItems(prev => {
      const existingItem = prev.find(item => 
        item.id === product.id && 
        (color ? item.selectedColor?.code === color.code : !item.selectedColor)
      );
      
      if (existingItem) {
        return prev.map(item =>
          (item.id === product.id && (color ? item.selectedColor?.code === color.code : !item.selectedColor))
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, cartProduct];
    });
  };

  const updateQuantity = (productId, quantity, colorCode = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, colorCode);
      return;
    }
    setCartItems(prev => prev.map(item =>
      (item.id === productId && (colorCode ? item.selectedColor?.code === colorCode : !item.selectedColor)) 
        ? { ...item, quantity } 
        : item
    ));
  };

  const removeFromCart = (productId, colorCode = null) => {
    setCartItems(prev => prev.filter(item => 
      !(item.id === productId && (colorCode ? item.selectedColor?.code === colorCode : !item.selectedColor))
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isCartOpen,
    toggleCart,
    openCart,
    closeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

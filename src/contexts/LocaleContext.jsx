import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStoreData } from './StoreDataContext';

const LocaleContext = createContext();

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

export const LocaleProvider = ({ children }) => {
  const { storeSettings } = useStoreData();
  const [language, setLanguage] = useState(storeSettings.defaultLanguage || 'en');
  const [currency, setCurrency] = useState(storeSettings.defaultCurrency || 'USD');

  // Sync language with store settings when they change
  useEffect(() => {
    if (storeSettings.defaultLanguage) {
      setLanguage(storeSettings.defaultLanguage);
    }
  }, [storeSettings.defaultLanguage]);

  // Sync currency with store settings when they change
  useEffect(() => {
    if (storeSettings.defaultCurrency) {
      setCurrency(storeSettings.defaultCurrency);
    }
  }, [storeSettings.defaultCurrency]);

  const translations = {
    en: {
      welcome: 'Welcome to Sweeto-Tech',
      searchPlaceholder: 'Search products...',
      cart: 'Cart',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      learnMore: 'Learn More',
      noProducts: 'No products available',
      searchResults: 'Search Results',
      trendingProducts: 'Our Trending Products',
      featuredProducts: 'Featured Products',
      categories: 'Our Top Categories',
      newProducts: 'New Products',
      bestSelling: 'Best Selling',
      checkoutNotAvailable: 'Checkout is not available'
    },
    es: {
      welcome: 'Bienvenido a Sweeto-Tech',
      searchPlaceholder: 'Buscar productos...',
      cart: 'Carrito',
      addToCart: 'Añadir al Carrito',
      buyNow: 'Comprar Ahora',
      learnMore: 'Más Información',
      noProducts: 'No hay productos disponibles',
      searchResults: 'Resultados de Búsqueda',
      trendingProducts: 'Nuestros Productos Trending',
      featuredProducts: 'Productos Destacados',
      categories: 'Nuestras Categorías Principales',
      newProducts: 'Nuevos Productos',
      bestSelling: 'Más Vendidos',
      checkoutNotAvailable: 'El checkout no está disponible'
    },
    fr: {
      welcome: 'Bienvenue chez Sweeto-Tech',
      searchPlaceholder: 'Rechercher des produits...',
      cart: 'Panier',
      addToCart: 'Ajouter au Panier',
      buyNow: 'Acheter Maintenant',
      learnMore: 'En Savoir Plus',
      noProducts: 'Aucun produit disponible',
      searchResults: 'Résultats de Recherche',
      trendingProducts: 'Nos Produits Tendances',
      featuredProducts: 'Produits Vedettes',
      categories: 'Nos Catégories Principales',
      newProducts: 'Nouveaux Produits',
      bestSelling: 'Meilleures Ventes',
      checkoutNotAvailable: 'Le checkout n\'est pas disponible'
    }
  };

  const currencyRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    XOF: 605
  };

  const currencySymbols = {
    USD: '$',
    EUR: '',
    GBP: '£',
    XOF: 'FCFA'
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const convertPrice = (price) => {
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) return "0.00";
    const rate = currencyRates[currency] || 1;
    const convertedPrice = numericPrice * rate;
    return convertedPrice.toFixed(2);
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
      const symbol = currencySymbols[currency] || '$';
      return currency === 'XOF' ? `0 ${symbol}` : `${symbol}0`;
    }

    const convertedPriceStr = convertPrice(numericPrice);
    const convertedPrice = parseFloat(convertedPriceStr);
    const symbol = currencySymbols[currency];
    
    // Special formatting for XOF (no decimal places)
    if (currency === 'XOF') {
      return `${Math.round(convertedPrice)} ${symbol}`;
    }
    
    return `${symbol}${convertedPriceStr}`;
  };

  const value = {
    language,
    currency,
    setLanguage,
    setCurrency,
    t,
    convertPrice,
    formatPrice,
    currencyRates,
    currencySymbols
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

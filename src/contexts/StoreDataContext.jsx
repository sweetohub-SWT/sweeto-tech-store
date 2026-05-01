import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const StoreDataContext = createContext();

export const useStoreData = () => {
  const context = useContext(StoreDataContext);
  if (!context) throw new Error('useStoreData must be used within a StoreDataProvider');
  return context;
};

const DEFAULT_SETTINGS = {
  shopName: 'SWEETO HUBS',
  shopLogo: '/logo.png',
  defaultLanguage: 'en',
  adminLanguage: 'en',
  defaultCurrency: 'XOF',
  contactEmail: 'admin@sweetohubs.com',
  storeTagline: 'YOUR HUB FOR PREMIUM ELECTRONICS',
  geminiApiKey: '',
  geminiModel: 'gemini-1.5-flash',
  whatsappNumber: '',
  shopPhone: '+1-800-SWEETO',
  shopAddress: '123 Tech Avenue, Silicon Valley',
  facebookUrl: '#',
  instagramUrl: '#',
  twitterUrl: '#',
  tiktokUrl: '#',
  heroLayout: 'slider', // 'slider' or 'grid'
  heroBanners: [
    { id: 'main', productId: '', image: '', title: '', subtitle: '', link: '' },
    { id: 'side1', productId: '', image: '', title: '', subtitle: '', link: '' },
    { id: 'side2', productId: '', image: '', title: '', subtitle: '', link: '' }
  ],
  homepageSections: [
    { id: 'hero', name: 'Hero Banner', enabled: true },
    { id: 'shop_by_category', name: 'Shop By Category', enabled: true },
    { id: 'deal_of_the_day', name: 'Deal Of The Day', enabled: true },
    { id: 'just_arrived', name: 'Just Arrived', enabled: true },
    { id: 'featured_products', name: 'Featured Products', enabled: true },
    { id: 'smartphones', name: 'Smartphones & Tablets', enabled: true },
    { id: 'home_cinema', name: 'Home Cinema', enabled: true },
    { id: 'speakers', name: 'Speakers', enabled: true },
    { id: 'refrigerators', name: 'Refrigerators', enabled: true },
    { id: 'trending', name: 'Trending Products', enabled: true }
  ]
};

export const StoreDataProvider = ({ children }) => {
  const [storeSettings, setStoreSettings] = useState(() => apiService.getStoreSettingsSync() || DEFAULT_SETTINGS);
  const [categories, setCategories] = useState(() => apiService.getCategoriesSync());
  const [products, setProducts] = useState(() => apiService.getProductsSync());

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (!e.key) return;
      
      // Check for our DB prefix
      if (e.key.startsWith('sweeto_tech_db_')) {
        const key = e.key.replace('sweeto_tech_db_', '');
        if (key === 'storeSettings') setStoreSettings(apiService.getStoreSettingsSync());
        if (key === 'categories') setCategories(apiService.getCategoriesSync());
        if (key === 'products') setProducts(apiService.getProductsSync());
        
        // Sync other important resources
        if (key === 'video_ads') {
          apiService.getVideoAds().then(setVideoAds);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [stockAdjustments, setStockAdjustments] = useState([]);
  const [salesRecords, setSalesRecords] = useState([]);
  const [visits, setVisits] = useState([]);
  const [videoAds, setVideoAds] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchLogs, setSearchLogs] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = async () => {
    try {
      const [
        p, c, s, sa, v, va, r, sl, ul, u, settings
      ] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
        apiService.getSalesRecords(),
        apiService.getStockAdjustments(),
        apiService.getVisits(),
        apiService.getVideoAds(),
        apiService.getReviews(),
        apiService.getNotifications(),
        apiService.getSearchLogs(),
        apiService.getUserLogs(),
        apiService.getAll('users'),
        apiService.getStoreSettings()
      ]);

      if (p) {
        console.log('Fetched products:', p);
        setProducts(p);
      }
      if (c) {
        console.log('Fetched categories:', c);
        setCategories(c);
      }
      if (s) setSalesRecords(s);
      if (sa) setStockAdjustments(sa);
      if (v) setVisits(v);
      if (va) setVideoAds(va);
      if (r) setReviews(r);
      if (sl) setSearchLogs(sl);
      if (ul) setUserLogs(ul);
      if (u) setUsers(u);
      if (settings) {
        const merged = { ...DEFAULT_SETTINGS, ...settings };
        // Force the new logo if the existing one is empty
        if (!merged.shopLogo || merged.shopLogo === '') {
          merged.shopLogo = '/logo.png';
        }
        setStoreSettings(merged);
      } else {
        await apiService.create('storeSettings', { id: 'main', ...DEFAULT_SETTINGS });
      }
      setLoading(false);
    } catch (err) {
      console.error('Initial fetch failed', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Force update logo if it's missing (Migration for existing users)
  useEffect(() => {
    if (!loading && (!storeSettings.shopLogo || storeSettings.shopLogo === '')) {
      updateStoreSettings({ 
        shopLogo: '/logo.png',
        shopName: 'SWEETO HUBS',
        storeTagline: 'YOUR HUB FOR PREMIUM ELECTRONICS'
      });
    }
  }, [loading, storeSettings.shopLogo]);

  // ─── PRODUCT ACTIONS ────────────────────────────────────────────────────────
  const addProduct = async (product) => {
    const data = await apiService.create('products', product);
    setProducts(prev => [...prev, data]);
    return data;
  };

  const updateProduct = async (id, updates) => {
    const data = await apiService.update('products', id, { ...updates, updated_at: new Date().toISOString() });
    setProducts(prev => prev.map(p => p.id === id ? data : p));
  };

  const deleteProduct = async (id) => {
    await apiService.delete('products', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // ─── STOCK ADJUSTMENT ACTIONS ────────────────────────────────────────────────
  const adjustStock = async (productId, type, quantity) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const prevStock = product.stockQuantity || 0;
    const newStock = type === 'increase'
      ? prevStock + Number(quantity)
      : prevStock - Number(quantity);
    if (newStock < 0) return;

    await updateProduct(productId, { stockQuantity: newStock });

    const adjustment = {
      productId,
      productName: product.name,
      type,
      quantity: Number(quantity),
      previousStock: prevStock,
      newStock,
      timestamp: new Date().toISOString()
    };
    const savedAdjustment = await apiService.create('stock_adjustments', adjustment);
    setStockAdjustments(prev => [...prev, savedAdjustment]);
  };

  // ─── SALES RECORD ACTIONS ────────────────────────────────────────────────────
  const addSaleRecord = async (record) => {
    const saleRecord = {
      product_id: record.productId,
      product_name: record.productName,
      quantity_sold: record.quantitySold,
      sale_date: new Date().toISOString()
    };
    const savedRecord = await apiService.create('sales_records', saleRecord);
    setSalesRecords(prev => [...prev, savedRecord]);

    await adjustStock(record.productId, 'decrease', record.quantitySold);
  };

  const deleteSaleRecord = async (id) => {
    await apiService.delete('sales_records', id);
    setSalesRecords(prev => prev.filter(s => s.id !== id));
  };

  // ─── CATEGORY ACTIONS ────────────────────────────────────────────────────────
  const addCategory = async (category) => {
    const data = await apiService.create('categories', category);
    setCategories(prev => [...prev, data]);
    return data;
  };

  const updateCategory = async (id, updates) => {
    const data = await apiService.update('categories', id, { ...updates, updated_at: new Date().toISOString() });
    setCategories(prev => prev.map(c => c.id === id ? data : c));
  };

  const deleteCategory = async (id) => {
    // Backend guard — permanent system categories cannot be deleted
    const categoryToDelete = categories.find(c => c.id === id);
    if (categoryToDelete?.permanent) {
      return { success: false, error: 'This is a permanent system category and cannot be deleted.' };
    }

    // Prevent deleting categories that still have products assigned
    const hasProducts = products.some(p => p.categoryId === id || p.categoryId?.toString() === id?.toString());
    if (hasProducts) return { success: false, error: 'Cannot delete a category that still has products assigned to it.' };

    try {
      await apiService.delete('categories', id);
      setCategories(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ─── VIDEO ADS ACTIONS ───────────────────────────────────────────────────────
  const addVideoAd = async (videoAdPayload) => {
    const data = await apiService.create('video_ads', videoAdPayload);
    setVideoAds(prev => [...prev, data]);
    return data;
  };

  const updateVideoAd = async (id, updates) => {
    const data = await apiService.update('video_ads', id, updates);
    setVideoAds(prev => prev.map(v => v.id === id ? data : v));
  };

  const deleteVideoAd = async (id) => {
    await apiService.delete('video_ads', id);
    setVideoAds(prev => prev.filter(v => v.id !== id));
    return { success: true };
  };
  
  // --- REVIEW ACTIONS ---
  const addReview = async (review) => {
    const data = await apiService.create('reviews', {
      ...review,
      date: new Date().toISOString()
    });
    setReviews(prev => [...prev, data]);
    
    // Auto-notify admin
    await addNotification({
      type: 'review',
      title: 'New Product Review',
      message: `${review.userName} rated ${review.rating} stars on product ID: ${review.productId}`,
      referenceId: data.id,
      read: false,
      timestamp: new Date().toISOString()
    });
    
    return data;
  };

  const deleteReview = async (id) => {
    await apiService.delete('reviews', id);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  // --- NOTIFICATION ACTIONS ---
  const addNotification = async (notification) => {
    const data = await apiService.create('notifications', notification);
    setNotifications(prev => [data, ...prev]);
    return data;
  };

  const markNotificationRead = async (id) => {
    await apiService.update('notifications', id, { read: true });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = async () => {
    // For simplicity in a mock API, we might just clear state or delete all via loop
    for (const n of notifications) {
      await apiService.delete('notifications', n.id);
    }
    setNotifications([]);
  };

  // --- SEARCH LOG ACTIONS ---
  const logSearch = async (query, resultsCount) => {
    if (!query || query.trim().length < 2) return;
    const log = {
      query: query.trim(),
      resultsCount,
      timestamp: new Date().toISOString()
    };
    const savedLog = await apiService.create('search_logs', log);
    setSearchLogs(prev => [...prev, savedLog]);
    return savedLog;
  };

  // --- USER LOG ACTIONS ---
  const logUserActivity = async (userId, userName, action) => {
    const log = {
      userId,
      userName,
      action, // 'login', 'signup', etc.
      timestamp: new Date().toISOString()
    };
    const savedLog = await apiService.create('user_logs', log);
    setUserLogs(prev => [...prev, savedLog]);
    return savedLog;
  };

  // ─── SETTINGS ACTIONS ────────────────────────────────────────────────────────
  const updateStoreSettings = async (updates) => {
    try {
      const data = await apiService.updateStoreSettings(updates);
      if (data) {
        setStoreSettings(data);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to update settings', e);
      return false;
    }
  };

  // ─── CURRENCY FORMATTING ─────────────────────────────────────────────────────
  const currencyMap = {
    USD: { symbol: '$', position: 'before' },
    EUR: { symbol: '€', position: 'before' },
    XOF: { symbol: 'FCFA', position: 'after' },
    GBP: { symbol: '£', position: 'before' }
  };

  const currencySymbol = (currencyMap[storeSettings?.defaultCurrency] || currencyMap.USD).symbol;

  const formatPrice = (amount) => {
    const currency = currencyMap[storeSettings?.defaultCurrency] || currencyMap.USD;
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      return currency.position === 'before' ? `${currency.symbol}0` : `0 ${currency.symbol}`;
    }
    const formattedAmount = numericAmount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    return currency.position === 'before'
      ? `${currency.symbol}${formattedAmount}`
      : `${formattedAmount} ${currency.symbol}`;
  };

  const value = {
    products, categories, storeSettings, stockAdjustments, salesRecords, visits, videoAds, reviews,
    loading,
    addProduct, updateProduct, deleteProduct,
    adjustStock, addSaleRecord, deleteSaleRecord,
    addCategory, updateCategory, deleteCategory,
    addVideoAd, updateVideoAd, deleteVideoAd,
    addReview, deleteReview,
    notifications, addNotification, markNotificationRead, clearNotifications,
    searchLogs, logSearch,
    userLogs, logUserActivity,
    users,
    updateStoreSettings,
    importDb: apiService.importDb.bind(apiService),
    exportDb: apiService.exportDb.bind(apiService),
    formatPrice, currencySymbol
  };

  return (
    <StoreDataContext.Provider value={value}>
      {children}
    </StoreDataContext.Provider>
  );
};

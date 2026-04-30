import React, { createContext, useContext, useState } from 'react';

const AdminDataContext = createContext();

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};

export const AdminDataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [storeSettings, setStoreSettings] = useState({
    shopName: 'Sweeto-Tech',
    shopLogo: '',
    defaultLanguage: 'en',
    adminLanguage: 'en',
    defaultCurrency: 'USD',
    contactEmail: 'admin@sweeto-tech.com',
    storeTagline: 'Your trusted electronics destination'
  });

  // Product Management
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id 
          ? { ...product, ...updatedProduct, updatedAt: new Date().toISOString() }
          : product
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProductById = (id) => {
    return products.find(product => product.id === id);
  };

  // Category Management
  const addCategory = (category) => {
    const newCategory = {
      ...category,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id, updatedCategory) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === id 
          ? { ...category, ...updatedCategory, updatedAt: new Date().toISOString() }
          : category
      )
    );
  };

  const deleteCategory = (id) => {
    // Check if category has associated products
    const hasProducts = products.some(product => product.categoryId === id);
    if (hasProducts) {
      return { success: false, error: 'This category has associated products and cannot be deleted' };
    }
    
    setCategories(prev => prev.filter(category => category.id !== id));
    return { success: true };
  };

  const getCategoryById = (id) => {
    return categories.find(category => category.id === id);
  };

  // Store Settings Management
  const updateStoreSettings = (newSettings) => {
    setStoreSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Helper functions
  const getProductsByCategory = (categoryId) => {
    return products.filter(product => product.categoryId === categoryId);
  };

  const value = {
    // Products
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    
    // Categories
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    
    // Store Settings
    storeSettings,
    updateStoreSettings
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStoreData } from './StoreDataContext';

const AdminLocaleContext = createContext();

export const useAdminLocale = () => {
  const context = useContext(AdminLocaleContext);
  if (!context) {
    throw new Error('useAdminLocale must be used within an AdminLocaleProvider');
  }
  return context;
};

export const AdminLocaleProvider = ({ children }) => {
  const { storeSettings } = useStoreData();
  const [language, setLanguage] = useState(storeSettings.adminLanguage || 'en');

  // Sync language with store settings when they change
  useEffect(() => {
    if (storeSettings.adminLanguage) {
      setLanguage(storeSettings.adminLanguage);
    }
  }, [storeSettings.adminLanguage]);

  const translations = {
    en: {
      // Navigation
      dashboard: 'Dashboard',
      productManagement: 'Product Management',
      categoryManagement: 'Category Management',
      storeSettings: 'Store Settings',
      logout: 'Logout',
      
      // Login
      login: 'Login',
      username: 'Username',
      password: 'Password',
      invalidCredentials: 'Invalid username or password',
      
      // Dashboard
      welcome: 'Welcome',
      quickAccess: 'Quick Access',
      
      // Products
      productList: 'Product List',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      productName: 'Product Name',
      category: 'Category',
      price: 'Price',
      status: 'Status',
      actions: 'Actions',
      active: 'Active',
      inactive: 'Inactive',
      productImage: 'Product Image',
      shortDescription: 'Short Description',
      promotionalLabel: 'Promotional Label',
      saveProduct: 'Save Product',
      updateProduct: 'Update Product',
      cancel: 'Cancel',
      deleteProduct: 'Delete Product',
      confirmDelete: 'Are you sure you want to delete this product?',
      searchProducts: 'Search products...',
      filterByCategory: 'Filter by category',
      
      // Categories
      categoryList: 'Category List',
      addCategory: 'Add Category',
      editCategory: 'Edit Category',
      categoryName: 'Category Name',
      categoryIcon: 'Category Icon',
      saveCategory: 'Save Category',
      updateCategory: 'Update Category',
      deleteCategory: 'Delete Category',
      confirmDeleteCategory: 'Are you sure you want to delete this category?',
      categoryHasProducts: 'This category has associated products and cannot be deleted',
      
      // Store Settings
      shopName: 'Shop Name',
      shopLogo: 'Shop Logo',
      defaultLanguage: 'Default Language',
      adminPanelLanguage: 'Admin Panel Language',
      defaultCurrency: 'Default Currency',
      contactEmail: 'Contact Email',
      storeTagline: 'Store Tagline',
      saveSettings: 'Save Settings',
      
      // Common
      required: 'This field is required',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      back: 'Back',
      search: 'Search',
      filter: 'Filter',
      close: 'Close',
      confirm: 'Confirm',

      // Stock Management
      stockManagement: 'Stock Management',
      manageInventory: 'Manage your product inventory and stock levels',
      currentStock: 'Current Stock',
      threshold: 'Threshold',
      lowStock: 'Low Stock',
      lowStockThreshold: 'Low-Stock Threshold',
      initialStock: 'Initial Stock',
      adjustStock: 'Adjust Stock',
      increase: 'Increase',
      decrease: 'Decrease',
      quantity: 'Quantity',
      invalidQuantity: 'Please enter a valid quantity',
      stockCannotBeNegative: 'Stock cannot go below zero',
      cannotDeleteWithSales: 'Cannot delete a product with sales history',
      noProductsFound: 'No products found',
      noLowStockProducts: 'No low-stock products',
      addFirstProduct: 'Add your first product to get started',
      stockHistory: 'Stock History',
      viewHistory: 'View History',
      noAdjustments: 'No stock adjustments recorded yet',
      stock: 'Stock',

      // Sales History
      salesHistory: 'Sales History',
      trackSales: 'View and track all sales records',
      recordSale: 'Record Sale',
      searchSales: 'Search by product name or Sale ID...',
      saleId: 'Sale ID',
      qtySold: 'Qty Sold',
      unitPrice: 'Unit Price',
      totalPrice: 'Total Price',
      totalRevenue: 'Total Revenue',
      customer: 'Customer',
      customerName: 'Customer Name',
      customerContact: 'Customer Contact',
      saleDate: 'Sale Date',
      selectProduct: 'Select Product',
      noSalesRecords: 'No sales records found',
      productNotFound: 'Product not found',
      insufficientStock: 'Insufficient stock for this sale',
      manageStock: 'Manage Stock',
      
      // Languages
      english: 'English',
      french: 'French'
    },
    fr: {
      // Navigation
      dashboard: 'Tableau de bord',
      productManagement: 'Gestion des produits',
      categoryManagement: 'Gestion des catégories',
      storeSettings: 'Paramètres du magasin',
      logout: 'Déconnexion',
      
      // Login
      login: 'Se connecter',
      username: "Nom d'utilisateur",
      password: 'Mot de passe',
      invalidCredentials: "Nom d'utilisateur ou mot de passe invalide",
      
      // Dashboard
      welcome: 'Bienvenue',
      quickAccess: 'Accès rapide',
      
      // Products
      productList: 'Liste des produits',
      addProduct: 'Ajouter un produit',
      editProduct: 'Modifier le produit',
      productName: 'Nom du produit',
      category: 'Catégorie',
      price: 'Prix',
      status: 'Statut',
      actions: 'Actions',
      active: 'Actif',
      inactive: 'Inactif',
      productImage: 'Image du produit',
      shortDescription: 'Courte description',
      promotionalLabel: 'Label promotionnel',
      saveProduct: 'Enregistrer le produit',
      updateProduct: 'Mettre à jour le produit',
      cancel: 'Annuler',
      deleteProduct: 'Supprimer le produit',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce produit?',
      searchProducts: 'Rechercher des produits...',
      filterByCategory: 'Filtrer par catégorie',
      
      // Categories
      categoryList: 'Liste des catégories',
      addCategory: 'Ajouter une catégorie',
      editCategory: 'Modifier la catégorie',
      categoryName: 'Nom de la catégorie',
      categoryIcon: 'Icône de la catégorie',
      saveCategory: 'Enregistrer la catégorie',
      updateCategory: 'Mettre à jour la catégorie',
      deleteCategory: 'Supprimer la catégorie',
      confirmDeleteCategory: 'Êtes-vous sûr de vouloir supprimer cette catégorie?',
      categoryHasProducts: 'Cette catégorie a des produits associés et ne peut pas être supprimée',
      
      // Store Settings
      shopName: 'Nom du magasin',
      shopLogo: 'Logo du magasin',
      defaultLanguage: 'Langue par défaut',
      adminPanelLanguage: "Langue du panneau d'administration",
      defaultCurrency: 'Devise par défaut',
      contactEmail: 'Email de contact',
      storeTagline: 'Slogan du magasin',
      saveSettings: 'Enregistrer les paramètres',
      
      // Common
      required: 'Ce champ est obligatoire',
      save: 'Enregistrer',
      edit: 'Modifier',
      delete: 'Supprimer',
      back: 'Retour',
      search: 'Rechercher',
      filter: 'Filtrer',
      close: 'Fermer',
      confirm: 'Confirmer',

      // Stock Management
      stockManagement: 'Gestion du stock',
      manageInventory: 'Gérez votre inventaire et niveaux de stock',
      currentStock: 'Stock actuel',
      threshold: 'Seuil',
      lowStock: 'Stock bas',
      lowStockThreshold: 'Seuil de stock bas',
      initialStock: 'Stock initial',
      adjustStock: 'Ajuster le stock',
      increase: 'Augmenter',
      decrease: 'Diminuer',
      quantity: 'Quantité',
      invalidQuantity: 'Veuillez entrer une quantité valide',
      stockCannotBeNegative: 'Le stock ne peut pas être négatif',
      cannotDeleteWithSales: 'Impossible de supprimer un produit avec un historique de ventes',
      noProductsFound: 'Aucun produit trouvé',
      noLowStockProducts: 'Aucun produit en stock bas',
      addFirstProduct: 'Ajoutez votre premier produit pour commencer',
      stockHistory: 'Historique du stock',
      viewHistory: 'Voir l\'historique',
      noAdjustments: 'Aucun ajustement de stock enregistré',
      stock: 'Stock',

      // Sales History
      salesHistory: 'Historique des ventes',
      trackSales: 'Voir et suivre tous les registres de ventes',
      recordSale: 'Enregistrer une vente',
      searchSales: 'Rechercher par nom de produit ou ID de vente...',
      saleId: 'ID de vente',
      qtySold: 'Qté vendue',
      unitPrice: 'Prix unitaire',
      totalPrice: 'Prix total',
      totalRevenue: 'Revenu total',
      customer: 'Client',
      customerName: 'Nom du client',
      customerContact: 'Contact du client',
      saleDate: 'Date de vente',
      selectProduct: 'Sélectionner un produit',
      noSalesRecords: 'Aucun registre de vente trouvé',
      productNotFound: 'Produit non trouvé',
      insufficientStock: 'Stock insuffisant pour cette vente',
      manageStock: 'Gérer le stock',
      
      // Languages
      english: 'English',
      french: 'Français'
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  const value = {
    language,
    setLanguage,
    t,
    toggleLanguage
  };

  return (
    <AdminLocaleContext.Provider value={value}>
      {children}
    </AdminLocaleContext.Provider>
  );
};

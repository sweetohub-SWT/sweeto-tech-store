import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../contexts/StoreDataContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { Package, Plus, Edit, Trash2, ArrowUp, ArrowDown, AlertTriangle, Search, Filter, X, ChevronDown, ChevronUp, History } from 'lucide-react';

// Shared modal backdrop — defined OUTSIDE the component to avoid re-creation on every render
const Backdrop = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const StockManagementPage = () => {
  const { t } = useAdminLocale();
  const {
    products, addProduct, updateProduct, deleteProduct,
    adjustStock, stockAdjustments, salesRecords, formatPrice
  } = useStoreData();

  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '', sku: '', stockQuantity: '', price: '', lowStockThreshold: '', image: '', categoryId: '', status: 'active', description: ''
  });
  const [adjustData, setAdjustData] = useState({ type: 'increase', quantity: '' });

  const filteredProducts = useMemo(() => {
    let list = products;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(p => p.name?.toLowerCase().includes(term) || p.id?.toString().includes(term));
    }
    if (showLowStockOnly) {
      list = list.filter(p => (p.lowStockThreshold || 0) > 0 && (p.stockQuantity || 0) <= (p.lowStockThreshold || 0));
    }
    return list;
  }, [products, searchTerm, showLowStockOnly]);

  const isLowStock = (p) => (p.lowStockThreshold || 0) > 0 && (p.stockQuantity || 0) <= (p.lowStockThreshold || 0);

  const lowStockCount = useMemo(() => products.filter(isLowStock).length, [products]);

  const handleAddProduct = () => {
    if (!formData.name || formData.price === '') { setError(t('required')); return; }
    if (formData.stockQuantity === '' || Number(formData.stockQuantity) <= 0) { 
      setError(t('invalidQuantity') + ': ' + t('stock') + ' > 0'); 
      return; 
    }
    addProduct({ 
      ...formData, 
      stockQuantity: Number(formData.stockQuantity), 
      lowStockThreshold: Number(formData.lowStockThreshold || 0), 
      price: Number(formData.price) 
    });
    setShowAddModal(false);
    resetForm();
  };

  const handleEditProduct = () => {
    if (!formData.name || !formData.price) { setError(t('required')); return; }
    updateProduct(selectedProduct.id, { ...formData, price: Number(formData.price), lowStockThreshold: Number(formData.lowStockThreshold) });
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteProduct = () => {
    const hasSales = salesRecords.some(s => s.productId === selectedProduct.id);
    if (hasSales) { setError(t('cannotDeleteWithSales')); setShowDeleteConfirm(false); return; }
    deleteProduct(selectedProduct.id);
    setShowDeleteConfirm(false);
    setSelectedProduct(null);
  };

  const handleAdjustStock = () => {
    const qty = Number(adjustData.quantity);
    if (qty <= 0) { setError(t('invalidQuantity')); return; }
    const currentStock = selectedProduct.stockQuantity || 0;
    if (adjustData.type === 'decrease' && currentStock - qty < 0) { setError(t('stockCannotBeNegative')); return; }
    adjustStock(selectedProduct.id, adjustData.type, qty);
    setShowAdjustModal(false);
    setAdjustData({ type: 'increase', quantity: '' });
  };

  const resetForm = () => {
    setFormData({ name: '', sku: '', stockQuantity: '', price: '', lowStockThreshold: '', image: '', categoryId: '', status: 'active', description: '' });
    setError('');
  };

  const openEdit = (p) => {
    setSelectedProduct(p);
    setFormData({ name: p.name, sku: p.id, price: p.price, lowStockThreshold: p.lowStockThreshold || '', image: p.image || '', categoryId: p.categoryId || '', status: p.status || 'active', description: p.description || '', stockQuantity: p.stockQuantity || '' });
    setShowEditModal(true);
  };

  const productHistory = useMemo(() => {
    if (!selectedProduct) return [];
    return stockAdjustments.filter(a => a.productId === selectedProduct.id).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [selectedProduct, stockAdjustments]);

  return (
    <div className="min-h-screen transition-colors duration-500">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-b border-[var(--border-color)]">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t('stockManagement')}</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{t('manageInventory')}</p>
            </div>
            <div className="flex items-center space-x-3">
              {lowStockCount > 0 && (
                <button onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                  className={`flex items-center px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${showLowStockOnly ? 'bg-amber-500 text-white' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'}`}>
                  <AlertTriangle size={16} className="mr-2" />
                  {lowStockCount} {t('lowStock')}
                </button>
              )}
              {lowStockCount > 0 && (
                <button 
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to restock ${lowStockCount} items?`)) {
                      products.forEach(p => {
                        if (isLowStock(p)) {
                          const diff = (p.lowStockThreshold || 0) - (p.stockQuantity || 0) + 10; // Restock to threshold + 10
                          adjustStock(p.id, 'increase', diff);
                        }
                      });
                    }
                  }}
                  className="flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-green-500/30 active:scale-95"
                >
                  <ArrowUp size={16} className="mr-2" /> Smart Restock
                </button>
              )}
              <button onClick={() => { resetForm(); setShowAddModal(true); }}
                className="flex items-center px-5 py-2.5 bg-[var(--primary-color)] hover:opacity-90 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-[var(--primary-color)]/30 active:scale-95">
                <Plus size={16} className="mr-2" /> {t('addProduct')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" id="stock-search" name="search" placeholder={t('searchProducts')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all" />
        </div>

        {/* Error toast */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center justify-between">
            <span className="text-red-600 dark:text-red-400 text-sm font-bold">{error}</span>
            <button onClick={() => setError('')}><X size={16} className="text-red-400" /></button>
          </div>
        )}

        {/* Product Table */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
            <Package className="h-16 w-16 text-gray-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">{showLowStockOnly ? t('noLowStockProducts') : t('noProductsFound')}</p>
            {!showLowStockOnly && <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">{t('addFirstProduct')}</p>}
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800">
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">{t('productName')}</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">SKU/ID</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">{t('currentStock')}</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">{t('price')}</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">{t('threshold')}</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} className={`border-b border-gray-50 dark:border-slate-800/50 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors ${isLowStock(p) ? 'bg-amber-50/50 dark:bg-amber-900/5' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 flex-shrink-0">
                            {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <span className="text-sm font-black text-gray-900 dark:text-white">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-500 dark:text-slate-400">{p.id}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <span className={`text-sm font-black font-mono ${isLowStock(p) ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'}`}>
                            {p.stockQuantity || 0}
                          </span>
                          {isLowStock(p) && (
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[9px] font-black uppercase tracking-widest rounded-full">
                              {t('low')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-[var(--primary-color)] font-mono">{formatPrice(p.price)}</td>
                      <td className="px-6 py-4 text-center text-sm font-mono text-gray-500 dark:text-slate-400">{p.lowStockThreshold || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-1">
                          <button onClick={() => { setSelectedProduct(p); setAdjustData({ type: 'increase', quantity: '' }); setShowAdjustModal(true); }}
                            className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title={t('adjustStock')}>
                            <ArrowUp size={16} />
                          </button>
                          <button onClick={() => { setSelectedProduct(p); setShowHistoryModal(true); }}
                            className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors" title={t('viewHistory')}>
                            <History size={16} />
                          </button>
                          <button onClick={() => openEdit(p)}
                            className="p-2 text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 rounded-lg transition-colors" title={t('edit')}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => { setSelectedProduct(p); setShowDeleteConfirm(true); }}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title={t('delete')}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <Backdrop onClose={() => setShowAddModal(false)}>
          <div className="p-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">{t('addProduct')}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1 block">{t('productName')} *</label>
                <input type="text" id="add-product-name" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1 block">{t('initialStock')}</label>
                  <input type="number" id="add-stock-qty" name="stockQuantity" min="0" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1 block">{t('price')} *</label>
                  <input type="number" id="add-product-price" name="price" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1 block">{t('lowStockThreshold')}</label>
                <input type="number" id="add-low-stock" name="lowStockThreshold" min="0" value={formData.lowStockThreshold} onChange={e => setFormData({...formData, lowStockThreshold: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
              </div>
              {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
              <div className="flex space-x-3 pt-4">
                <button onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-all hover:bg-gray-50 dark:hover:bg-slate-800">{t('cancel')}</button>
                <button onClick={handleAddProduct}
                  className="flex-1 px-4 py-3 bg-[var(--primary-color)] hover:opacity-90 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-[var(--primary-color)]/30">{t('saveProduct')}</button>
              </div>
            </div>
          </div>
        </Backdrop>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <Backdrop onClose={() => setShowEditModal(false)}>
          <div className="p-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">{t('editProduct')}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1 block">{t('productName')} *</label>
                <input type="text" id="edit-product-name" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1 block">{t('price')} *</label>
                  <input type="number" id="edit-product-price" name="price" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1 block">{t('lowStockThreshold')}</label>
                  <input type="number" id="edit-low-stock" name="lowStockThreshold" min="0" value={formData.lowStockThreshold} onChange={e => setFormData({...formData, lowStockThreshold: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
              <div className="flex space-x-3 pt-4">
                <button onClick={() => { setShowEditModal(false); resetForm(); }}
                  className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-all hover:bg-gray-50 dark:hover:bg-slate-800">{t('cancel')}</button>
                <button onClick={handleEditProduct}
                  className="flex-1 px-4 py-3 bg-[var(--primary-color)] hover:opacity-90 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-[var(--primary-color)]/30">{t('updateProduct')}</button>
              </div>
            </div>
          </div>
        </Backdrop>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && selectedProduct && (
        <Backdrop onClose={() => setShowAdjustModal(false)}>
          <div className="p-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">{t('adjustStock')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{selectedProduct.name} — {t('currentStock')}: <span className="font-black text-gray-900 dark:text-white">{selectedProduct.stockQuantity || 0}</span></p>
            <div className="space-y-4">
              <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800">
                <button onClick={() => setAdjustData({...adjustData, type: 'increase'})}
                  className={`flex-1 py-3 text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center ${adjustData.type === 'increase' ? 'bg-green-500 text-white' : 'bg-gray-50 dark:bg-slate-950 text-gray-500'}`}>
                  <ArrowUp size={16} className="mr-2" /> {t('increase')}
                </button>
                <button onClick={() => setAdjustData({...adjustData, type: 'decrease'})}
                  className={`flex-1 py-3 text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center ${adjustData.type === 'decrease' ? 'bg-red-500 text-white' : 'bg-gray-50 dark:bg-slate-950 text-gray-500'}`}>
                  <ArrowDown size={16} className="mr-2" /> {t('decrease')}
                </button>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1 block" htmlFor="adjust-quantity">{t('quantity')}</label>
                <input type="number" id="adjust-quantity" name="quantity" min="1" value={adjustData.quantity} onChange={e => setAdjustData({...adjustData, quantity: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
              </div>
              {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
              <div className="flex space-x-3 pt-4">
                <button onClick={() => setShowAdjustModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-all hover:bg-gray-50 dark:hover:bg-slate-800">{t('cancel')}</button>
                <button onClick={handleAdjustStock}
                  className="flex-1 px-4 py-3 bg-[var(--primary-color)] hover:opacity-90 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-[var(--primary-color)]/30">{t('confirm')}</button>
              </div>
            </div>
          </div>
        </Backdrop>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && selectedProduct && (
        <Backdrop onClose={() => setShowDeleteConfirm(false)}>
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">{t('confirmDelete')}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{selectedProduct.name}</p>
            <div className="flex space-x-3">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-all hover:bg-gray-50 dark:hover:bg-slate-800">{t('cancel')}</button>
              <button onClick={handleDeleteProduct}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all">{t('delete')}</button>
            </div>
          </div>
        </Backdrop>
      )}

      {/* Stock History Modal */}
      {showHistoryModal && selectedProduct && (
        <Backdrop onClose={() => setShowHistoryModal(false)}>
          <div className="p-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">{t('stockHistory')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{selectedProduct.name}</p>
            {productHistory.length === 0 ? (
              <p className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">{t('noAdjustments')}</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {productHistory.map(h => (
                  <div key={h.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-100 dark:border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${h.type === 'increase' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
                        {h.type === 'increase' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{h.type === 'increase' ? '+' : '-'}{h.quantity}</p>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500">{h.previousStock} → {h.newStock}</p>
                      </div>
                    </div>
                    <p className="text-[10px] font-mono text-gray-400 dark:text-slate-500">{new Date(h.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setShowHistoryModal(false)}
              className="w-full mt-6 px-4 py-3 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-all hover:bg-gray-50 dark:hover:bg-slate-800">{t('close')}</button>
          </div>
        </Backdrop>
      )}
    </div>
  );
};

export default StockManagementPage;

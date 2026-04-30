import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../contexts/StoreDataContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { ShoppingCart, Search, Plus, X, Calendar, Receipt, Trash2 } from 'lucide-react';

// Shared modal backdrop — defined OUTSIDE the component to avoid re-creation on every render
const Backdrop = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const SalesHistoryPage = () => {
  const { t } = useAdminLocale();
  const { salesRecords, products, addSaleRecord, deleteSaleRecord, formatPrice } = useStoreData();

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');

  const [saleForm, setSaleForm] = useState({
    productId: '', quantitySold: '', unitPrice: '', customerName: '', customerContact: ''
  });

  const filteredRecords = useMemo(() => {
    let list = [...salesRecords].sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(r => r.productName?.toLowerCase().includes(term) || r.id?.toString().includes(term));
    }
    if (dateFrom) {
      list = list.filter(r => new Date(r.saleDate) >= new Date(dateFrom));
    }
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      list = list.filter(r => new Date(r.saleDate) <= end);
    }
    return list;
  }, [salesRecords, searchTerm, dateFrom, dateTo]);

  const handleAddSale = () => {
    if (!saleForm.productId || saleForm.quantitySold <= 0) {
      setError(t('required'));
      return;
    }
    const product = products.find(p => p.id === saleForm.productId);
    if (!product) { setError(t('productNotFound')); return; }
    const currentStock = product.stockQuantity || 0;
    if (currentStock - Number(saleForm.quantitySold) < 0) {
      setError(t('insufficientStock'));
      return;
    }
    const unitPrice = saleForm.unitPrice || product.price;
    const record = {
      productId: product.id,
      productName: product.name,
      quantitySold: Number(saleForm.quantitySold),
      unitPrice: Number(unitPrice),
      totalPrice: Number(unitPrice) * Number(saleForm.quantitySold),
      customerName: saleForm.customerName,
      customerContact: saleForm.customerContact
    };
    addSaleRecord(record);
    setShowAddModal(false);
    setSaleForm({ productId: '', quantitySold: '', unitPrice: '', customerName: '', customerContact: '' });
    setError('');
  };

  const selectProduct = (id) => {
    const product = products.find(p => p.id === id);
    setSaleForm({ ...saleForm, productId: id, unitPrice: product ? product.price : '' });
  };

  const totalRevenue = useMemo(() => salesRecords.reduce((sum, r) => sum + (r.totalPrice || 0), 0), [salesRecords]);

  return (
    <div className="min-h-screen transition-colors duration-500">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-b border-[var(--border-color)]">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t('salesHistory')}</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{t('trackSales')}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gray-50 dark:bg-slate-950 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">{t('totalRevenue')}</p>
                <p className="text-lg font-black text-gray-900 dark:text-white font-mono">{formatPrice(totalRevenue)}</p>
              </div>
              <button onClick={() => { setError(''); setShowAddModal(true); }}
                className="flex items-center px-5 py-2.5 bg-[var(--primary-color)] hover:opacity-90 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-[var(--primary-color)]/30 active:scale-95">
                <Plus size={16} className="mr-2" /> {t('recordSale')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              id="sales-search" 
              name="search" 
              placeholder={t('searchSales')} 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all" />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="date" 
                id="sales-date-from" 
                name="dateFrom" 
                value={dateFrom} 
                onChange={e => setDateFrom(e.target.value)}
                className="pl-9 pr-3 py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
            </div>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="date" 
                id="sales-date-to" 
                name="dateTo" 
                value={dateTo} 
                onChange={e => setDateTo(e.target.value)}
                className="pl-9 pr-3 py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
            </div>
            {(dateFrom || dateTo) && (
              <button onClick={() => { setDateFrom(''); setDateTo(''); }}
                className="px-3 py-3.5 text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
            )}
          </div>
        </div>

        {/* Error toast */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center justify-between">
            <span className="text-red-600 dark:text-red-400 text-sm font-bold">{error}</span>
            <button onClick={() => setError('')}><X size={16} className="text-red-400" /></button>
          </div>
        )}

        {/* Sales Table */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
            <Receipt className="h-16 w-16 text-gray-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">{t('noSalesRecords')}</p>
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800">
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">{t('saleId')}</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">{t('productName')}</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">{t('qtySold')}</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">{t('unitPrice')}</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">{t('totalPrice')}</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">{t('customer')}</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">{t('saleDate')}</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map(r => (
                    <tr key={r.id} className="border-b border-gray-50 dark:border-slate-800/50 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-gray-500 dark:text-slate-400">#{r.id?.toString().slice(-6)}</td>
                      <td className="px-6 py-4 text-sm font-black text-gray-900 dark:text-white">{r.productName}</td>
                      <td className="px-6 py-4 text-center text-sm font-bold font-mono text-gray-900 dark:text-white">{r.quantitySold}</td>
                      <td className="px-6 py-4 text-right text-sm font-mono text-gray-500 dark:text-slate-400">{formatPrice(r.unitPrice)}</td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-[var(--primary-color)] font-mono">{formatPrice(r.totalPrice)}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">{r.customerName || '—'}</p>
                        {r.customerContact && <p className="text-[10px] text-gray-400 dark:text-slate-500">{r.customerContact}</p>}
                      </td>
                      <td className="px-6 py-4 text-right text-xs font-mono text-gray-400 dark:text-slate-500">{new Date(r.saleDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this sale record?')) {
                              deleteSaleRecord(r.id);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                          title="Delete Record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Sale Modal */}
      {showAddModal && (
        <Backdrop onClose={() => setShowAddModal(false)}>
          <div className="p-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">{t('recordSale')}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1 block" htmlFor="sale-product">{t('selectProduct')} *</label>
                <select 
                  id="sale-product" 
                  name="productId" 
                  value={saleForm.productId} 
                  onChange={e => selectProduct(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--primary-color)]">
                  <option value="">— {t('selectProduct')} —</option>
                  {products.map(p => {
                    const stock = p.stockQuantity || 0;
                    const outOfStock = stock <= 0;
                    return (
                      <option key={p.id} value={p.id} disabled={outOfStock}>
                        {p.name} ({t('stock')}: {stock}){outOfStock ? ` — ${t('outOfStock')}` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1 block" htmlFor="sale-quantity">{t('quantity')} *</label>
                  <input 
                    type="number" 
                    id="sale-quantity" 
                    name="quantitySold" 
                    min="1" 
                    value={saleForm.quantitySold} 
                    onChange={e => setSaleForm({...saleForm, quantitySold: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1 block" htmlFor="sale-unit-price">{t('unitPrice')}</label>
                  <input 
                    type="number" 
                    id="sale-unit-price" 
                    name="unitPrice" 
                    min="0" 
                    value={saleForm.unitPrice} 
                    onChange={e => setSaleForm({...saleForm, unitPrice: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1 block" htmlFor="sale-customer-name">{t('customerName')}</label>
                <input 
                  type="text" 
                  id="sale-customer-name" 
                  name="customerName" 
                  value={saleForm.customerName} 
                  onChange={e => setSaleForm({...saleForm, customerName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1 block" htmlFor="sale-customer-contact">{t('customerContact')}</label>
                <input 
                  type="text" 
                  id="sale-customer-contact" 
                  name="customerContact" 
                  value={saleForm.customerContact} 
                  onChange={e => setSaleForm({...saleForm, customerContact: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
              </div>
              {saleForm.productId && saleForm.quantitySold > 0 && saleForm.unitPrice > 0 && (
                <div className="p-4 bg-[var(--primary-color)]/10 rounded-xl border border-[var(--primary-color)]/20">
                  <p className="text-xs font-black uppercase tracking-widest text-[var(--primary-color)] opacity-70 mb-1">{t('totalPrice')}</p>
                  <p className="text-2xl font-black text-[var(--primary-color)] font-mono">{formatPrice(Number(saleForm.unitPrice) * Number(saleForm.quantitySold))}</p>
                </div>
              )}
              {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
              <div className="flex space-x-3 pt-4">
                <button onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-all hover:bg-gray-50 dark:hover:bg-slate-800">{t('cancel')}</button>
                <button onClick={handleAddSale}
                  className="flex-1 px-4 py-3 bg-[var(--primary-color)] hover:opacity-90 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-[var(--primary-color)]/30">{t('recordSale')}</button>
              </div>
            </div>
          </div>
        </Backdrop>
      )}
    </div>
  );
};

export default SalesHistoryPage;

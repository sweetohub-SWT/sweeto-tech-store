import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Grid3x3, Settings, Warehouse, Receipt, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useStoreData } from '../../contexts/StoreDataContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ products: [], categories: [], actions: [] });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { products, categories } = useStoreData();
  const { t } = useAdminLocale();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const ACTIONS = [
    { id: 'add-product', title: 'Add New Product', icon: Package, link: '/admin/products/add', category: 'Actions' },
    { id: 'add-category', title: 'Add New Category', icon: Grid3x3, link: '/admin/categories/add', category: 'Actions' },
    { id: 'manage-stock', title: 'Manage Inventory', icon: Warehouse, link: '/admin/stock', category: 'Actions' },
    { id: 'store-settings', title: 'Store Settings', icon: Settings, link: '/admin/settings', category: 'Actions' },
    { id: 'sales-history', title: 'Sales History', icon: Receipt, link: '/admin/sales', category: 'Actions' },
  ];

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults({ products: [], categories: [], actions: ACTIONS });
      return;
    }

    const q = query.toLowerCase();
    
    const filteredProducts = products
      .filter(p => p.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map(p => ({ ...p, type: 'product', icon: Package, link: `/admin/products/edit/${p.id}` }));

    const filteredCategories = categories
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map(c => ({ ...c, type: 'category', icon: Grid3x3, link: `/admin/categories/edit/${c.id}` }));

    const filteredActions = ACTIONS
      .filter(a => a.title.toLowerCase().includes(q))
      .map(a => ({ ...a, type: 'action' }));

    setResults({
      products: filteredProducts,
      categories: filteredCategories,
      actions: filteredActions
    });
    setSelectedIndex(0);
  }, [query, products, categories]);

  const flattenedResults = [
    ...results.actions,
    ...results.products,
    ...results.categories
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % flattenedResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + flattenedResults.length) % flattenedResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = flattenedResults[selectedIndex];
      if (selected) handleSelect(selected);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (item) => {
    navigate(item.link);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Palette */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="relative border-b border-gray-100 dark:border-slate-800 p-6 bg-gray-50/50 dark:bg-slate-950/50">
          <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-600" size={20} />
          <input
            ref={inputRef}
            type="text"
            className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-xl font-bold text-gray-900 dark:text-white placeholder-gray-400"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="px-2 py-1 bg-gray-200 dark:bg-slate-800 rounded-md text-[10px] font-black text-gray-500">ESC</span>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          {flattenedResults.length > 0 ? (
            <div className="space-y-2">
              {/* Actions Section */}
              {results.actions.length > 0 && (
                <div className="mb-4">
                  <h4 className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Quick Actions</h4>
                  {results.actions.map((item) => {
                    const isSelected = flattenedResults.indexOf(item) === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                          isSelected ? 'bg-[var(--primary-color)] text-white shadow-lg shadow-[var(--primary-color)]/20 translate-x-1' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-800'}`}>
                            <item.icon size={18} />
                          </div>
                          <span className="font-bold">{item.title}</span>
                        </div>
                        {isSelected && <CornerDownLeft size={16} className="opacity-60" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Products Section */}
              {results.products.length > 0 && (
                <div className="mb-4">
                  <h4 className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Products</h4>
                  {results.products.map((item) => {
                    const isSelected = flattenedResults.indexOf(item) === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                          isSelected ? 'bg-[var(--primary-color)] text-white shadow-lg shadow-[var(--primary-color)]/20 translate-x-1' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl overflow-hidden ${isSelected ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-800'}`}>
                            {item.image ? (
                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><Package size={16} /></div>
                            )}
                          </div>
                          <div className="text-left">
                            <p className="font-bold">{item.name}</p>
                            <p className={`text-[10px] uppercase font-black tracking-widest ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>Price: ${item.price}</p>
                          </div>
                        </div>
                        {isSelected && <ArrowRight size={16} className="opacity-60" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Categories Section */}
              {results.categories.length > 0 && (
                <div>
                  <h4 className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Categories</h4>
                  {results.categories.map((item) => {
                    const isSelected = flattenedResults.indexOf(item) === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                          isSelected ? 'bg-[var(--primary-color)] text-white shadow-lg shadow-[var(--primary-color)]/20 translate-x-1' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl text-xl ${isSelected ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-800'}`}>
                            {item.icon || <Grid3x3 size={18} />}
                          </div>
                          <span className="font-bold">{item.name}</span>
                        </div>
                        {isSelected && <ArrowRight size={16} className="opacity-60" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 text-center">
              <Search size={40} className="mx-auto mb-4 text-gray-200 dark:text-slate-800" />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No results found for "{query}"</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 dark:bg-slate-950/50 border-t border-gray-100 dark:border-slate-800 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span className="px-2 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md">↑↓</span> Navigate
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span className="px-2 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md">ENTER</span> Select
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span className="px-2 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md">ESC</span> Close
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

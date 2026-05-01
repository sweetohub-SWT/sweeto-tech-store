import React, { useState, useEffect } from 'react';
import { useStoreData } from '../../contexts/StoreDataContext';
import { useToast } from '../../contexts/ToastContext';
import { LayoutGrid, Eye, EyeOff, Save, Search, ArrowRight, CheckCircle2, Circle } from 'lucide-react';

const HomeCategoryManagementPage = () => {
  const { categories, updateCategory } = useStoreData();
  const { showToast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [localCategories, setLocalCategories] = useState([]);

  // Sync with store data on load
  useEffect(() => {
    if (categories) {
      setLocalCategories([...categories].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
    }
  }, [categories]);

  const filteredCategories = localCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleVisibility = (id) => {
    setLocalCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, showOnHome: !cat.showOnHome } : cat
    ));
  };

  const updateSortOrder = (id, newOrder) => {
    setLocalCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, sortOrder: parseInt(newOrder) || 0 } : cat
    ).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // We need to update each modified category. 
      // For simplicity in this mock, we'll iterate and update.
      // In a real app, you might have a bulk update endpoint.
      const promises = localCategories.map(cat => {
        const original = categories.find(c => c.id === cat.id);
        if (original.showOnHome !== cat.showOnHome || original.sortOrder !== cat.sortOrder) {
          return updateCategory(cat.id, { 
            showOnHome: cat.showOnHome, 
            sortOrder: cat.sortOrder 
          });
        }
        return null;
      }).filter(p => p !== null);

      await Promise.all(promises);
      showToast('Category display settings updated!', 'success');
    } catch (error) {
      showToast('Failed to save changes', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const activeCount = localCategories.filter(c => c.showOnHome).length;

  return (
    <div className="p-6 sm:p-10 lg:p-12 max-w-[1600px] mx-auto space-y-12 animate-ai-fade-in relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--primary-color)]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary-color)]/10 flex items-center justify-center text-[var(--primary-color)]">
              <LayoutGrid size={28} />
            </div>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase">
              Category <span className="text-[var(--primary-color)]">Display</span>
            </h1>
          </div>
          <p className="text-gray-500 dark:text-slate-400 font-bold max-w-2xl uppercase tracking-widest text-xs leading-relaxed">
            Control which categories appear in the circular "Shop by Category" section on the homepage. 
            Toggle visibility and set the display priority.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Stats Card */}
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl px-6 py-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-4 min-w-[200px]">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-black">
              {activeCount}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Icons</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tighter">On Homepage</p>
            </div>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="w-full sm:w-auto bg-[var(--primary-color)] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {isSaving ? 'Synchronizing...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="relative z-10 flex flex-col md:flex-row gap-6">
        <div className="relative flex-grow group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search categories architecture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-[2rem] outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-all font-bold text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Category Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {filteredCategories.map((cat) => (
          <div 
            key={cat.id}
            className={`group relative flex flex-col items-center p-8 rounded-[3rem] transition-all duration-500 border-2 ${
              cat.showOnHome 
                ? 'bg-white dark:bg-slate-800 border-[var(--primary-color)]/30 shadow-2xl shadow-[var(--primary-color)]/10' 
                : 'bg-gray-50/50 dark:bg-slate-900/30 border-transparent opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
            }`}
          >
            {/* Visual Circle Toggle */}
            <button 
              onClick={() => toggleVisibility(cat.id)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-20"
            >
              {cat.showOnHome ? (
                <div className="w-full h-full bg-[var(--primary-color)] rounded-full flex items-center justify-center text-white shadow-lg">
                  <CheckCircle2 size={16} />
                </div>
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-gray-400">
                  <Circle size={16} />
                </div>
              )}
            </button>

            {/* Category Icon/Image Circle */}
            <div className={`w-24 h-24 sm:w-32 sm:h-32 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center p-6 mb-6 transition-all duration-500 shadow-sm ${cat.showOnHome ? 'group-hover:shadow-xl group-hover:-translate-y-2' : ''}`}>
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
              ) : (
                <div className="text-2xl font-black text-gray-200 uppercase">{cat.name.charAt(0)}</div>
              )}
            </div>

            {/* Info */}
            <div className="text-center w-full">
              <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter text-sm mb-4 line-clamp-1">
                {cat.name}
              </h3>
              
              {/* Order Input */}
              <div className="flex items-center justify-center gap-2 bg-gray-100/50 dark:bg-black/20 rounded-xl px-3 py-2 border border-transparent focus-within:border-[var(--primary-color)]/30 transition-all">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Order</span>
                <input 
                  type="number"
                  value={cat.sortOrder || 0}
                  onChange={(e) => updateSortOrder(cat.id, e.target.value)}
                  className="w-10 bg-transparent text-center font-black text-xs text-[var(--primary-color)] outline-none"
                />
              </div>
            </div>

            {/* Hover Actions Label */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 rounded-[3rem] transition-all duration-300 pointer-events-none">
              <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                {cat.showOnHome ? <EyeOff size={14} /> : <Eye size={14} />}
                {cat.showOnHome ? 'Hide From Home' : 'Show On Home'}
              </p>
            </div>
            
            {/* Real Link to Toggle (Invisible overlay) */}
            <button 
              onClick={() => toggleVisibility(cat.id)}
              className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-32 bg-white/5 dark:bg-white/5 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-white/5">
          <Search className="mx-auto mb-6 text-gray-300" size={48} />
          <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">No Categories Found</h3>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Try adjusting your search query</p>
        </div>
      )}
    </div>
  );
};

export default HomeCategoryManagementPage;

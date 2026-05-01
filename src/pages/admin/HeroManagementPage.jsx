import React, { useState, useEffect } from 'react';
import { useStoreData } from '../../contexts/StoreDataContext';
import { Layout, LayoutGrid, Image as ImageIcon, Link as LinkIcon, Save, Check, Search, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const HeroManagementPage = () => {
  const { storeSettings, updateStoreSettings, products, formatPrice } = useStoreData();
  const { showToast } = useToast();
  const [layout, setLayout] = useState(storeSettings.heroLayout || 'slider');
  const [banners, setBanners] = useState(storeSettings.heroBanners || [
    { id: 'main', productId: '', image: '', title: '', subtitle: '', link: '' },
    { id: 'side1', productId: '', image: '', title: '', subtitle: '', link: '' },
    { id: 'side2', productId: '', image: '', title: '', subtitle: '', link: '' }
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectingFor, setSelectingFor] = useState(null); // 'main', 'side1', 'side2'

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoryId?.toString().includes(searchTerm.toLowerCase())
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await updateStoreSettings({
        heroLayout: layout,
        heroBanners: banners
      });
      if (success) {
        showToast('Hero layout updated successfully!', 'success');
      } else {
        showToast('Failed to update settings', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const selectProduct = (slotId, product) => {
    setBanners(prev => prev.map(b => 
      b.id === slotId 
        ? { ...b, productId: product.id, title: product.name, image: product.image, link: `/product/${product.id}` }
        : b
    ));
    setSelectingFor(null);
  };

  const clearSlot = (slotId) => {
    setBanners(prev => prev.map(b => 
      b.id === slotId 
        ? { ...b, productId: '', image: '', title: '', subtitle: '', link: '' }
        : b
    ));
  };

  const updateBannerField = (slotId, field, value) => {
    setBanners(prev => prev.map(b => 
      b.id === slotId ? { ...b, [field]: value } : b
    ));
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 italic">
            <Layout className="text-[#ff4d6d]" size={28} />
            HERO MANAGEMENT
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">
            Configure your storefront's first impression
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#ff4d6d] text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-[#ff4d6d]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : (
            <>
              <Save size={18} />
              Save Layout
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Layout Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <LayoutGrid size={18} className="text-[#ff4d6d]" />
              Choose Layout
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Slider Option */}
              <button
                onClick={() => setLayout('slider')}
                className={`relative p-4 rounded-2xl border-2 transition-all text-left group ${
                  layout === 'slider' 
                    ? 'border-[#ff4d6d] bg-[#ff4d6d]/5' 
                    : 'border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-widest">Single Slider</span>
                  {layout === 'slider' && <Check size={16} className="text-[#ff4d6d]" />}
                </div>
                <div className="aspect-video bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden relative border border-gray-200 dark:border-slate-700">
                   <div className="absolute inset-x-4 inset-y-4 bg-white dark:bg-slate-700 rounded-md shadow-sm flex items-center justify-center">
                     <div className="w-1/2 h-2 bg-gray-200 dark:bg-slate-600 rounded-full mb-2"></div>
                   </div>
                   <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                     <div className="w-4 h-1 bg-[#ff4d6d] rounded-full"></div>
                     <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                     <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                   </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-3 font-medium">Modern fullscreen slider for high-impact visual storytelling.</p>
              </button>

              {/* Grid Option */}
              <button
                onClick={() => setLayout('grid')}
                className={`relative p-4 rounded-2xl border-2 transition-all text-left group ${
                  layout === 'grid' 
                    ? 'border-[#ff4d6d] bg-[#ff4d6d]/5' 
                    : 'border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-widest">Featured Grid</span>
                  {layout === 'grid' && <Check size={16} className="text-[#ff4d6d]" />}
                </div>
                <div className="aspect-video grid grid-cols-3 grid-rows-2 gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1 border border-gray-200 dark:border-slate-700">
                   <div className="col-span-2 row-span-2 bg-white dark:bg-slate-700 rounded-md shadow-sm"></div>
                   <div className="bg-white dark:bg-slate-700 rounded-md shadow-sm"></div>
                   <div className="bg-white dark:bg-slate-700 rounded-md shadow-sm"></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-3 font-medium">Bento-style grid featuring multiple products simultaneously.</p>
              </button>
            </div>
          </div>
        </div>

        {/* Slot Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm">
             <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                <ImageIcon size={18} className="text-[#ff4d6d]" />
                Configure Banners
             </h3>

             <div className="space-y-8">
               {banners.map((banner, index) => (
                 <div key={banner.id} className="relative p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="absolute -top-3 left-6 px-4 py-1 bg-slate-900 text-white dark:bg-white dark:text-slate-950 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                      {banner.id === 'main' ? 'Main Slot (1)' : banner.id === 'side1' ? 'Top Side (2)' : 'Bottom Side (3)'}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      {/* Preview Image */}
                      <div className="md:col-span-4 aspect-square md:aspect-auto md:h-full min-h-[120px] rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center relative group">
                        {banner.image ? (
                          <>
                            <img src={banner.image} alt="Preview" className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                            <button 
                              onClick={() => clearSlot(banner.id)}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                            <ImageIcon size={32} strokeWidth={1} />
                            <span className="text-[9px] font-bold uppercase">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="md:col-span-8 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Banner Title</label>
                            <input 
                              type="text"
                              value={banner.title}
                              onChange={(e) => updateBannerField(banner.id, 'title', e.target.value)}
                              placeholder="e.g. GAMING GEAR"
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-[#ff4d6d]/20 focus:border-[#ff4d6d] outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Subtitle/Description</label>
                            <input 
                              type="text"
                              value={banner.subtitle}
                              onChange={(e) => updateBannerField(banner.id, 'subtitle', e.target.value)}
                              placeholder="e.g. Next-gen controllers"
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-[#ff4d6d]/20 focus:border-[#ff4d6d] outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                           <button 
                             onClick={() => setSelectingFor(banner.id)}
                             className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                           >
                             <Search size={14} />
                             {banner.productId ? 'Change Product' : 'Select Product'}
                           </button>
                           {banner.productId && (
                             <div className="bg-green-500/10 text-green-600 px-3 py-2.5 rounded-xl flex items-center gap-2">
                               <Check size={14} />
                               <span className="text-[10px] font-black uppercase tracking-widest">Linked</span>
                             </div>
                           )}
                        </div>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Product Selection Modal */}
      {selectingFor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black italic">SELECT PRODUCT</h3>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Linking to slot: {selectingFor}</p>
              </div>
              <button 
                onClick={() => setSelectingFor(null)}
                className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#ff4d6d]/20 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => selectProduct(selectingFor, product)}
                  className="w-full flex items-center gap-4 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-[#ff4d6d] hover:bg-[#ff4d6d]/5 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 p-2 flex items-center justify-center">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-xs font-black uppercase tracking-tight">{product.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold">{formatPrice(product.price)}</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-[#ff4d6d] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                   <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No products found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroManagementPage;

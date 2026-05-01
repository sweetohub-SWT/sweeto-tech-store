import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { Filter, ChevronDown, LayoutGrid, ChevronLeft } from 'lucide-react';
import { updateSEO } from '../utils/seoHelper';
import ProductCard from '../components/ProductCard';
import { getCategoryHeroImage, getCategoryTagline } from '../utils/categoryData';
import { useLocale } from '../contexts/LocaleContext';

const CategoryPage = () => {
  const { categoryName = '' } = useParams();
  const navigate = useNavigate();
  const { products = [], categories = [] } = useStoreData();
  const { t } = useLocale();

  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');

  // Find category object by name (with pluralization tolerance)
  const normalizedSearch = decodeURIComponent(categoryName || '').toLowerCase();
  const category = categories.find(c => {
    const name = c?.name?.toLowerCase() || '';
    return name === normalizedSearch || 
           name === normalizedSearch.replace(/s$/, '') || 
           name + 's' === normalizedSearch;
  });
  
  const decodedName = normalizedSearch;

  // Find child category IDs and Names
  const childCategoryIds = categories
    .filter(c => {
      const parent = c?.parentCategory?.toLowerCase() || '';
      return parent === decodedName || parent === decodedName.replace(/s$/, '') || parent + 's' === decodedName;
    })
    .map(c => c.id);

  const childCategoryNames = categories
    .filter(c => {
      const parent = c?.parentCategory?.toLowerCase() || '';
      return parent === decodedName || parent === decodedName.replace(/s$/, '') || parent + 's' === decodedName;
    })
    .map(c => c.name?.toLowerCase() || '');

  // Filter products based on category and sub-categories
  let categoryProducts = products.filter(product => {
    // Only show active products (default to active if status is missing)
    if (product.status && product.status !== 'active') return false;
    
    const pCatId = (product.categoryId || product.category_id)?.toString();
    const cId = category?.id?.toString();
    const pCatName = product.category?.toLowerCase() || '';
    const cleanSearch = decodedName.replace(/^(premium|modern|smart|mobile|latest|top)\s+/i, '').trim();

    // Direct match (By ID or Name)
    const isDirectMatch = (cId && pCatId === cId) || 
                         (pCatName === decodedName) || 
                         (pCatName === cleanSearch) ||
                         (pCatName === decodedName.replace(/s$/, '')) || 
                         (pCatName === cleanSearch.replace(/s$/, '')) ||
                         (pCatName + 's' === decodedName) ||
                         (pCatName + 's' === cleanSearch);
    
    // Sub-category match
    const isChildMatch = childCategoryIds.some(id => id?.toString() === pCatId) || 
                       (pCatName && childCategoryNames.includes(pCatName)) ||
                       (pCatName && childCategoryNames.includes(cleanSearch));
    
    return isDirectMatch || isChildMatch;
  });

  // Apply Sub-category filter
  if (filterCategory !== 'all') {
    categoryProducts = categoryProducts.filter(p => {
      const pCatName = (p.category || '').toLowerCase();
      const pSubCatName = (p.subcategory || '').toLowerCase();
      const pCatId = (p.categoryId || p.category_id)?.toString();
      const target = filterCategory.toLowerCase();

      // Check if pCatId corresponds to a category named 'target'
      const matchesIdName = categories.some(c => 
        c.id?.toString() === pCatId && 
        (c.name?.toLowerCase() === target || 
         c.name?.toLowerCase() === target.replace(/s$/, '') ||
         c.name?.toLowerCase() + 's' === target)
      );

      return pCatName === target || 
             pSubCatName === target || 
             pCatName === target.replace(/s$/, '') ||
             matchesIdName;
    });
  }

  // Apply sorting
  categoryProducts = [...categoryProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // Default: newest (assuming ID order for now)
  });

  useEffect(() => {
    updateSEO({
      title: `${decodeURIComponent(categoryName)} | Sweeto Tech`,
      description: `Shop the latest ${decodeURIComponent(categoryName)} at Sweeto Tech. High-performance technology at your fingertips.`,
    });
    window.scrollTo(0, 0);
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 transition-colors pb-20 overflow-x-hidden">
      
      {/* Cinematic Category Header */}
      <div className="relative w-full h-[300px] lg:h-[450px] bg-black overflow-hidden">
        {/* Background Art */}
        <div className="absolute inset-0 opacity-40">
          <img 
            src={getCategoryHeroImage(categoryName)} 
            alt={categoryName} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/20"></div>
        </div>

        {/* Decorative Art Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.03] text-[20rem] lg:text-[35rem] font-black uppercase pointer-events-none select-none tracking-tighter">
          {categoryName.substring(0, 3)}
        </div>

        {/* Content Overlay */}
        <div className="relative h-full max-w-none ml-0 px-4 lg:px-8 flex flex-col justify-end pb-12 lg:pb-20">
          <div className="max-w-3xl">
            {/* Back Link */}
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors mb-6 group"
            >
              <div className="p-1.5 rounded-full border border-white/20 group-hover:border-white/50 transition-colors">
                <ChevronLeft size={12} />
              </div>
              {t('back')}
            </button>

            <div className="flex items-center gap-4 mb-2">
              <div className="w-8 h-1 bg-[var(--primary-color)] rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--primary-color)]">{t('department')}</span>
            </div>
            
            <h1 className="text-4xl lg:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85] mb-6">
              {categoryName.split(' ')[0]} <span className="text-[var(--primary-color)]">{categoryName.split(' ').slice(1).join(' ')}</span>
            </h1>
            
            <p className="text-sm lg:text-lg text-gray-300 font-medium max-w-xl leading-relaxed opacity-80 border-l-2 border-white/10 pl-6 uppercase tracking-widest text-[10px]">
              {getCategoryTagline(categoryName)}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 p-12 hidden lg:block opacity-10">
           <h2 className="text-[150px] font-black text-white uppercase italic leading-none tracking-tighter select-none">
             {decodeURIComponent(categoryName).slice(0, 3)}
           </h2>
        </div>
      </div>

      <div className="max-w-none ml-0 px-4 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Floating Glass Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-8">
              {/* Filter Glass Card */}
              <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/50 dark:border-slate-800/50 shadow-2xl shadow-gray-200/50 dark:shadow-none">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-lg">
                      <Filter size={18} />
                    </div>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">{t('filters')}</h2>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 text-[10px] font-black text-gray-500">
                    {categoryProducts.length}
                  </div>
                </div>

                {/* Sub-Category Navigation */}
                <div className="space-y-10">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--primary-color)] mb-8 pl-1">
                      {t('browseSegments')}
                    </h3>
                    <div className="flex flex-col gap-3">
                      {[t('allProducts'), ...childCategoryNames.map(n => n.charAt(0).toUpperCase() + n.slice(1))].map((label) => {
                        const isActive = label === t('allProducts') ? filterCategory === 'all' : filterCategory === label.toLowerCase();
                        return (
                          <button
                            key={label}
                            onClick={() => {
                              if (label === t('allProducts')) {
                                setFilterCategory('all');
                              } else {
                                setFilterCategory(label.toLowerCase());
                              }
                            }}
                            className={`group relative flex items-center justify-between px-7 py-5 rounded-[2rem] text-[12px] font-black uppercase tracking-widest transition-all duration-500 overflow-hidden ${
                              isActive 
                              ? 'bg-black dark:bg-white text-white dark:text-black shadow-2xl scale-[1.05] z-10' 
                              : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/80'
                            }`}
                          >
                            <span className="relative z-10">{label}</span>
                            {isActive ? (
                               <div className="w-2 h-2 bg-[var(--primary-color)] rounded-full shadow-[0_0_15px_var(--primary-color)]" />
                            ) : (
                               <ChevronDown size={14} className="opacity-0 group-hover:opacity-100 transition-all -rotate-90 group-hover:translate-x-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cinematic Promo Card */}
              <div className="hidden lg:block relative overflow-hidden rounded-[3rem] aspect-square bg-slate-950 text-white group cursor-pointer shadow-2xl">
                 <div className="absolute inset-0 opacity-50 group-hover:scale-110 transition-transform duration-[2s] ease-out">
                    <img 
                      src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" 
                      alt="Promo" 
                      className="w-full h-full object-cover" 
                    />
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                 <div className="absolute inset-0 p-10 flex flex-col justify-end">
                     <div className="overflow-hidden mb-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--primary-color)] block transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">{t('newSeason')}</span>
                    </div>
                    <h4 className="text-3xl font-black tracking-tighter uppercase italic leading-[0.8] mb-6">
                      {t('exploreThe')} <br/>
                      <span className="text-[var(--primary-color)]">PRO</span> LINE
                    </h4>
                    <div className="w-12 h-1 bg-white/20 group-hover:w-full transition-all duration-700"></div>
                 </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 min-w-0">
            {/* Context Header */}
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 p-8 bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/50 dark:border-slate-800/50 shadow-sm">
               <div>
                 <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">{t('currentSelection')}</h2>
                 <div className="flex items-center gap-2">
                    <span className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">
                      {filterCategory === 'all' ? t('allInventory') : filterCategory}
                    </span>
                 </div>
               </div>

              <div className="flex items-center gap-4">
                <div className="relative group">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                     className="appearance-none bg-[#F8F9FA] dark:bg-slate-800 text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 pr-12 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all cursor-pointer shadow-inner"
                   >
                     <option value="newest text-gray-900">{t('sortNewest')}</option>
                     <option value="name">{t('sortName')}</option>
                     <option value="price-low">{t('sortPriceLow')}</option>
                     <option value="price-high">{t('sortPriceHigh')}</option>
                   </select>
                  <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>

            {/* Premium Products Grid */}
            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900/30 backdrop-blur-sm rounded-[4rem] border border-dashed border-gray-200 dark:border-slate-800">
                 <div className="w-32 h-32 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 shadow-inner animate-pulse">
                   <LayoutGrid size={48} className="text-gray-300" />
                 </div>
                 <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 uppercase italic tracking-tighter">{t('inventoryEmpty')}</h3>
                 <p className="text-gray-400 dark:text-slate-500 text-center max-w-sm font-bold uppercase tracking-widest text-[10px] mb-10 px-6">
                   {t('curatingNewArrivals')}
                 </p>
                 <Link to="/" className="bg-black dark:bg-white text-white dark:text-black px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:scale-105 transition-all shadow-2xl hover:shadow-black/20">
                   {t('returnToHome')}
                 </Link>
               </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;



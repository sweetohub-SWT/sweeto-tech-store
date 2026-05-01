import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useStoreData } from '../contexts/StoreDataContext';
import { useLocale } from '../contexts/LocaleContext';
import { updateSEO } from '../utils/seoHelper';
import ProductCard from '../components/ProductCard';
import { getCategoryHeroImage } from '../utils/categoryData';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const filter = searchParams.get('filter') || '';
  const { products, categories, logSearch } = useStoreData();
  const { t } = useLocale();

  const searchResults = React.useMemo(() => {
    let filtered = products.filter(p => p.status === 'active');
    
    // Apply Query Search
    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(product => {
        const categoryName = categories.find(c => c.id === product.categoryId)?.name || '';
        return (
          (product.name || '').toLowerCase().includes(searchTerm) ||
          categoryName.toLowerCase().includes(searchTerm) ||
          (product.tagline || '').toLowerCase().includes(searchTerm)
        );
      });
    }

    // Apply Specific Filters
    if (filter === 'newest') {
      filtered = filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (filter === 'sale') {
      filtered = filtered.filter(p => p.originalPrice && p.originalPrice > p.price);
    } else if (filter === 'featured') {
      const explicitlyFeatured = filtered.filter(p => p.featured);
      // If none are marked featured, fallback to all active (matches homepage logic)
      filtered = explicitlyFeatured.length > 0 ? explicitlyFeatured : filtered;
    }

    return filtered;
  }, [query, filter, products, categories]);

  useEffect(() => {
    let titleStr = t('searchResults');
    if (filter === 'newest') titleStr = t('newArrivals');
    if (filter === 'sale') titleStr = t('topDeals');
    if (filter === 'featured') titleStr = t('featuredCollection');
    if (query) titleStr = `${t('search')}: ${query}`;

    updateSEO({
      title: `${titleStr} | Sweeto Hubs`,
      description: `Browse ${titleStr.toLowerCase()} at Sweeto Hubs. Find the best electronics at the best prices.`,
      type: 'website'
    });

    if (query && logSearch) {
      logSearch(query, searchResults.length);
    }
  }, [query, filter, searchResults.length, logSearch]);

  const pageTitle = React.useMemo(() => {
    if (filter === 'newest') return t('newArrivals');
    if (filter === 'sale') return t('topDeals');
    if (filter === 'featured') return t('featuredCollection');
    return t('searchResults');
  }, [filter, t]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 transition-colors pb-20 overflow-x-hidden">
      
      {/* Cinematic Search Header */}
      <div className="relative w-full h-[300px] lg:h-[400px] bg-black overflow-hidden">
        {/* Background Art */}
        <div className="absolute inset-0 opacity-40">
          <img 
            src={getCategoryHeroImage(query || filter || 'search')} 
            alt="Search Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/20"></div>
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
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--primary-color)]">{t('collection')}</span>
            </div>
            
            <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              {pageTitle.split(' ')[0]} <span className="text-[var(--primary-color)]">{pageTitle.split(' ').slice(1).join(' ')}</span>
            </h1>
            
            <p className="mt-6 text-sm lg:text-lg text-gray-300 font-medium max-w-xl leading-relaxed opacity-80 border-l-2 border-white/10 pl-6 uppercase tracking-widest text-[10px]">
              {searchResults.length} {t('productsFound')} {query ? <>{t('for')} "{query}"</> : <>{t('inThisSet')}</>}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-none ml-0 px-4 lg:px-8 mt-12">
        {/* Results Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 p-8 bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/50 dark:border-slate-800/50 shadow-sm">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">{t('discoveryHub')}</h2>
            <div className="flex items-center gap-2">
               <span className="text-xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">
                 {t('filteredResults')}
               </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
              <Link to="/search" className="text-[10px] font-black uppercase tracking-widest bg-gray-50 dark:bg-slate-800 px-6 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                {t('resetFilter')}
              </Link>
          </div>
        </div>

        {/* Results Grid */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900/30 backdrop-blur-sm rounded-[4rem] border border-dashed border-gray-200 dark:border-slate-800">
            <div className="w-32 h-32 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 shadow-inner">
               <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 uppercase italic tracking-tighter">{t('noMatches')}</h3>
            <p className="text-gray-400 dark:text-slate-500 text-center max-w-sm font-bold uppercase tracking-widest text-[10px] mb-10 px-6">
              {t('noMatchesDesc')}
            </p>
            <Link to="/" className="bg-black dark:bg-white text-white dark:text-black px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:scale-105 transition-all shadow-2xl">
              {t('backToExplore')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;


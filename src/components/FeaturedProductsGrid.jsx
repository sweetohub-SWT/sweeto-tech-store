import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { useLocale } from '../contexts/LocaleContext';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import ProductCard from './ProductCard';

import SectionLayoutWrapper from './SectionLayoutWrapper';

const FeaturedProductsGrid = ({ title, isFirst, showVideoPromo, videoAdId }) => {
  const { products, categories, formatPrice, videoAds } = useStoreData();
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(0);

  const activeProducts = products.filter(p => p.status === 'active' && p.stockQuantity > 0);
  const featuredProducts = activeProducts.filter(p => p.featured === true);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : activeProducts;
  const saleProducts = displayProducts.filter(p => p.originalPrice && p.originalPrice > p.price);

  const tabCategories = categories.filter(c => !['Computers', 'Electronics', 'Accessories'].includes(c.name)).slice(0, 4);
  const tabs = [
    { id: 'all', label: t('all') || 'All' },
    ...tabCategories.map(c => ({ id: c.id.toString(), label: t(c.name.toLowerCase()) || c.name })),
    { id: 'sale', label: t('onSale') || 'On Sale' },
  ];

  const getFiltered = () => {
    if (activeTab === 'all') return activeProducts;
    if (activeTab === 'sale') return saleProducts;
    return activeProducts.filter(p => p.categoryId?.toString() === activeTab);
  };

  const filtered = getFiltered();
  
  // Dynamic perPage: 10 normally, 6 if video promo is active (2 rows of 3)
  const defaultPerPage = showVideoPromo ? 6 : 10;
  const [perPage, setPerPage] = React.useState(window.innerWidth < 768 ? 2 : defaultPerPage);

  React.useEffect(() => {
    const handleResize = () => setPerPage(window.innerWidth < 768 ? 2 : defaultPerPage);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showVideoPromo, defaultPerPage]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const visible = filtered.slice(page * perPage, page * perPage + perPage);

  if (!products || products.length === 0) return null;

  return (
    <section className={`w-full max-w-none ml-0 px-4 lg:px-8 ${isFirst ? 'pt-2' : 'mt-16'}`}>
      <SectionLayoutWrapper showVideoPromo={showVideoPromo} videoAdId={videoAdId}>
        {/* Header */}
        <div className="flex flex-col items-start text-left mb-10">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-6 mb-2">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
                {title === 'Featured Collection' || title === 'Featured Products' || !title ? (
                  <>{t('featuredProducts')} <span className="text-[var(--primary-color)]"></span></>
                ) : (
                  title
                )}
              </h2>
              <Link to="/search?filter=featured" className="text-[10px] font-black text-white uppercase tracking-[0.2em] hover:opacity-90 transition-opacity bg-[var(--primary-color)] px-4 py-1.5 rounded-full shadow-lg shadow-[rgba(var(--primary-rgb),0.2)]">
                {t('viewAll')}
              </Link>
            </div>
            <div className="w-16 h-1.5 bg-[var(--primary-color)] mt-1 mb-6 rounded-full"></div>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-11 h-11 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 hover:bg-[var(--primary-color)] hover:text-white hover:border-[var(--primary-color)] disabled:opacity-20 transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">{page + 1} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="w-11 h-11 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 hover:bg-[var(--primary-color)] hover:text-white hover:border-[var(--primary-color)] disabled:opacity-20 transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Layout: Products - 2 per line on mobile, Grid on Desktop */}
        <div className="w-full">
          <div className={`grid grid-cols-2 md:grid-cols-3 ${showVideoPromo ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-4 xl:grid-cols-5'} gap-3 sm:gap-4 w-full`}>
            {visible.map(product => (
              <ProductCard key={product.id} product={product} showBadge="none" />
            ))}

            {visible.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400 font-bold">
                {t('noProducts')}
              </div>
            )}
          </div>
        </div>
      </SectionLayoutWrapper>

      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </section>
  );
};

export default FeaturedProductsGrid;

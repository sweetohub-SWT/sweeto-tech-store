import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

import SectionLayoutWrapper from './SectionLayoutWrapper';

const TrendingProducts = ({ title, isFirst, showVideoPromo, videoAdId }) => {
  const { products } = useStoreData();
  const [page, setPage] = useState(0);

  const getFilteredProducts = () => {
    if (!products || products.length === 0) return [];
    return products.filter(p => p.status === 'active' && p.stockQuantity > 0 && p.trending === true);
  };

  const allTrending = getFilteredProducts();
  
  // Dynamic perPage: 5 normally, 3 if video promo is active
  const defaultPerPage = showVideoPromo ? 3 : 5;
  const [perPage, setPerPage] = React.useState(window.innerWidth < 768 ? 2 : defaultPerPage);

  React.useEffect(() => {
    const handleResize = () => setPerPage(window.innerWidth < 768 ? 2 : defaultPerPage);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showVideoPromo, defaultPerPage]);

  const totalPages = Math.ceil(allTrending.length / perPage);
  const visible = allTrending.slice(page * perPage, page * perPage + perPage);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={`w-full max-w-none ml-0 px-4 lg:px-8 ${isFirst ? 'pt-2' : 'mt-16'}`}>
      <SectionLayoutWrapper showVideoPromo={showVideoPromo} videoAdId={videoAdId}>
        {/* Header */}
        <div className="flex flex-col items-start text-left mb-10">
          <div className="flex flex-col items-start">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
              {title || <>Trending <span className="text-[var(--primary-color)]">Now</span></>}
            </h2>
            <div className="w-16 h-1.5 bg-[var(--primary-color)] mt-2 mb-6 rounded-full"></div>
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
        <div className={`grid grid-cols-2 md:grid-cols-3 ${showVideoPromo ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-4 xl:grid-cols-5'} gap-3 sm:gap-4 w-full`}>
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} showBadge="trending" />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/search" className="inline-flex items-center gap-2 bg-[var(--primary-color)] text-white px-8 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all hover:gap-4 shadow-xl shadow-[rgba(var(--primary-rgb),0.2)]">
            Discover More Products <ArrowRight size={16} />
          </Link>
        </div>
      </SectionLayoutWrapper>
    </section>
  );
};

export default TrendingProducts;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import SectionLayoutWrapper from './SectionLayoutWrapper';

const JustArrivedSection = ({ title, isFirst, showVideoPromo, videoAdId }) => {
  const { products } = useStoreData();
  const [page, setPage] = useState(0);

  const newProducts = [...products]
    .filter(p => p.status === 'active' && p.stockQuantity > 0 && p.newArrival === true);

  const [perPage, setPerPage] = React.useState(() => {
    if (window.innerWidth < 768) return 2;
    return showVideoPromo ? 3 : 5;
  });

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setPerPage(2);
      else setPerPage(showVideoPromo ? 3 : 5);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showVideoPromo]);

  const totalPages = Math.ceil(newProducts.length / perPage);
  const visible = newProducts.slice(page * perPage, page * perPage + perPage);

  if (newProducts.length === 0) return null;

  return (
    <section className={`w-full max-w-none ml-0 px-4 lg:px-8 ${isFirst ? 'pt-2' : 'mt-16'}`}>
      {/* Header */}
      <div className="flex flex-col items-start text-left mb-10">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-6 mb-2">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
              {title || <>New <span className="text-[var(--primary-color)]">Arrivals</span></>}
            </h2>
            <Link to="/search?filter=newest" className="text-[10px] font-black text-white uppercase tracking-[0.2em] hover:opacity-90 transition-opacity bg-[var(--primary-color)] px-4 py-1.5 rounded-full shadow-lg shadow-[rgba(var(--primary-rgb),0.2)]">
              VIEW ALL
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
      <SectionLayoutWrapper showVideoPromo={showVideoPromo} videoAdId={videoAdId}>
        <div className="pb-12 h-full">
          <div className={`grid grid-cols-2 md:grid-cols-3 ${showVideoPromo ? '' : 'lg:grid-cols-4 xl:grid-cols-5'} gap-3 sm:gap-4 w-full h-full`}>
            {visible.map(product => (
              <ProductCard key={product.id} product={product} showBadge="new" />
            ))}
          </div>
        </div>
      </SectionLayoutWrapper>
    </section>
  );
};

export default JustArrivedSection;

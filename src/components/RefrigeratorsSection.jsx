import React, { useMemo } from 'react';
import { useStoreData } from '../contexts/StoreDataContext';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

import SectionLayoutWrapper from './SectionLayoutWrapper';

const RefrigeratorsSection = ({ title, showVideoPromo, videoAdId }) => {
  const { products } = useStoreData();

  // Filter products for "Refrigerators" section ONLY if explicitly flagged
  const fridgeProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => p.refrigeratorsPlacement === true);
  }, [products]);

  // Only show if there are products
  if (fridgeProducts.length === 0) return null;

  return (
    <section className="w-full max-w-none ml-0 px-4 lg:px-8 py-12">
      <SectionLayoutWrapper showVideoPromo={showVideoPromo} videoAdId={videoAdId}>
        {/* Header */}
        <div className="flex flex-col items-start text-left mb-10">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-6 mb-2">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
                {title || <>Modern <span className="text-[var(--primary-color)]">Refrigerators</span></>}
              </h2>
              <Link to="/search?q=refrigerators" className="text-[10px] font-black text-white uppercase tracking-[0.2em] hover:opacity-90 transition-opacity bg-[var(--primary-color)] px-4 py-1.5 rounded-full shadow-lg shadow-[rgba(var(--primary-rgb),0.2)]">
                SHOP ALL
              </Link>
            </div>
            <div className="w-16 h-1.5 bg-[var(--primary-color)] mt-1 mb-6 rounded-full"></div>
            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.3em]">Smart Cooling Solutions For Your Home</p>
          </div>
        </div>

        {/* Layout: Products - 2 per line on mobile, Grid on Desktop */}
        <div className={`grid grid-cols-2 md:grid-cols-3 ${showVideoPromo ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-4 xl:grid-cols-5'} gap-3 sm:gap-4 w-full`}>
          {fridgeProducts.map(product => (
            <ProductCard key={product.id} product={product} showBadge="category" />
          ))}
        </div>
      </SectionLayoutWrapper>
    </section>
  );
};

export default RefrigeratorsSection;

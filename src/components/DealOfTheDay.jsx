import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { useLocale } from '../contexts/LocaleContext';
import { ChevronLeft, ChevronRight, Zap, PlayCircle } from 'lucide-react';
import ProductCard from './ProductCard';
import SectionLayoutWrapper from './SectionLayoutWrapper';

const DealOfTheDay = ({ title, isFirst, showVideoPromo, videoAdId }) => {
  const { products, videoAds, formatPrice } = useStoreData();
  const { t } = useLocale();
  const [page, setPage] = useState(0);

  // Get the most recent active video ad if no specific ID provided
  const activeVideoAd = videoAds && videoAds.length > 0
    ? [...videoAds].filter(ad => ad.isActive !== false && ad.videoUrl).reverse()[0]
    : null;

  // Final video ID to use: either from prop or the fallback active one
  const finalVideoId = videoAdId || activeVideoAd?.id;

  // Get all products with a discount or marked as dealOfDay, sorted by discount percentage
  const dealProducts = products
    .filter(p => p.status === 'active' && (p.stockQuantity > 0) && (p.dealOfDay || (p.originalPrice && p.originalPrice > p.price)))
    .sort((a, b) => {
      const discA = (a.originalPrice - a.price) / (a.originalPrice || 1);
      const discB = (b.originalPrice - b.price) / (b.originalPrice || 1);
      return discB - discA;
    });

  // For Deal of the Day, the video is permanent as per user request
  // We show 3 products to fill the remaining space on desktop
  const [perPage, setPerPage] = React.useState(window.innerWidth < 768 ? 2 : 3);

  React.useEffect(() => {
    const handleResize = () => setPerPage(window.innerWidth < 768 ? 2 : 3);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(dealProducts.length / perPage);
  const visible = dealProducts.slice(page * perPage, page * perPage + perPage);

  if (dealProducts.length === 0) return null;

  return (
    <section className={`w-full overflow-hidden ${isFirst ? 'pt-2' : 'mt-16'}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Editorial Header */}
        <div className="flex flex-col items-start text-left mb-10">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-6 mb-2">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
                {title === 'Deals of the Day' || title === 'Deal Of The Day' || !title ? (
                  <>{t('dealOfDay')} <span className="text-[var(--primary-color)]"></span></>
                ) : (
                  title
                )}
              </h2>
              <Link to="/search?filter=sale" className="text-[10px] font-black text-white uppercase tracking-[0.2em] hover:opacity-90 transition-opacity bg-[var(--primary-color)] px-4 py-1.5 rounded-full shadow-lg shadow-[rgba(var(--primary-rgb),0.2)]">
                {t('viewAll')}
              </Link>
            </div>
            <div className="w-16 h-1.5 bg-[var(--primary-color)] mt-1 mb-6 rounded-full"></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{t('dealsDesc')}</p>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-4 mt-4">
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

        {/* Video is permanent here as per user request */}
        <SectionLayoutWrapper showVideoPromo={true} videoAdId={finalVideoId}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
            {visible.map(product => (
              <ProductCard key={product.id} product={product} showBadge="deals" />
            ))}
          </div>
        </SectionLayoutWrapper>
      </div>
    </section>
  );
};

export default DealOfTheDay;

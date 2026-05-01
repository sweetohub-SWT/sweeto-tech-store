import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { useLocale } from '../contexts/LocaleContext';
import { Zap, PlayCircle } from 'lucide-react';

const VideoBanner = ({ title, isFirst }) => {
  const { products, videoAds, formatPrice } = useStoreData();
  const { t } = useLocale();

  // Pick the most recently added active video advert
  // We check for isActive !== false to include legacy ads that might not have the flag yet
  const activeVideoAd = videoAds && videoAds.length > 0
    ? [...videoAds].filter(ad => ad.isActive !== false && ad.videoUrl).reverse()[0]
    : null;

  // Spacing class
  const spacingClass = isFirst ? 'pt-4' : 'mt-12';

  if (!activeVideoAd) {
    // Show a beautiful glassmorphism placeholder instead of returning null
    // This helps the user see where the video banner is in the layout
    return (
      <section className={`w-full ${isFirst ? 'pt-0' : 'mt-0'}`}>
        <div className="relative w-full h-[300px] md:h-[400px] bg-gray-200 dark:bg-slate-900 flex flex-col items-center justify-center text-gray-400 dark:text-slate-600 gap-4">
          <PlayCircle size={48} className="opacity-20" />
          <p className="text-sm font-black uppercase tracking-widest opacity-40">No active video promotions</p>
        </div>
      </section>
    );
  }

  const linkedProduct = activeVideoAd.productId 
    ? products.find(p => p.id === activeVideoAd.productId)
    : null;

  return (
    <section className={`w-full ${isFirst ? 'pt-0' : 'mt-0'}`}>
      <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden bg-black shadow-2xl group">
        {activeVideoAd.type === 'image' ? (
          <img
            key={activeVideoAd.imageUrl}
            src={activeVideoAd.imageUrl}
            alt={activeVideoAd.title}
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-[3s]"
          />
        ) : (
          <video
            key={activeVideoAd.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            src={activeVideoAd.videoUrl}
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-[3s]"
          />
        )}
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-20 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center shadow-lg shadow-[var(--primary-color)]/20 border border-white/20">
               <Zap size={14} className="mr-2" fill="currentColor" /> {activeVideoAd.type === 'image' ? t('featuredProducts') : t('discovery')}
             </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1] mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] uppercase italic tracking-tighter">
            {activeVideoAd.title}
          </h2>

          <p className="text-white/80 text-sm md:text-lg mb-8 font-medium leading-relaxed max-w-2xl drop-shadow-md line-clamp-2 md:line-clamp-3">
            {activeVideoAd.description || (linkedProduct?.description ? (linkedProduct.description.length > 150 ? linkedProduct.description.substring(0, 150) + '...' : linkedProduct.description) : '')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mt-4">
            {linkedProduct ? (
              <>
                <Link
                  to={`/product/${linkedProduct.id}`}
                  className="bg-white text-black hover:bg-[var(--primary-color)] hover:text-white transition-all duration-500 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 group/btn hover:-translate-y-1 active:scale-95"
                >
                  {t('buyNow')}
                  <PlayCircle size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <div className="flex flex-col">
                  <span className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{t('startingAt')}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white text-3xl md:text-4xl font-black tracking-tighter">
                      {formatPrice(linkedProduct.price)}
                    </span>
                    {linkedProduct.originalPrice > linkedProduct.price && (
                      <span className="text-white/40 text-lg line-through font-bold">
                        {formatPrice(linkedProduct.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <button className="bg-white text-black px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 opacity-50 cursor-not-allowed">
                {t('limitedEdition')}
              </button>
            )}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-12 right-12 z-20 hidden lg:block">
           <div className="w-32 h-32 border-2 border-white/10 rounded-full flex items-center justify-center animate-spin-slow">
              <div className="w-24 h-24 border border-white/20 rounded-full flex items-center justify-center">
                 <div className="w-3 h-3 bg-[var(--primary-color)] rounded-full shadow-[0_0_15px_var(--primary-color)]" />
              </div>
           </div>
        </div>

        {/* Ambient light effect */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[var(--primary-color)]/20 rounded-full blur-[100px] pointer-events-none" />
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default VideoBanner;

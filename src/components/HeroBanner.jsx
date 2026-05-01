import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { useLocale } from '../contexts/LocaleContext';
import { ArrowRight, ShoppingCart, Star, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HeroBanner = () => {
  const { products, formatPrice, storeSettings } = useStoreData();
  const { t } = useLocale();
  const layout = storeSettings.heroLayout || 'slider';
  const heroBanners = storeSettings.heroBanners || [];

  // Get active products for fallbacks
  const activeProducts = products.filter(p => (p.status === 'active' || !p.status) && (p.stockQuantity > 0 || p.stockQuantity === undefined));
  
  // Featured products for the slider
  const featuredSliderProducts = activeProducts.slice(0, 5);

  const renderSlider = (isCompact = false) => (
    <Swiper
      modules={[Autoplay, Pagination, Navigation, EffectFade]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      speed={1000}
      loop={featuredSliderProducts.length >= 3}
      autoplay={featuredSliderProducts.length > 1 ? { delay: 6000, disableOnInteraction: false } : false}
      pagination={{ 
        clickable: true,
        el: isCompact ? '.compact-pagination' : '.custom-pagination'
      }}
      navigation={!isCompact ? {
        nextEl: '.hero-next',
        prevEl: '.hero-prev',
      } : false}
      className={`h-full w-full hero-swiper z-10 ${isCompact ? 'rounded-[32px]' : ''}`}
    >
      {featuredSliderProducts.length > 0 ? (
        featuredSliderProducts.map((product) => (
          <SwiperSlide key={product.id} className="h-full">
            <div className={`h-full w-full relative flex flex-col md:flex-row items-center px-6 ${isCompact ? 'lg:px-12' : 'lg:px-20'} max-w-[1600px] mx-auto overflow-hidden`}>
              
              {/* Background Decoration for Grid Mode */}
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-600 to-black overflow-hidden">
                <img 
                  src={product.image} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl scale-110"
                />
                <div className="absolute top-0 right-0 w-[80%] h-full bg-blue-500/10 skew-x-[-20deg] translate-x-[30%]"></div>
              </div>

              {/* Left Content */}
              <div className={`flex-1 z-20 text-left space-y-6 ${isCompact ? 'md:space-y-6' : 'md:space-y-8'} animate-in fade-in slide-in-from-left-8 duration-1000`}>
                <div className="flex items-center gap-2">
                  <span className={`${isCompact ? 'bg-white/10 text-white backdrop-blur-md' : 'bg-[#ff4d6d]/10 text-[#ff4d6d]'} px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center ${!isCompact ? 'border border-[#ff4d6d]/10 shadow-sm' : 'border border-white/10'}`}>
                    <Zap size={12} className="mr-2" fill="currentColor" /> {isCompact ? t('exclusiveDrop') : t('trendingNow')}
                  </span>
                </div>

                <h2 className={`${isCompact ? 'text-4xl md:text-5xl lg:text-6xl text-white' : 'text-4xl md:text-6xl lg:text-7xl text-[#2d3436] dark:text-white'} font-black leading-[0.95] tracking-tighter uppercase italic`}>
                  {product.name.split(' ')[0]} <br/>
                  <span className={`${isCompact ? 'text-blue-400' : 'text-blue-600'}`}>
                    {product.name.split(' ').slice(1).join(' ')}
                  </span>
                </h2>

                <p className={`${isCompact ? 'text-blue-100/60' : 'text-gray-500 dark:text-gray-400'} text-xs md:text-sm max-w-xs font-medium leading-relaxed line-clamp-2`}>
                  {product.tagline || t('heroDefaultTagline')}
                </p>

                <div className="flex items-center gap-6 pt-2">
                  <Link 
                    to={`/product/${product.id}`}
                    className={`${isCompact ? 'bg-white text-blue-900 shadow-xl shadow-white/10' : 'bg-[#1a1a1a] text-white'} px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all active:scale-95 group`}
                  >
                    {t('buyNow')}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                  </Link>
                </div>
              </div>

              {/* Right Image Container */}
              <div className="flex-1 relative h-full flex items-center justify-center lg:justify-end z-10 w-full">
                <div className="relative group/img animate-in fade-in zoom-in-95 duration-1000 delay-200 flex items-center justify-center w-full h-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-[280px] md:max-w-[400px] lg:max-w-[550px] max-h-[85%] w-auto h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.25)] group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {!isCompact && (
                    <div className="absolute top-[10%] right-[-10%] md:right-0 bg-white dark:bg-slate-900 w-24 h-24 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-[#fdf8f5] dark:border-slate-800 z-30 animate-bounce-slow">
                      <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{t('startingAt')}</span>
                      <span className="text-lg md:text-2xl font-black text-[#2d3436] dark:text-white tracking-tighter">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))
      ) : null}
    </Swiper>
  );

  const renderGridCard = (slotId, className) => {
    const banner = heroBanners.find(b => b.id === slotId);
    if (!banner || !banner.image) return (
      <div className={`${className} bg-slate-100 dark:bg-slate-900 rounded-[32px] flex items-center justify-center p-8`}>
        <div className="text-center">
           <Zap className="mx-auto text-slate-300 mb-2" size={32} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('featuredCollection')}</p>
        </div>
      </div>
    );

    return (
      <Link 
        to={banner.link || '#'} 
        className={`${className} group relative overflow-hidden rounded-[32px] flex flex-col p-8 transition-all hover:shadow-2xl hover:shadow-black/10`}
        style={{ background: banner.id === 'side1' ? 'linear-gradient(135deg, #a855f7 0%, #3b0764 100%)' : 'linear-gradient(135deg, #1e293b 0%, #020617 100%)' }}
      >
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10 space-y-2">
           <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.3em]">{t('newlyAdded')}</span>
           <h3 className="text-xl md:text-2xl font-black text-white italic uppercase leading-none">{banner.title}</h3>
           <div className="flex items-center gap-2 text-white/80 group-hover:gap-4 transition-all pt-2">
             <span className="text-[10px] font-bold uppercase tracking-widest border-b border-white/20 pb-1">{t('buyNow')}</span>
             <ArrowRight size={14} />
           </div>
        </div>

        <div className="absolute bottom-4 right-4 w-1/2 h-2/3 group-hover:scale-110 transition-transform duration-700">
          <img src={banner.image} alt={banner.title} className="w-full h-full object-contain drop-shadow-2xl" />
        </div>
      </Link>
    );
  };

  if (layout === 'grid') {
    return (
      <section className="w-full px-4 md:px-8 lg:px-12 py-6">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[650px]">
          {/* Main Large Slot */}
          <div className="lg:col-span-2 h-[450px] lg:h-full relative overflow-hidden rounded-[40px] shadow-2xl shadow-black/5 border border-gray-100 dark:border-slate-800">
            {renderSlider(true)}
            <div className="absolute bottom-10 left-12 z-40 compact-pagination flex items-center gap-2"></div>
          </div>

          {/* Right Column with 2 Stacked Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 h-auto lg:h-full">
             {renderGridCard('side1', 'h-[300px] lg:h-full')}
             {renderGridCard('side2', 'h-[300px] lg:h-full')}
          </div>
        </div>

        {/* Global Styles for Slider Pagination */}
        <style dangerouslySetInnerHTML={{
          __html: `
          .hero-swiper .compact-pagination .swiper-pagination-bullet { 
            width: 6px; height: 6px; background: #fff; opacity: 0.3; border-radius: 4px; transition: all 0.4s; margin: 0 !important;
          }
          .hero-swiper .compact-pagination .swiper-pagination-bullet-active { 
            width: 24px; background: #fff !important; opacity: 1; 
          }
        `}} />
      </section>
    );
  }

  // Default Slider Layout (Single)
  return (
    <section className="w-full mb-12 group/main relative">
      <div className="h-[400px] md:h-[500px] lg:h-[580px] w-full relative overflow-hidden bg-[#f0f7ff] transition-colors duration-500">
        
        {/* Background Decorative Sparkles & Gradient */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_70%_20%,#fff_0%,transparent_50%)] opacity-60"></div>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_80%,#e0f2fe_0%,transparent_50%)] opacity-80"></div>
        
        {/* Sparkle Pattern Overlay */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1.5px, transparent 1.5px)', backgroundSize: '100px 100px' }}></div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1000}
          loop={featuredSliderProducts.length >= 3}
          autoplay={featuredSliderProducts.length > 1 ? { delay: 6000, disableOnInteraction: false } : false}
          pagination={{ 
            clickable: true,
            el: '.hero-pagination'
          }}
          navigation={{
            nextEl: '.hero-next',
            prevEl: '.hero-prev',
          }}
          className="h-full w-full hero-swiper z-10"
        >
          {featuredSliderProducts.length > 0 ? (
            featuredSliderProducts.map((product) => (
              <SwiperSlide key={product.id} className="h-full">
                <div className="h-full w-full relative flex flex-col md:flex-row items-center px-6 lg:px-24 max-w-[1600px] mx-auto overflow-hidden">
                  {/* Dynamic Product Background */}
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <img 
                      src={product.image} 
                      alt="" 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain opacity-[0.07] scale-125 select-none"
                    />
                  </div>
                  
                  {/* Left Content */}
                  <div className="flex-1 z-20 text-left space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000 relative">
                    {/* Floating Decorative Element */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="space-y-4 relative">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20">
                          {t('dealOfTheWeek')}
                        </span>
                        <div className="h-[1px] w-12 bg-blue-200"></div>
                      </div>

                      <div className="space-y-1">
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#1a1a1a] leading-[0.95] tracking-tighter uppercase italic">
                          {product.name.split(' ')[0]} <br/>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            {product.name.split(' ').slice(1).join(' ')}
                          </span>
                        </h2>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-3xl md:text-4xl font-black text-blue-600 tracking-tighter">
                          {t('upToOff')}
                        </div>
                        <div className="text-gray-400 font-medium text-sm border-l border-gray-200 pl-4 py-1">
                          {product.tagline || t('limitedTimeEditorial')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <Link 
                        to={`/product/${product.id}`}
                        className="group relative inline-flex items-center gap-4 bg-[#1a1a1a] text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all hover:-translate-y-1 hover:shadow-blue-500/20 active:scale-95"
                      >
                        <span className="relative z-10">{t('buyNow')}</span>
                        <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-2" />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10"></div>
                      </Link>

                      <div className="hidden md:flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('startingAt')}</span>
                        <span className="text-xl font-black text-[#1a1a1a]">{formatPrice(product.price)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Image Container */}
                  <div className="flex-1 relative h-full flex items-center justify-center lg:justify-end z-10 w-full min-h-[250px] md:min-h-0">
                    <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200 flex items-center justify-center w-full h-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-w-[300px] md:max-w-[500px] lg:max-w-[750px] max-h-[92%] w-auto h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.25)]"
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : null}
        </Swiper>

        {/* Bottom Left Pagination */}
        <div className="absolute bottom-10 left-10 lg:left-24 z-40 hero-pagination flex items-center gap-3 pointer-events-auto"></div>

        {/* Edge Navigation Arrows */}
        <button className="hero-prev absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all opacity-0 group-hover/main:opacity-100">
          <ChevronLeft size={32} strokeWidth={1.5} />
        </button>
        <button className="hero-next absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all opacity-0 group-hover/main:opacity-100">
          <ChevronRight size={32} strokeWidth={1.5} />
        </button>

        {/* Global Styles for Pagination */}
        <style dangerouslySetInnerHTML={{
          __html: `
          .hero-swiper .hero-pagination .swiper-pagination-bullet { 
            width: 10px; height: 10px; background: #1a1a1a; opacity: 0.2; border-radius: 50%; transition: all 0.4s; margin: 0 !important;
          }
          .hero-swiper .hero-pagination .swiper-pagination-bullet-active { 
            background: #1a1a1a !important; opacity: 1; transform: scale(1.2);
          }
        `}} />
      </div>
    </section>
  );
};

export default HeroBanner;

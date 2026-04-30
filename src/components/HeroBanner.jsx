import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { ArrowRight, Clock } from 'lucide-react';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HeroBanner = () => {
  const { products, formatPrice } = useStoreData();

  const [timeLeft, setTimeLeft] = useState({ hrs: '08', min: '24', sec: '55' });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      setTimeLeft({
        hrs: String(23 - now.getHours()).padStart(2, '0'),
        min: String(59 - now.getMinutes()).padStart(2, '0'),
        sec: String(59 - now.getSeconds()).padStart(2, '0')
      });
    };
    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Get active products for the grid
  const activeProducts = products.filter(p => (p.status === 'active' || !p.status) && (p.stockQuantity > 0 || p.stockQuantity === undefined));

  // Featured products for the slider (top 5)
  const featuredSliderProducts = activeProducts.slice(0, 5);

  // Selecting secondary products (starting from index 5 to avoid duplication)
  const subProduct1 = activeProducts[5] || activeProducts[1] || { name: 'Featured Tech', price: 0, image: '', id: '' };
  const subProduct2 = activeProducts[6] || activeProducts[2] || { name: 'New Arrival', price: 0, image: '', id: '' };

  return (
    <section className="w-full">
      <div className="min-h-[480px] lg:h-[500px] xl:h-[600px] w-full">

        {/* Main Banner Slider - Full Width edge to edge */}
        <div className="group relative overflow-hidden bg-white dark:bg-black shadow-2xl h-full transition-colors duration-500">
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={1200}
            loop={featuredSliderProducts.length >= 3}
            autoplay={featuredSliderProducts.length > 1 ? { delay: 7000, disableOnInteraction: false } : false}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: '.hero-next',
              prevEl: '.hero-prev',
            }}
            className="h-full w-full hero-swiper"
          >
            {featuredSliderProducts.length > 0 ? (
              featuredSliderProducts.map((product) => (
                <SwiperSlide key={product.id} className="h-full">
                  <Link to={`/product/${product.id}`} className="block h-full w-full relative group/slide">
                    {/* Minimalist Background */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#000000] dark:via-[#0a0a0a] dark:to-[#000000]"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[var(--primary-color)]/5 dark:bg-white/5 rounded-full blur-[120px] animate-pulse"></div>
                    </div>

                    <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 lg:px-20 max-w-[1800px] mx-auto py-10 lg:py-0">

                      {/* Side Decorative Image (Visible on Large Desktops) */}
                      <div className="hidden 2xl:block absolute left-[-80px] top-1/2 -translate-y-1/2 w-[350px] opacity-10 grayscale rotate-[-15deg] pointer-events-none transition-all duration-1000 group-hover/slide:rotate-[-5deg] group-hover/slide:opacity-20">
                        <img src={product.image} alt="" className="w-full h-auto object-contain" />
                      </div>

                      {/* Main Content Area */}
                      <div className="text-center lg:text-left z-20 max-w-2xl flex-1 order-2 lg:order-1 mt-8 lg:mt-0">
                        <span className="slide-content-badge text-[var(--primary-color)] text-[10px] lg:text-[13px] font-black uppercase tracking-[0.4em] mb-3 lg:mb-6 block">
                          Premium Selection
                        </span>

                        <h2 className="slide-content-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[1.05] mb-4 lg:mb-6 tracking-tighter">
                          {product.name}
                        </h2>

                        <p className="slide-content-desc text-gray-500 dark:text-gray-400 text-sm lg:text-xl mb-8 lg:mb-10 font-medium tracking-tight max-w-xl mx-auto lg:mx-0">
                          {product.tagline || 'Experience the future of performance and design with our latest innovations.'}
                        </p>

                        <div className="slide-content-btn flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 lg:gap-12">
                          <div className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-10 lg:px-14 py-4 lg:py-5 rounded-full font-black uppercase text-[11px] lg:text-xs tracking-[0.25em] hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl">
                            View Product
                          </div>
                          <div className="flex flex-col items-center lg:items-start">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Price</span>
                            <span className="text-2xl lg:text-3xl font-black text-[var(--primary-color)] tracking-tighter">{formatPrice(product.price)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Image (Main Focus) */}
                      <div className="relative flex-1 flex justify-center items-center order-1 lg:order-2 w-full lg:w-auto h-[250px] sm:h-[300px] lg:h-full">
                        <div className="relative group-hover/slide:scale-110 transition-transform duration-1000 ease-out h-full flex items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[550px] max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                          />

                          {/* Only show real discount badge if product has an actual originalPrice */}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="absolute top-0 right-0 lg:top-1/2 lg:-right-12 lg:-translate-y-1/2 w-20 h-20 lg:w-36 lg:h-36 bg-red-600 rounded-full flex flex-col items-center justify-center text-white shadow-2xl rotate-12 group-hover/slide:rotate-0 transition-transform duration-700 border-[6px] border-white dark:border-slate-900 z-30">
                              <span className="text-[9px] lg:text-xs font-black uppercase tracking-widest mb-1">Save</span>
                              <span className="text-lg lg:text-4xl font-black">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide className="h-full bg-gray-50 dark:bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Loading Premiere...</h2>
                </div>
              </SwiperSlide>
            )}
          </Swiper>

          {/* Custom Navigation */}
          <button className="hero-prev absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex items-center justify-center text-gray-900 dark:text-white shadow-2xl transition-all hover:bg-[var(--primary-color)] hover:text-white border border-white/20 dark:border-slate-800 opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0 active:scale-90">
            <ArrowRight className="rotate-180" size={28} strokeWidth={2.5} />
          </button>
          <button className="hero-next absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex items-center justify-center text-gray-900 dark:text-white shadow-2xl transition-all hover:bg-[var(--primary-color)] hover:text-white border border-white/20 dark:border-slate-800 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 active:scale-90">
            <ArrowRight size={28} strokeWidth={2.5} />
          </button>

          <style dangerouslySetInnerHTML={{
            __html: `
            .hero-swiper .swiper-slide-active .slide-content-badge { animation: slideUp 0.8s ease-out forwards; }
            .hero-swiper .swiper-slide-active .slide-content-title { animation: slideUp 0.8s ease-out 0.1s forwards; opacity: 0; }
            .hero-swiper .swiper-slide-active .slide-content-desc { animation: slideUp 0.8s ease-out 0.2s forwards; opacity: 0; }
            .hero-swiper .swiper-slide-active .slide-content-btn { animation: slideUp 0.8s ease-out 0.3s forwards; opacity: 0; }
            
            .hero-swiper .swiper-pagination { bottom: 40px !important; }
            .hero-swiper .swiper-pagination-bullet { background: #000; width: 6px; height: 6px; opacity: 0.1; transition: all 0.4s; }
            .dark .hero-swiper .swiper-pagination-bullet { background: #fff; }
            .hero-swiper .swiper-pagination-bullet-active { background: var(--primary-color) !important; width: 40px; opacity: 1; border-radius: 4px; }
          `}} />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        /* Professional Pulse Logic */
        @keyframes pulseGlow {
          0% { transform: scale(0.95); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.6; }
          100% { transform: scale(0.95); opacity: 0.3; }
        }
        .pulse-glow { animation: pulseGlow 3s infinite ease-in-out; }

        @keyframes bounceX {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x { animation: bounceX 1.5s infinite; }

        /* General Professional Refinements */
        .hero-swiper .swiper-pagination-bullet { width: 8px; height: 8px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .hero-swiper .swiper-pagination-bullet-active { width: 32px; background: var(--primary-color) !important; border-radius: 4px; }
      `}} />
    </section>
  );
};

export default HeroBanner;

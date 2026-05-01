import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { useLocale } from '../contexts/LocaleContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ShopByCategory = ({ title }) => {
  const { categories, products } = useStoreData();
  const { t } = useLocale();

  const categoryData = React.useMemo(() => {
    // Get categories explicitly marked for homepage
    const homeCats = categories
      .filter(c => c.showOnHome === true)
      .sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map(cat => {
        const catProducts = products.filter(
          p => p.status === 'active' && (p.categoryId?.toString() === cat.id?.toString() || p.department === cat.name)
        );
        return {
          name: cat.name,
          image: cat.image || (catProducts[0]?.image || ''),
          link: `/category/${encodeURIComponent(cat.parentCategory || cat.name)}`,
        };
      });

    if (homeCats.length > 0) return homeCats;

    // Fallback: Use all categories if none marked
    return categories.slice(0, 10).map(cat => ({
      name: cat.name,
      image: cat.image || '',
      link: `/category/${encodeURIComponent(cat.name)}`,
    }));
  }, [categories, products]);

  if (categoryData.length === 0) return null;

  return (
    <section className="w-full relative py-16 bg-[#f8fafc] overflow-hidden group/main">
      {/* Subtle Tech Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{t('categories')}</h2>
          <div className="h-px flex-1 mx-8 bg-slate-200 hidden md:block"></div>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={3.2}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            navigation={{
              nextEl: '.cat-next',
              prevEl: '.cat-prev',
            }}
            breakpoints={{
              640: { slidesPerView: 4.2, spaceBetween: 24 },
              768: { slidesPerView: 5.2, spaceBetween: 32 },
              1024: { slidesPerView: 7.2, spaceBetween: 40 },
              1440: { slidesPerView: 8.2, spaceBetween: 48 }
            }}
            className="category-swiper !pb-12 !pt-4"
          >
            {categoryData.map((cat, index) => (
              <SwiperSlide key={index}>
                <Link to={cat.link} className="flex flex-col items-center group">
                  {/* Premium Circular Container */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mb-4 group">
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>
                    
                    {/* Main Circle */}
                    <div className="relative w-full h-full bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center p-5 sm:p-6 transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group-hover:-translate-y-3 border border-slate-100 overflow-hidden">
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                  </div>

                  {/* Refined Label */}
                  <span className="text-[10px] sm:text-[12px] font-bold text-slate-600 uppercase tracking-wider text-center group-hover:text-blue-600 transition-colors duration-300">
                    {t(cat.name.toLowerCase()) || cat.name}
                  </span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Elegant Minimalist Navigation */}
      <button className="cat-prev absolute left-4 lg:left-12 top-[55%] -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all opacity-0 group-hover/main:opacity-100 hover:scale-110 border border-slate-100">
        <ChevronLeft size={20} />
      </button>
      
      <button className="cat-next absolute right-4 lg:right-12 top-[55%] -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all opacity-0 group-hover/main:opacity-100 hover:scale-110 border border-slate-100">
        <ChevronRight size={20} />
      </button>

    </section>
  );
};

export default ShopByCategory;

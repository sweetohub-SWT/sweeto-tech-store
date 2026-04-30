import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ShopByCategory = ({ title, isFirst }) => {
  const { categories, products } = useStoreData();
  const scrollRef = useRef(null);

  // Build category data with product images and counts
  const DEPARTMENTS = ['Computers', 'Electronics', 'Accessories'];

  const categoryData = React.useMemo(() => {
    // 1. Get categories explicitly marked for homepage
    const homeCats = categories
      .filter(c => c.showOnHome === true)
      .sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map(cat => {
        const catProducts = products.filter(
          p => p.status === 'active' && (p.categoryId?.toString() === cat.id?.toString() || p.department === cat.name)
        );
        return {
          name: cat.name,
          count: catProducts.length,
          image: cat.image || (catProducts[0]?.image || ''),
          link: `/category/${encodeURIComponent(cat.parentCategory || cat.name)}`,
        };
      });

    if (homeCats.length > 0) return homeCats;

    // 2. Fallback: Old auto-discovery logic if nothing is selected
    const DEPARTMENTS = ['Computers', 'Electronics', 'Accessories'];
    const allCats = [];

    DEPARTMENTS.forEach(dept => {
      const deptProducts = products.filter(
        p => p.status === 'active' && p.department === dept
      );
      if (deptProducts.length > 0) {
        allCats.push({
          name: dept,
          count: deptProducts.length,
          image: deptProducts[0]?.image || '',
          link: `/category/${encodeURIComponent(dept)}`,
        });
      }
    });

    categories.forEach(cat => {
      if (DEPARTMENTS.includes(cat.name)) return;
      const catProducts = products.filter(
        p => p.status === 'active' && (p.categoryId?.toString() === cat.id?.toString())
      );
      if (catProducts.length > 0) {
        allCats.push({
          name: cat.name,
          count: catProducts.length,
          image: catProducts[0]?.image || '',
          link: `/category/${encodeURIComponent(cat.department || cat.name)}`,
        });
      }
    });

    return allCats;
  }, [categories, products]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8; // Scroll 80% of visible area
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (categoryData.length === 0) return null;

  return (
    <section className={`w-full max-w-none ml-0 px-4 lg:px-8 ${isFirst ? 'pt-2' : 'mt-16'}`}>
      {/* Header */}
      <div className="flex flex-col items-start text-left mb-10">
        <h2 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
          {title || <>Top <span className="text-[var(--primary-color)]">Categories</span></>}
        </h2>
        <div className="w-20 h-1.5 bg-[var(--primary-color)] mt-2 rounded-full"></div>
      </div>

      {/* Slider Container */}
      <div className="relative px-4 sm:px-8 group/slider">
        {/* Navigation Arrows - Floating on Sides */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 dark:bg-slate-900/90 border border-gray-100 dark:border-slate-800 shadow-xl flex items-center justify-center text-gray-900 dark:text-white hover:bg-[var(--primary-color)] hover:text-white hover:border-[var(--primary-color)] transition-all opacity-0 group-hover/slider:opacity-100 -translate-x-4 group-hover/slider:translate-x-2 hidden sm:flex"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 dark:bg-slate-900/90 border border-gray-100 dark:border-slate-800 shadow-xl flex items-center justify-center text-gray-900 dark:text-white hover:bg-[var(--primary-color)] hover:text-white hover:border-[var(--primary-color)] transition-all opacity-0 group-hover/slider:opacity-100 translate-x-4 group-hover/slider:-translate-x-2 hidden sm:flex"
        >
          <ChevronRight size={24} />
        </button>

        {/* Scrollable Category Strip */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 hide-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {categoryData.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="flex-none w-[calc((100%-1rem)/2.2)] sm:w-[calc((100%-2rem)/3)] md:w-[calc((100%-3rem)/4)] lg:w-[calc((100%-4rem)/5)] group text-center snap-start"
            >
              {/* Image Container */}
              <div className="w-full aspect-square bg-white dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center p-6 mb-4 border border-gray-100 dark:border-slate-800 shadow-sm group-hover:shadow-2xl group-hover:shadow-[var(--primary-color)]/10 group-hover:border-[var(--primary-color)]/30 transition-all duration-500 overflow-hidden relative">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-300">
                    <span className="font-black text-3xl">{cat.name.charAt(0)}</span>
                  </div>
                )}
                
                {/* Overlay Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary-color)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Category Name */}
              <h3 className="text-[13px] sm:text-[15px] font-black text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-[var(--primary-color)] transition-colors line-clamp-1 uppercase tracking-tight px-1">
                {cat.name}
              </h3>

              {/* Product Count Tag */}
              <div className="inline-flex items-center px-4 py-1 bg-gray-100/80 dark:bg-slate-800/80 rounded-full backdrop-blur-sm border border-transparent group-hover:border-[var(--primary-color)]/20 transition-all">
                <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold uppercase tracking-[0.1em]">
                  {cat.count} {cat.count === 1 ? 'Item' : 'Items'}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Indicator - Pulse */}
        <div className="flex sm:hidden justify-center gap-1.5 mt-2">
          <div className="w-8 h-1 bg-[var(--primary-color)] rounded-full"></div>
          <div className="w-2 h-1 bg-gray-200 dark:bg-slate-800 rounded-full"></div>
          <div className="w-2 h-1 bg-gray-200 dark:bg-slate-800 rounded-full"></div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default ShopByCategory;

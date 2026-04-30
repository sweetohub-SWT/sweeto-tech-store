import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Tv, 
  Speaker, 
  Tablet, 
  Headphones, 
  Watch, 
  Smartphone, 
  Laptop, 
  Monitor,
  ChevronRight,
  Boxes
} from 'lucide-react';
import { useStoreData } from '../contexts/StoreDataContext';

const iconMap = {
  'tv': Tv,
  'speaker': Speaker,
  'tablet': Tablet,
  'headphones': Headphones,
  'watch': Watch,
  'smartphone': Smartphone,
  'laptop': Laptop,
  'computer': Monitor,
};

const TopCategories = () => {
  const { categories, products } = useStoreData();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="max-w-[1400px] mx-auto px-4 overflow-hidden">
      {/* Editorial Section Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="relative">
          <div className="flex items-center gap-4 text-[var(--primary-color)] font-black text-xs uppercase tracking-[0.3em] mb-4">
            <span className="opacity-40">01 /</span>
            <span>Digital Universe</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
            Explore <span className="text-[var(--primary-color)]">Categories</span>
          </h2>
          <div className="h-1 w-20 bg-[var(--primary-color)] mt-6 rounded-full"></div>
        </div>
        
        <Link to="/categories" className="group flex items-center gap-4 bg-slate-50 border border-slate-200 px-8 py-4 rounded-2xl text-slate-900 font-black text-sm uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 shadow-sm active:scale-95">
          View Collections <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
      
      {/* Professional Horizontal Scroll on Mobile / Grid on Desktop */}
      <div className="flex md:grid md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 overflow-x-auto md:overflow-visible pb-10 md:pb-0 hide-scrollbar snap-x snap-mandatory">
        {categories.map((category) => {
          const IconComponent = iconMap[category.icon] || Tv;
          const itemCount = products ? products.filter(p => p.categoryId && p.categoryId.toString() === category.id.toString()).length : 0;

          return (
            <Link
              key={category.id}
              to={`/category/${encodeURIComponent(category.name)}`}
              className="group relative flex-none w-[200px] md:w-auto h-[280px] md:h-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--primary-color)]/10 hover:-translate-y-4 hover:border-[var(--primary-color)]/30 snap-center overflow-hidden"
            >
              {/* Mesh Gradient Background Effect (Hover) */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,var(--primary-color)_0%,transparent_70%)]"></div>
              
              {/* Floating SKU Badge */}
              <div className="absolute top-6 right-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                <span className="bg-slate-900 text-white text-[8px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-widest shadow-xl">
                  {itemCount} SKUS
                </span>
              </div>

              {/* Glassmorphic Sphere Container */}
              <div className="relative w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-700 group-hover:scale-110">
                <div className="absolute inset-0 rounded-full bg-slate-50 dark:bg-slate-950 transition-all duration-700 group-hover:bg-[var(--primary-color)]/5 group-hover:rotate-45 group-hover:rounded-[2rem]"></div>
                
                {/* Inner Glow Lens */}
                <div className="absolute inset-2 rounded-full border border-slate-200/50 group-hover:border-[var(--primary-color)]/20 group-hover:animate-pulse"></div>
                
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="relative z-10 w-12 h-12 object-contain filter drop-shadow-xl transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <IconComponent size={36} className="relative z-10 text-slate-400 group-hover:text-[var(--primary-color)] transition-all duration-500 group-hover:translate-y-[-2px]" />
                )}
              </div>
              
              <div className="relative z-10">
                <h3 className="font-black text-slate-900 text-base tracking-tight mb-2 group-hover:text-[var(--primary-color)] transition-colors">
                  {category.name}
                </h3>
                <div className="h-0.5 w-0 group-hover:w-8 bg-[var(--primary-color)] mx-auto transition-all duration-500 rounded-full"></div>
                
                <p className="mt-3 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 group-hover:text-slate-600 transition-colors">
                  {itemCount} {itemCount === 1 ? 'Product' : 'Products'}
                </p>
              </div>

              {/* Subliminal Brand Accent */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-[var(--primary-color)] rounded-t-full translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </Link>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
};

export default TopCategories;

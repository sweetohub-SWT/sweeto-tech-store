import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { ArrowRight } from 'lucide-react';

const CategoryBanners = () => {
  const { categories, products, formatPrice } = useStoreData();

  // Pick up to 3 categories that have products
  const bannerCategories = categories
    .filter(cat => products.some(p => p.categoryId?.toString() === cat.id?.toString() && p.status === 'active'))
    .slice(0, 3);

  if (bannerCategories.length === 0) return null;

  const gradients = [
    'bg-white dark:bg-slate-900',
    'from-purple-50 to-pink-100 dark:from-slate-800 dark:to-slate-900',
    'from-amber-50 to-orange-100 dark:from-slate-800 dark:to-slate-900',
  ];

  const textColors = [
    'text-[var(--primary-color)]',
    'text-purple-700 dark:text-purple-400',
    'text-amber-700 dark:text-amber-400',
  ];

  const buttonColors = [
    'bg-[var(--primary-color)] hover:opacity-90',
    'bg-purple-600 hover:bg-purple-700',
    'bg-amber-600 hover:bg-amber-700',
  ];

  return (
    <section className="w-full max-w-[1400px] mx-auto px-2 sm:px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 overflow-hidden">
        {bannerCategories.map((cat, i) => {
          // Pick first product image from this category as the banner visual
          const catProduct = products.find(p => p.categoryId?.toString() === cat.id?.toString() && p.status === 'active' && p.image);
          const minPrice = products
            .filter(p => p.categoryId?.toString() === cat.id?.toString() && p.status === 'active')
            .reduce((min, p) => (p.price < min ? p.price : min), Infinity);

          return (
            <Link
              key={cat.id}
              to={`/category/${encodeURIComponent(cat.name)}`}
              className={`group flex items-center justify-between bg-gradient-to-br ${gradients[i]} rounded-2xl px-6 py-5 border border-white/50 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative`}
            >
              {/* Decorative circle */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/30 dark:bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-500" />

              {/* Text side */}
              <div className="relative z-10">
                <p className={`text-xs font-black uppercase tracking-widest mb-1 ${textColors[i]}`}>
                  {cat.name}
                </p>
                {minPrice !== Infinity && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">From {formatPrice(minPrice)}</p>
                )}
                <div className={`mt-3 inline-flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full transition-colors shadow-sm ${buttonColors[i]}`}>
                  Shop Now <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Image side */}
              {catProduct?.image && (
                <img
                  src={catProduct.image}
                  alt={cat.name}
                  className="h-20 w-24 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg"
                />
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryBanners;

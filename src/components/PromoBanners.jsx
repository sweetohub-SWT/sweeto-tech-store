import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';

const PromoBanners = () => {
  const { products, formatPrice } = useStoreData();

  // Predefined premium pastel backgrounds to match the design
  const bgColors = [
    'bg-[#f2efe9] dark:bg-slate-800', // Beige
    'bg-[#f4ebeb] dark:bg-slate-800', // Pale Pink
    'bg-[#ebf0f4] dark:bg-slate-800', // Light Grey/Blue
    'bg-[#f4f4f4] dark:bg-slate-800', // Light Grey
    'bg-[#eef2f6] dark:bg-slate-800', // Pale Blue
    'bg-[#f0eff4] dark:bg-slate-800', // Pale Purple
  ];

  // Get up to 6 active products
  const activeProducts = products.filter(p => p.status === 'active' && p.stockQuantity > 0).slice(0, 6);

  if (activeProducts.length === 0) {
    return null; // Do not render if there are no products
  }

  return (
    <section className="py-8 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProducts.map((product, index) => {
            const bgClass = bgColors[index % bgColors.length];
            const isButton = index % 2 === 0;

            return (
              <div
                key={product.id}
                className={`${bgClass} rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-between h-[340px] group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-transparent dark:border-slate-700`}
              >
                {/* Product Image */}
                <div className="absolute right-[-10%] bottom-[-5%] w-[65%] h-[65%] transition-transform duration-500 group-hover:scale-105 z-0 flex items-center justify-center opacity-90 dark:opacity-80">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain filter drop-shadow-xl"
                    />
                  ) : null}
                </div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col h-full items-start">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-3 block">
                      FEATURED
                    </span>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white leading-tight mb-4 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                      From {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className="mt-auto">
                    {isButton ? (
                      <Link
                        to={`/product/${product.id}`}
                        className="inline-block bg-[var(--primary-color)] hover:opacity-90 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors shadow-sm"
                      >
                        Buy Now
                      </Link>
                    ) : (
                      <Link
                        to={`/product/${product.id}`}
                        className="inline-block text-gray-900 dark:text-white text-sm font-medium pb-0.5 border-b-2 border-gray-900 dark:border-white hover:text-[var(--primary-color)] hover:border-[var(--primary-color)] dark:hover:text-[var(--primary-color)] dark:hover:border-[var(--primary-color)] transition-colors"
                      >
                        Learn More
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;


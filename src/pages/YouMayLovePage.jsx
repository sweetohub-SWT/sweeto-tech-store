import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import ProductCard from '../components/ProductCard';
import { Heart, Sparkles, ChevronLeft } from 'lucide-react';

const YouMayLovePage = () => {
  const { products } = useStoreData();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const sourceProductId = queryParams.get('from');

  // Filter products based on category, excluding the source product
  const recommendedProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = products;
    if (category) {
      filtered = products.filter(p => p.category === category && p.id !== sourceProductId);
    }
    
    // If we don't have enough similar items, add some featured ones
    if (filtered.length < 5) {
      const otherFeatured = products.filter(p => p.featured && p.id !== sourceProductId && !filtered.find(f => f.id === p.id));
      filtered = [...filtered, ...otherFeatured];
    }
    
    return filtered.slice(0, 15);
  }, [products, category, sourceProductId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-20">
      {/* Premium Header */}
      <div className="relative h-[300px] w-full flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
        </div>

        <div className="relative z-10 text-center px-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-500 rounded-2xl shadow-2xl shadow-red-500/20 animate-bounce">
              <Heart className="text-white fill-current" size={32} />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-2">
            You May <span className="text-red-500 underline decoration-white/20 underline-offset-8">Love</span>
          </h1>
          <p className="text-gray-300 font-bold uppercase tracking-[0.4em] text-xs md:text-sm flex items-center justify-center gap-2">
            <Sparkles size={14} className="text-red-500" />
            Curated Recommendations For You
          </p>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 -mt-12 relative z-20">
        {/* Navigation / Back */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black dark:text-slate-400 dark:hover:text-white transition-colors group"
          >
            <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-md group-hover:-translate-x-1 transition-transform">
              <ChevronLeft size={14} />
            </div>
            Back to Shop
          </Link>
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            {recommendedProducts.length} Items Found
          </div>
        </div>

        {/* Product Grid */}
        {recommendedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {recommendedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-dashed border-gray-200 dark:border-slate-800">
            <div className="max-w-md mx-auto">
              <Sparkles className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Finding Your Matches...</h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm">We're looking for products you'll love. Try exploring our latest arrivals in the meantime!</p>
              <Link to="/" className="inline-block mt-6 px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform">
                Start Exploring
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouMayLovePage;

import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { ShoppingCart, Eye, Star, Heart, MessageCircle } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

const FeaturedProducts = () => {
  const { products, formatPrice } = useStoreData();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const featuredProducts = products.filter(product => product.status === 'active' && product.stockQuantity > 0 && product.featured === true);

  if (!products || products.length === 0 || featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-[1400px] mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Featured Products</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Our handpicked selection for you</p>
        </div>
        <div className="h-[2px] flex-1 bg-slate-100 mx-8 hidden md:block"></div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-black uppercase tracking-widest text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]">New Arrivals</button>
          <button className="px-4 py-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">Best Sellers</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {featuredProducts.map((product) => (
          <div key={product.id} className="group flex flex-col bg-[var(--bg-secondary)] rounded-3xl overflow-hidden border border-[var(--border-color)] transition-all duration-500 hover:shadow-2xl hover:shadow-[rgba(var(--primary-rgb),0.1)] hover:-translate-y-1">
            {/* Product Image Wrapper */}
            <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-black p-6">
              <Link to={`/product/${product.id}`} className="block h-full w-full">
                <div className="image-straight">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </Link>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg animate-pulse">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
                {product.badge && (
                  <span className="bg-[var(--primary-color)] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                    {product.badge}
                  </span>
                )}
                {product.rating > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-black text-slate-700">{product.rating}</span>
                  </div>
                )}
              </div>

              {/* Quick Actions (Floating Circles like requested) */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                <button 
                  onClick={() => {
                    toggleWishlist(product);
                    if (!isInWishlist(product.id)) showToast(`Added ${product.name} to wishlist`);
                  }}
                  className={`w-10 h-10 shadow-lg rounded-full flex items-center justify-center transition-all duration-300 ${
                    isInWishlist(product.id) 
                      ? 'bg-red-500 text-white border-red-500 shadow-red-500/30' 
                      : 'bg-white text-slate-900 border-white hover:bg-[var(--primary-color)] hover:text-white dark:bg-slate-800 dark:text-white'
                  }`}
                >
                  <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                </button>
                <button 
                  onClick={() => {
                    addToCart(product);
                    showToast(`Added ${product.name} to cart`);
                  }}
                  className="w-10 h-10 bg-white dark:bg-slate-800 shadow-lg rounded-full flex items-center justify-center text-slate-900 dark:text-white hover:bg-[var(--primary-color)] hover:text-white transition-all duration-300"
                >
                  <ShoppingCart size={18} />
                </button>
                <WhatsAppButton product={product} iconOnly={true} />
                <Link 
                  to={`/product/${product.id}`}
                  className="w-10 h-10 bg-white dark:bg-slate-800 shadow-lg rounded-full flex items-center justify-center text-slate-900 dark:text-white hover:bg-[var(--primary-color)] hover:text-white transition-all duration-300"
                >
                  <Eye size={18} />
                </Link>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 flex flex-col flex-1">
              <div className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {product.tagline || 'Electronics'}
              </div>
              <Link to={`/product/${product.id}`} className="block text-sm font-black text-slate-900 dark:text-white mb-2 line-clamp-2 hover:text-[var(--primary-color)] transition-colors tracking-tight leading-snug">
                {product.name}
              </Link>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex flex-col">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-[10px] font-bold text-slate-400 line-through mb-0.5">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-lg font-black text-[var(--primary-color)]">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  In Stock
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;


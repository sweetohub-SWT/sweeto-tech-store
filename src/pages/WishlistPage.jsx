import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { useStoreData } from '../contexts/StoreDataContext';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Eye, ChevronLeft } from 'lucide-react';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { formatPrice } = useStoreData();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    showToast(`Moved ${product.name} to cart`);
  };

  return (
    <div className="py-8 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[var(--primary-color)] mb-6 transition-colors font-bold group bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm w-fit"
          >
            <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </button>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Your Wishlist</h1>
            <p className="text-gray-500 dark:text-gray-400 flex items-center">
              <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold mr-2">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
              </span>
              saved to your sanctuary
            </p>
          </div>
        </div>

        {/* Wishlist Content */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <div 
                key={product.id} 
                className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-slate-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-slate-900/90 text-red-500 rounded-full flex items-center justify-center shadow-sm hover:bg-red-500 hover:text-white transition-all transform active:scale-95 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-[var(--primary-color)] font-mono font-black text-lg mb-4">
                    {formatPrice(product.price)}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="flex items-center justify-center gap-2 bg-[var(--primary-color)] hover:opacity-90 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-[var(--primary-color)]/20 dark:shadow-none"
                    >
                      <ShoppingCart size={14} />
                      Move to Cart
                    </button>
                    <Link
                      to={`/product/${product.id}`}
                      className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 py-2 rounded-xl text-xs font-bold hover:bg-gray-100 dark:hover:bg-slate-700 transition-all border border-gray-100 dark:border-slate-700"
                    >
                      <Eye size={14} />
                      View Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 shadow-sm transition-all">
            <div className="text-gray-300 dark:text-slate-800 mb-8 flex justify-center">
              <div className="p-8 bg-gray-50 dark:bg-slate-950 rounded-full relative">
                <Heart size={80} strokeWidth={1} />
                <div className="absolute top-0 right-0 w-8 h-8 bg-red-500 rounded-full border-4 border-white dark:border-slate-900 animate-ping" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 italic">Your sanctuary is empty</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto text-lg font-medium">
              Find items you love and save them here for later discovery.
            </p>
            <Link
              to="/"
              className="bg-[var(--primary-color)] hover:opacity-90 text-white px-10 py-5 rounded-2xl font-black transition-all shadow-xl shadow-[var(--primary-color)]/30 hover:-translate-y-1 inline-block uppercase tracking-widest text-sm"
            >
              Start Dreaming
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;

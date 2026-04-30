import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useStoreData } from '../contexts/StoreDataContext';
import { X, Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WishlistDrawer = () => {
  const { isWishlistOpen, closeWishlist, wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useStoreData();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    // Optionally keep wishlist open or close it
  };

  return (
    <div className={`fixed inset-0 z-[2000] transition-all duration-500 ease-in-out ${isWishlistOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-500 ${isWishlistOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeWishlist}
      />

      {/* Drawer */}
      <div className={`absolute top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isWishlistOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                <Heart size={20} fill="currentColor" />
              </div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                Your <span className="text-rose-500">Wishlist</span>
              </h2>
            </div>
            <button 
              onClick={closeWishlist}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Items Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-800">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-gray-50 dark:bg-slate-950 rounded-full flex items-center justify-center text-gray-300">
                  <Heart size={32} />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-black uppercase text-sm tracking-widest mb-2">Wishlist is Empty</p>
                  <p className="text-gray-400 text-xs leading-relaxed max-w-[200px] mx-auto uppercase font-bold tracking-wider">Save your favorite items for later</p>
                </div>
                <button 
                  onClick={() => { navigate('/search'); closeWishlist(); }}
                  className="bg-slate-900 dark:bg-slate-800 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all"
                >
                  Explore Store
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-slate-950 rounded-xl p-2 shrink-0 border border-gray-100 dark:border-slate-800 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight line-clamp-1">{item.name}</h4>
                        <button onClick={() => removeFromWishlist(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">{formatPrice(item.price)}</p>
                      
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[var(--primary-color)] hover:opacity-80 transition-opacity"
                      >
                        <ShoppingCart size={12} /> Move to Bag
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Area */}
          {wishlistItems.length > 0 && (
            <div className="p-6 bg-gray-50 dark:bg-slate-950/50 border-t border-gray-100 dark:border-slate-800">
              <button 
                onClick={() => { navigate('/wishlist'); closeWishlist(); }}
                className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:opacity-90 flex items-center justify-center gap-2"
              >
                View Full Wishlist <ArrowRight size={14} />
              </button>
              <p className="text-[9px] text-center text-gray-400 font-black uppercase tracking-widest pt-4">
                Saved Items ({wishlistItems.length})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistDrawer;

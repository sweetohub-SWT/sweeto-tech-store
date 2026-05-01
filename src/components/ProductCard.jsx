import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useStoreData } from '../contexts/StoreDataContext';
import { useLocale } from '../contexts/LocaleContext';
import { Star, Heart, ShoppingCart, Eye, X, MessageCircle, Zap, Clock, TrendingUp } from 'lucide-react';
import { createPortal } from 'react-dom';

const ProductCard = ({ product, showBadge }) => {
  const { formatPrice, currencySymbol, salesRecords, reviews } = useStoreData();
  const { t } = useLocale();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Normalize images to an array (Main image + Additional images)
  const productImages = useMemo(() => {
    const images = [];
    if (product.image) images.push(product.image);
    if (Array.isArray(product.additionalImages)) {
      images.push(...product.additionalImages);
    }
    return images.length > 0 ? images : ['/placeholder.png'];
  }, [product.image, product.additionalImages]);

  // Initialize color when quick view opens
  const openQuickView = () => {
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    setShowQuickView(true);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowQuickView(false);
      setIsClosing(false);
    }, 1900); // Slightly less than 2s to ensure it feels snappy
  };

  // REAL-TIME data calculation
  const { rating, soldCount } = useMemo(() => {
    const productSales = salesRecords?.filter(record =>
      record.product_id === product.id || record.productId === product.id
    ) || [];
    const totalSold = productSales.reduce((acc, curr) => acc + (Number(curr.quantity_sold) || Number(curr.quantity) || 0), 0);

    const productReviews = reviews?.filter(r =>
      r.product_id === product.id || r.productId === product.id
    ) || [];
    const avgRating = productReviews.length > 0
      ? (productReviews.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / productReviews.length).toFixed(1)
      : '0.0';

    return {
      rating: avgRating,
      soldCount: totalSold
    };
  }, [product.id, salesRecords, reviews]);

  const isWishlisted = isInWishlist(product.id);

  // Check if product is "New" (added in the last 7 days)
  const isNew = useMemo(() => {
    if (!product.createdAt) return false;
    const addedDate = new Date(product.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - addedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }, [product.createdAt]);

  return (
    <>
      <div
        className="group bg-white dark:bg-slate-900 flex flex-col w-full animate-in fade-in duration-500 transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-700 relative z-10 hover:z-20 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-slate-800/50">
          <Link
            to={`/product/${product.id}`}
            className="w-full h-full relative flex items-center justify-center p-2"
            onMouseEnter={() => {
              if (productImages.length > 1) setCurrentImageIndex(1);
            }}
            onMouseLeave={() => {
              setCurrentImageIndex(0);
            }}
          >
            {productImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} - ${idx}`}
                className={`absolute inset-0 w-full h-full object-contain p-2 cool-slide ${idx === currentImageIndex
                    ? 'opacity-100 translate-x-0 scale-100 rotate-0 blur-0'
                    : idx < currentImageIndex
                      ? 'opacity-0 -translate-x-full scale-90 rotate-2 blur-sm pointer-events-none'
                      : 'opacity-0 translate-x-full scale-90 -rotate-2 blur-sm pointer-events-none'
                  }`}
              />
            ))}
          </Link>

          {/* Floating Actions (Clearly seen on Hover) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2.5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
            <button
              onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
              className={`p-2.5 rounded-full backdrop-blur-xl shadow-2xl border transition-all active:scale-90 hover:scale-110 ${isWishlisted
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-900 hover:text-red-500 dark:bg-slate-800 dark:text-white border-white dark:border-slate-700'
                }`}
              title={t('addToWishlist')}
            >
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2.5} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); openQuickView(); }}
              className="p-2.5 rounded-full bg-white text-gray-900 hover:text-blue-600 dark:bg-slate-800 dark:text-white backdrop-blur-xl shadow-2xl border border-white dark:border-slate-700 transition-all active:scale-90 hover:scale-110"
              title={t('seePreview')}
            >
              <Eye size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Floating Cart Button */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product); }}
              className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center shadow-xl active:scale-90 hover:scale-110 transition-all"
            >
              <ShoppingCart size={18} />
            </button>
          </div>

          {/* Dynamic Badges (Context-Aware: only shows in relevant sections) */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 items-start z-20">
            {product.dealOfDay && (!showBadge || showBadge === 'deals') && (
              <span className="bg-gradient-to-r from-[#FF4D00] to-[#FF8A00] text-white text-[9px] font-black px-2.5 py-1.5 rounded-sm uppercase tracking-widest shadow-xl flex items-center gap-1.5 animate-pulse border border-white/10">
                <Zap size={10} fill="white" className="text-white" />
                {t('dealOfDay')}
              </span>
            )}
            
            {(product.newArrival || isNew) && (!showBadge || showBadge === 'new') && (
              <span className="bg-white/90 dark:bg-slate-900/90 text-black dark:text-white backdrop-blur-md text-[9px] font-black px-2.5 py-1.5 rounded-sm uppercase tracking-widest shadow-xl flex items-center gap-1.5 border border-gray-100 dark:border-slate-800">
                <Clock size={10} strokeWidth={3} />
                {t('newlyAdded')}
              </span>
            )}

            {product.trending && (!showBadge || showBadge === 'trending') && (
              <span className="bg-black dark:bg-white text-white dark:text-black text-[9px] font-black px-2.5 py-1.5 rounded-sm uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                <TrendingUp size={10} strokeWidth={3} />
                {t('trending')}
              </span>
            )}

            {product.originalPrice && product.originalPrice > product.price && (
              <span className="bg-[#E62E04] text-white text-[10px] font-black px-3 py-1 rounded-sm shadow-xl">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% {t('off')}
              </span>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 flex flex-col flex-1 bg-white dark:bg-slate-900">
          <Link
            to={`/product/${product.id}`}
            className="text-[16px] font-black text-slate-900 dark:text-white line-clamp-2 hover:text-[var(--primary-color)] transition-colors leading-tight tracking-tight uppercase mb-1"
          >
            {product.name}
          </Link>

          {/* Rating Section */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={13} 
                  className={rating && star <= Math.round(rating) ? "fill-[#FFB800] text-[#FFB800]" : "fill-gray-100 text-gray-100 dark:fill-slate-800 dark:text-slate-800"} 
                  strokeWidth={2} 
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-slate-400">{rating || '0.0'}</span>
          </div>

          {/* Price Area */}
          <div className="flex items-baseline gap-1 mt-auto">
            <span className="text-[12px] font-black text-red-600 uppercase tracking-tighter">{currencySymbol}</span>
            <span className="text-3xl font-black text-red-600 tracking-tighter leading-none">
              {product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[14px] text-slate-400 line-through ml-2 font-bold decoration-slate-300">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Decorative Divider */}
          <div className="h-[1px] w-full bg-gray-50 dark:bg-slate-800/50 my-4" />

          {/* Bottom Badge & Stats Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="bg-red-50 dark:bg-red-950/30 text-red-600 px-2 py-1 rounded-[4px] text-[10px] font-black uppercase tracking-wider border border-red-100 dark:border-red-900/20">
                  {t('save')} {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
              {soldCount > 0 ? `${soldCount} ${t('sold')}` : `0 ${t('sold')}`}
            </span>
          </div>
        </div>

        {/* ACTION OVERLAY (Now contained inside the card) */}
        <div
          className={`absolute inset-x-0 bottom-0 z-30 transition-all duration-300 ease-in-out bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 border-t border-gray-100 dark:border-slate-800 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] ${isHovered ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
            }`}
        >
          <div className="flex flex-col gap-2">
            <Link
              to={`/product/${product.id}`}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-2.5 text-center text-[10px] font-black uppercase tracking-widest hover:bg-black/90 dark:hover:bg-white/90 transition-all rounded-lg shadow-sm"
            >
              {t('seePreview')}
            </Link>
            <Link
              to={`/you-may-love?category=${encodeURIComponent(product.category)}&from=${product.id}`}
              className="w-full bg-white dark:bg-slate-800 text-black dark:text-white border border-gray-200 dark:border-slate-700 py-2 text-center text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-slate-700 transition-all rounded-lg"
            >
              {t('similarItems')}
            </Link>
          </div>
        </div>
      </div>

      {/* QUICK VIEW MODAL (ZOOM OUT EFFECT) */}
      {showQuickView && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-700 ${isClosing ? 'animate-out fade-out duration-[2000ms]' : ''}`}
            onClick={handleClose}
          />

          {/* Modal Content - ZOOM OUT / ZOOM IN ANIMATIONS */}
          <div
            className={`relative w-full max-w-4xl bg-white dark:bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-200 dark:border-slate-800 flex flex-col md:flex-row ${isClosing ? 'pointer-events-none' : ''}`}
            style={{
              animation: isClosing
                ? 'zoom-back-in 2s cubic-bezier(0.23, 1, 0.32, 1) forwards'
                : 'drown-out 2s cubic-bezier(0.23, 1, 0.32, 1) forwards'
            }}
          >
            <style>{`
              @keyframes drown-out {
                0% { transform: scale(1.6); filter: blur(10px); opacity: 0; }
                100% { transform: scale(1); filter: blur(0px); opacity: 1; }
              }
              @keyframes zoom-back-in {
                0% { transform: scale(1); filter: blur(0px); opacity: 1; }
                100% { transform: scale(1.6); filter: blur(10px); opacity: 0; }
              }
            `}</style>
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 z-20 p-2 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Image Section - CLICK TO ZOOM BACK IN */}
            <div
              className="w-full md:w-1/2 bg-gray-50 dark:bg-slate-900 p-12 flex items-center justify-center cursor-zoom-in hover:bg-gray-100 dark:hover:bg-slate-800/80 transition-colors group/img"
              onClick={handleClose}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {productImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={product.name}
                    className={`absolute inset-0 w-full h-full object-contain drop-shadow-2xl cool-slide ${idx === currentImageIndex ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-90 blur-md'
                      }`}
                  />
                ))}
              </div>

              {/* Image Indicators */}
              {productImages.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {productImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                      className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentImageIndex ? 'w-8 bg-black dark:bg-white' : 'w-2 bg-gray-300 dark:bg-slate-700'
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
              <div className="mb-6">
                {product.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest inline-block mb-2 shadow-sm">{product.badge}</span>
                )}
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-4 leading-tight tracking-tighter">
                  {product.name}
                </h2>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center text-yellow-400 gap-1">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-black text-gray-900 dark:text-white">{rating || '5.0'}</span>
                  </div>
                  <div className="w-px h-4 bg-gray-200" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{soldCount}+ {t('sold')}</span>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-[var(--primary-color)] tracking-tighter">{formatPrice(product.price)}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-4 leading-relaxed font-medium line-clamp-3">
                  {product.description || 'Experience premium technology with our latest collection. High performance meets elegant design in every detail.'}
                </p>

                {/* Quick Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-8 space-y-3">
                      {t('color')}: <span className="text-gray-900 dark:text-white ml-1">{selectedColor?.name}</span>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor?.code === color.code
                              ? 'border-[var(--primary-color)] ring-2 ring-[var(--primary-color)]/10 scale-110'
                              : 'border-transparent hover:border-gray-200'
                            }`}
                          style={{ backgroundColor: color.code }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => { addToCart(product, 1, selectedColor); setShowQuickView(false); }}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                >
                  {t('addToCart')} {selectedColor && `(${selectedColor.name})`}
                </button>
                <Link
                  to={`/product/${product.id}`}
                  onClick={() => setShowQuickView(false)}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] text-center hover:bg-gray-50 transition-all"
                >
                  {t('viewFullDetails')}
                </Link>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ProductCard;

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { useStoreData } from '../contexts/StoreDataContext';
import {
  ChevronLeft, Plus, Minus, ShoppingCart, Heart,
  Star, Share2, ShieldCheck, RotateCcw, Truck, Store,
  CheckCircle2, Info, MessageCircle, ArrowLeft, Zap
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import WhatsAppButton from '../components/WhatsAppButton';
import ProductShareButton from '../components/ProductShareButton';
import { updateSEO } from '../utils/seoHelper';
import { useUserAuth } from '../contexts/UserAuthContext';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const {
    products, formatPrice, loading, reviews, salesRecords, addReview
  } = useStoreData();
  const { user } = useUserAuth();

  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center' });
  const [isZoomed, setIsZoomed] = useState(false);

  const product = products.find(p => p.id === productId || p.id.toString() === productId);

  // Dynamic Product Data (Reviews & Sales)
  const { productReviews, avgRating, totalSold } = useMemo(() => {
    if (!product) return { productReviews: [], avgRating: '0.0', totalSold: 0 };

    const filteredReviews = reviews?.filter(r => 
      r.product_id === product.id || r.productId === product.id
    ) || [];

    const rating = filteredReviews.length > 0 
      ? (filteredReviews.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / filteredReviews.length).toFixed(1)
      : '0.0';

    const productSales = salesRecords?.filter(record => 
      record.product_id === product.id || record.productId === product.id
    ) || [];
    const soldCount = productSales.reduce((acc, curr) => acc + (Number(curr.quantity_sold) || Number(curr.quantity) || 0), 0);

    return {
      productReviews: filteredReviews,
      avgRating: rating,
      totalSold: soldCount
    };
  }, [product, reviews, salesRecords]);

  useEffect(() => {
    if (product) {
      updateSEO({
        title: `${product.name} | Sweeto Tech`,
        description: product.tagline || product.description?.substring(0, 160),
        image: product.image,
        type: 'product'
      });
      setActiveImage(product.image);
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    showToast(`Added ${quantity} ${product.name}${selectedColor ? ` (${selectedColor.name})` : ''} to cart`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    navigate('/cart');
  };

  const handleNextImage = () => {
    const allImages = [product.image, ...(product.additionalImages || [])];
    const currentIndex = allImages.indexOf(activeImage || product.image);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setActiveImage(allImages[nextIndex]);
  };

  const handlePrevImage = () => {
    const allImages = [product.image, ...(product.additionalImages || [])];
    const currentIndex = allImages.indexOf(activeImage || product.image);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setActiveImage(allImages[prevIndex]);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  };

  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id && p.status === 'active')
    .slice(0, 5);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to leave a review', 'error');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Please enter a comment', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      await addReview({
        productId: product.id,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        rating: reviewRating,
        comment: reviewComment,
        verifiedPurchase: true // We can assume for now or check orders later
      });
      showToast('Thank you for your review!');
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      showToast('Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-20 transition-colors">
      <div className="max-w-none ml-0 px-4 lg:px-8">



        <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_1fr_320px] gap-8">

          {/* 1. Thumbnail Gallery (Left - Unified for Mobile/Desktop) */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
            {[product.image, ...(product.additionalImages || [])].map((img, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setActiveImage(img)}
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all bg-gray-50 dark:bg-slate-900 ${activeImage === img ? 'border-red-500 ring-2 ring-red-500/20' : 'border-transparent hover:border-gray-300'
                  }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain p-1" />
              </button>
            ))}
          </div>

          {/* 2. Main Image (Center) */}
          <div
            className="relative aspect-square lg:aspect-auto lg:h-[600px] bg-gray-50 dark:bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 dark:border-slate-800 cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => {
              setIsZoomed(false);
              setZoomStyle({ transformOrigin: 'center' });
            }}
          >
            <img
              src={activeImage || product.image}
              alt={product.name}
              style={isZoomed ? { ...zoomStyle, transform: 'scale(2)' } : { transform: 'scale(1)' }}
              className="w-full h-full object-contain transition-transform duration-200 ease-out"
            />

            {/* Slider Arrows */}
            {!isZoomed && [product.image, ...(product.additionalImages || [])].length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center text-gray-800 dark:text-white shadow-lg hover:bg-white transition-all z-20"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center text-gray-800 dark:text-white shadow-lg hover:bg-white transition-all z-20"
                >
                  <ChevronLeft size={24} className="rotate-180" />
                </button>
              </>
            )}
          </div>

          {/* 3. Product Info (Center-Right) */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 text-[10px] font-black uppercase tracking-widest text-[var(--primary-color)] animate-pulse">
                In Stock & Ready to Ship
              </div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tighter italic">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-6 p-4 rounded-2xl bg-gray-50/50 dark:bg-slate-900/50 backdrop-blur-md border border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(Number(avgRating)) ? "currentColor" : "none"} />
                ))}
                <span className="text-base font-black ml-2 text-gray-900 dark:text-white">{avgRating}</span>
              </div>
              <div className="h-6 w-px bg-gray-200 dark:bg-slate-800"></div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{productReviews.length} Verified Reviews</div>
              <div className="h-6 w-px bg-gray-200 dark:bg-slate-800"></div>
              <div className="text-xs text-gray-900 dark:text-white font-black uppercase tracking-widest">{totalSold > 0 ? `${totalSold.toLocaleString()}+ Sold` : 'Limited Edition'}</div>
            </div>

            <div className="space-y-3 py-4">
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter italic">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xl font-bold text-gray-400 line-through decoration-red-500/50">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-[10px] font-black text-green-600 uppercase tracking-widest">
                  Best Price Guaranteed
                </div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Inclusive of all local taxes</p>
              </div>
            </div>

            {/* Promo Banner - High End Editorial Style */}
            <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-red-600 to-red-800 group cursor-pointer hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 border border-red-500/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20">
                    <Zap size={24} className="animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs">Special Drop Offer</h4>
                    <p className="text-white/90 text-sm font-bold mt-1">
                      Save {formatPrice(Math.round(product.price * 0.1))} on your first order.
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 group-hover:translate-x-2 transition-transform">
                  <ChevronLeft size={20} className="rotate-180" />
                </div>
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                    Select Aesthetic: <span className="text-gray-900 dark:text-white ml-2">{selectedColor?.name}</span>
                  </h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-12 h-12 rounded-2xl border-2 transition-all p-1 ${
                        selectedColor?.code === color.code 
                          ? 'border-[var(--primary-color)] ring-8 ring-[var(--primary-color)]/5 scale-110 shadow-2xl' 
                          : 'border-transparent bg-gray-50 dark:bg-slate-900 hover:border-gray-200 dark:hover:border-slate-800'
                      }`}
                      title={color.name}
                    >
                      <div 
                        className="w-full h-full rounded-xl shadow-inner relative overflow-hidden" 
                        style={{ backgroundColor: color.code }} 
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                      </div>
                      {selectedColor?.code === color.code && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--primary-color)] rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-950">
                          <CheckCircle2 size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Purchase Sidebar (Far Right) - STICKY Glassmorphism Card */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:h-fit">

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary-color)] to-blue-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[2rem] shadow-2xl space-y-6">
                
                {/* Quantity Control */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Order Quantity</h4>
                  <div className="flex items-center justify-between p-2 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-slate-800">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-gray-900 dark:text-white shadow-sm hover:bg-[var(--primary-color)] hover:text-white transition-all disabled:opacity-30"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-xl font-black text-gray-900 dark:text-white">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-gray-900 dark:text-white shadow-sm hover:bg-[var(--primary-color)] hover:text-white transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-lg font-bold text-sm transition-colors active:scale-[0.98]"
                  >
                    Buy now
                  </button>
                  <WhatsAppButton 
                    product={product} 
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-lg font-bold text-sm transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
                  />
                  
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white py-3.5 rounded-lg font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors active:scale-[0.98]"
                  >
                    Add to cart
                  </button>
                </div>

              <div className="flex gap-2">
                <ProductShareButton product={product} className="flex-1 !py-2.5 !bg-gray-50 dark:!bg-slate-800 !rounded-lg !text-gray-500 !text-xs !font-bold !border-none !flex !items-center !justify-center !gap-2" />
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 dark:bg-slate-800 rounded-lg transition-colors text-xs font-bold ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                >
                  <Heart size={14} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Related Items */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Related items</h2>
            <Link to={`/category/${product.category || 'All'}`} className="text-sm font-bold text-red-500 hover:underline">View more</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* Product Details / Description Tab */}
        <div className="mt-20 border-t border-gray-100 dark:border-slate-800 pt-16">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">Product Details</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="p-8 bg-gray-50 dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-500 mb-6">Specifications</h3>
                  <ul className="space-y-4">
                    {product.specifications ? (
                      Object.entries(product.specifications).map(([key, value]) => (
                        <li key={key} className="flex items-center gap-3 text-sm font-bold text-gray-900 dark:text-white">
                          <CheckCircle2 size={18} className="text-green-500" /> <span className="capitalize">{key.replace(/_/g, ' ')}</span>: {value}
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-center gap-3 text-sm font-bold text-gray-900 dark:text-white">
                          <CheckCircle2 size={18} className="text-green-500" /> Premium Build Quality
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold text-gray-900 dark:text-white">
                          <CheckCircle2 size={18} className="text-green-500" /> High Performance
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold text-gray-900 dark:text-white">
                          <CheckCircle2 size={18} className="text-green-500" /> Modern Design
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="p-8 bg-gray-50 dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-500 mb-6">In the Box</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-sm font-bold text-gray-900 dark:text-white">
                      <CheckCircle2 size={18} className="text-blue-500" /> Main Unit
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-gray-900 dark:text-white">
                      <CheckCircle2 size={18} className="text-blue-500" /> Charging Cable
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-gray-900 dark:text-white">
                      <CheckCircle2 size={18} className="text-blue-500" /> User Manual
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 border-t border-gray-100 dark:border-slate-800 pt-16 pb-20">
          <div className="flex flex-col lg:flex-row gap-12">

            {/* Review Summary & Form */}
            <div className="lg:w-1/3">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Customer Reviews</h2>
              <div className="flex items-center gap-4 mb-8">
                <div className="text-5xl font-black text-gray-900 dark:text-white">{avgRating}</div>
                <div>
                  <div className="flex items-center gap-0.5 text-yellow-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.floor(Number(avgRating)) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Based on {productReviews.length} reviews</div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest">Write a review</h3>
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[var(--primary-color)]/10 rounded-xl flex items-center justify-center text-[var(--primary-color)] text-xs font-black">
                        {getInitials(user.name)}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Posting as <span className="text-gray-900 dark:text-white">{user.name}</span></div>
                    </div>
                    
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star} 
                          type="button" 
                          onClick={() => setReviewRating(star)}
                          className={`p-2 rounded-lg transition-colors ${reviewRating >= star ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-300 bg-white dark:bg-slate-800'}`}
                        >
                          <Star size={18} fill={reviewRating >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Tell us what you think..."
                      rows="4"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-white dark:bg-slate-800 border-none focus:ring-2 focus:ring-red-500 text-sm font-medium transition-all resize-none"
                    ></textarea>
                    <button 
                      type="submit"
                      disabled={submittingReview}
                      className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">You must be logged in to leave a review</p>
                    <Link to="/login" className="inline-block bg-[var(--primary-color)] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[var(--primary-color)]/20">
                      Login Now
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews List (DYNAMIC) */}
            <div className="lg:flex-1 space-y-6">
              {productReviews.length > 0 ? (
                productReviews.map((review) => (
                  <div key={review.id} className="p-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2rem] hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 font-black group-hover:bg-red-500 group-hover:text-white transition-all">
                          {getInitials(review.customer_name || review.customerName || 'User')}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{review.customer_name || review.customerName || 'Anonymous'}</h4>
                          <div className="flex items-center gap-0.5 text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} fill={i < (Number(review.rating) || 0) ? "currentColor" : "none"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed italic">
                      "{review.comment || review.text}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center bg-gray-50 dark:bg-slate-900 rounded-[2rem] border border-dashed border-gray-200 dark:border-slate-800">
                  <MessageCircle size={40} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-bold">No reviews yet for this product.</p>
                  <p className="text-xs text-gray-400 mt-1">Be the first to share your thoughts!</p>
                </div>
              )}
              {productReviews.length > 3 && (
                <button className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 transition-colors">
                  Load more reviews
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

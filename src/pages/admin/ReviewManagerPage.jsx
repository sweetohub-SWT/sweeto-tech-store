import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Trash2, 
  Star, 
  User, 
  Search, 
  Filter, 
  AlertCircle,
  Package,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  MoreVertical
} from 'lucide-react';
import { useStoreData } from '../../contexts/StoreDataContext';

const ReviewManagerPage = () => {
  const { reviews, products, deleteReview } = useStoreData();
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // UI State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Enhanced reviews data
  const processedReviews = useMemo(() => {
    return reviews.map(review => {
      const product = products.find(p => p.id === review.productId || p.id?.toString() === review.productId?.toString());
      return {
        ...review,
        productName: product ? product.name : 'Unknown Product',
        productImage: product ? product.image : null
      };
    });
  }, [reviews, products]);

  // Filtering and Sorting
  const filteredReviews = useMemo(() => {
    let result = processedReviews.filter(review => {
      const matchesSearch = 
        (review.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (review.comment?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (review.productName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesRating = ratingFilter === 'all' || review.rating?.toString() === ratingFilter;
      
      return matchesSearch && matchesRating;
    });

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'rating-high') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'rating-low') {
      result.sort((a, b) => a.rating - b.rating);
    }

    return result;
  }, [processedReviews, searchTerm, ratingFilter, sortBy]);

  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
      setSuccess('Review deleted successfully');
      setDeleteConfirmId(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete review');
      setTimeout(() => setError(''), 3000);
    }
  };

  const stats = {
    total: reviews.length,
    average: reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0,
    fiveStar: reviews.filter(r => r.rating === 5).length,
    critical: reviews.filter(r => r.rating <= 2).length
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-4 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--primary-color)]/10 rounded-2xl flex items-center justify-center text-[var(--primary-color)]">
                <MessageSquare size={24} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
                Reviews <span className="text-[var(--primary-color)]">Management</span>
              </h1>
            </div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-14">
              Monitor and moderate customer feedback
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Store Reputation</p>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <span className="text-lg font-black text-slate-900 dark:text-white">{stats.average}</span>
                </div>
                <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-2" />
                <span className="text-xs font-bold text-slate-500">{stats.total} Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Reviews', value: stats.total, icon: <MessageSquare size={20} />, color: 'primary' },
            { label: 'Average Rating', value: `${stats.average}/5`, icon: <Star size={20} />, color: 'yellow' },
            { label: '5-Star Excellence', value: stats.fiveStar, icon: <ShieldCheck size={20} />, color: 'green' },
            { label: 'Critical Feedback', value: stats.critical, icon: <ShieldAlert size={20} />, color: 'red' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${stat.color}-500/10 text-${stat.color}-500`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar Section */}
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] p-6 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Search */}
            <div className="lg:col-span-5 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search user, comment or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black/20 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="lg:col-span-7 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-black/20 rounded-2xl px-4 py-2 border border-slate-100 dark:border-white/5">
                <Filter size={16} className="text-slate-400" />
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 cursor-pointer pr-8"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 dark:bg-black/20 rounded-2xl px-4 py-2 border border-slate-100 dark:border-white/5">
                <Calendar size={16} className="text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 cursor-pointer pr-8"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rating-high">Highest Rated</option>
                  <option value="rating-low">Lowest Rated</option>
                </select>
              </div>

              {searchTerm || ratingFilter !== 'all' ? (
                <button 
                  onClick={() => { setSearchTerm(''); setRatingFilter('all'); }}
                  className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-color)] hover:underline"
                >
                  Clear All
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Notifications */}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <ShieldCheck size={20} />
            <span className="text-xs font-black uppercase tracking-widest">{success}</span>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden group hover:border-[var(--primary-color)]/30 transition-all duration-500 shadow-sm hover:shadow-xl">
                  <div className="p-8 flex flex-col lg:flex-row lg:items-start gap-8">
                    
                    {/* User Info & Rating */}
                    <div className="lg:w-1/4 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                          <User size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 dark:text-white uppercase italic truncate max-w-[150px]">
                            {review.userName || 'Anonymous'}
                          </h4>
                          <div className="flex items-center gap-1 text-yellow-400 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={12} 
                                fill={i < review.rating ? "currentColor" : "none"} 
                                className={i < review.rating ? "text-yellow-400" : "text-slate-300 dark:text-slate-700"}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Calendar size={12} />
                          {new Date(review.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        {review.verifiedPurchase && (
                          <div className="inline-flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-emerald-500/5 px-2 py-1 rounded-lg w-fit">
                            <ShieldCheck size={10} /> Verified Purchase
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="lg:flex-grow">
                      <div className="bg-slate-50/50 dark:bg-black/20 rounded-3xl p-6 relative">
                        <div className="absolute -top-3 -left-3 text-6xl text-slate-200 dark:text-slate-800 font-serif leading-none opacity-50">"</div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic relative z-10">
                          {review.comment || "No comment provided."}
                        </p>
                      </div>
                    </div>

                    {/* Product & Actions */}
                    <div className="lg:w-1/4 flex flex-col justify-between items-end gap-6">
                      <div className="flex items-center gap-4 bg-white dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-white/5 w-full">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0">
                          {review.productImage ? (
                            <img src={review.productImage} alt={review.productName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[8px] font-black text-[var(--primary-color)] uppercase tracking-widest mb-1">Reviewed Product</p>
                          <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase truncate italic">{review.productName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {deleteConfirmId === review.id ? (
                          <div className="flex items-center gap-2 animate-in fade-in zoom-in-95">
                            <button 
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 px-4 py-2"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleDelete(review.id)}
                              className="bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-xl shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
                            >
                              Confirm Delete
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setDeleteConfirmId(review.id)}
                            className="p-4 rounded-2xl bg-slate-100 dark:bg-black/30 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all group/btn"
                          >
                            <Trash2 size={20} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-[3rem] p-20 border border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                <Search size={40} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic">No reviews found</h3>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                  Try adjusting your filters or search terms
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ReviewManagerPage;

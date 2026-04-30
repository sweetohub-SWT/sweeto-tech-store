import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, PlayCircle } from 'lucide-react';
import { useStoreData } from '../contexts/StoreDataContext';

const VideoPromoColumn = ({ videoAdId }) => {
  const { videoAds } = useStoreData();
  
  // Find the specific video ad or use the latest one
  const activeVideoAd = videoAdId 
    ? videoAds.find(ad => ad.id === videoAdId) 
    : videoAds.find(ad => ad.status === 'active');

  return (
    <div className="lg:w-[40%] h-auto relative mb-12 lg:mb-0 animate-ai-fade-in">
      <div className="relative h-[500px] lg:h-full min-h-[500px] overflow-hidden bg-black group rounded-[2rem] border border-white/10 shadow-2xl">
        <video
          key={activeVideoAd?.videoUrl || 'default'}
          autoPlay
          loop
          muted
          playsInline
          src={activeVideoAd?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-electronic-components-and-circuit-board-15494-large.mp4'}
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-[3s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
        
        <div className="relative z-20 h-full flex flex-col justify-end p-8 xl:p-12 text-left">
          <div className="flex items-center gap-2 mb-6">
              <span className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center shadow-lg shadow-[var(--primary-color)]/20 border border-white/20">
                <Zap size={14} className="mr-2" fill="currentColor" /> VIDEO PROMO
              </span>
          </div>

          <h3 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-8 line-clamp-2 leading-none drop-shadow-2xl">
            {activeVideoAd?.title || "Exclusive Tech Deals"}
          </h3>
          
          <Link 
            to={activeVideoAd?.productId ? `/product/${activeVideoAd.productId}` : '/search'}
            className="bg-white text-black hover:bg-[var(--primary-color)] hover:text-white w-fit px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 group/btn"
          >
            {activeVideoAd?.productId ? 'Shop This Deal' : 'Explore All'}
            <PlayCircle size={18} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoPromoColumn;

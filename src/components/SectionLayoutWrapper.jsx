import React from 'react';
import VideoPromoColumn from './VideoPromoColumn';

const SectionLayoutWrapper = ({ children, showVideoPromo, videoAdId }) => {
  if (!showVideoPromo) return children;

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8">
      {/* Product Content Slot (60%) */}
      <div className="lg:w-[60%] w-full">
        {children}
      </div>

      {/* Video Promo Slot (40%) */}
      <VideoPromoColumn videoAdId={videoAdId} />
    </div>
  );
};

export default SectionLayoutWrapper;

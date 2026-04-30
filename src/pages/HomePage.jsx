import React, { useEffect, useMemo } from 'react';
import HeroBanner from '../components/HeroBanner';
import DealOfTheDay from '../components/DealOfTheDay';
import ShopByCategory from '../components/ShopByCategory';
import FeaturedProductsGrid from '../components/FeaturedProductsGrid';
import TrendingProducts from '../components/TrendingProducts';
import JustArrivedSection from '../components/JustArrivedSection';
import HomeCinemaSection from '../components/HomeCinemaSection';
import SpeakersSection from '../components/SpeakersSection';
import RefrigeratorsSection from '../components/RefrigeratorsSection';
import SmartphonesSection from '../components/SmartphonesSection';
import VideoBanner from '../components/VideoBanner';
import { updateSEO } from '../utils/seoHelper';
import { useStoreData } from '../contexts/StoreDataContext';

const SECTION_COMPONENTS = {
  hero: HeroBanner,
  shop_by_category: ShopByCategory,
  video_banner: VideoBanner,
  deal_of_the_day: DealOfTheDay,
  just_arrived: JustArrivedSection,
  featured_products: FeaturedProductsGrid,
  smartphones: SmartphonesSection,
  home_cinema: HomeCinemaSection,
  speakers: SpeakersSection,
  refrigerators: RefrigeratorsSection,
  trending: TrendingProducts,
};

const HomePage = () => {
  const { storeSettings } = useStoreData();
  
  useEffect(() => {
    updateSEO();
  }, []);

  const sections = useMemo(() => {
    // Fallback to default sections if not defined in settings
    if (!storeSettings?.homepageSections) {
      return [
        { id: 'hero-1', type: 'hero', name: 'Hero Banner', enabled: true },
        { id: 'cat-1', type: 'shop_by_category', name: 'Shop By Category', enabled: true },
        { id: 'deal-1', type: 'deal_of_the_day', name: 'Deals of the Day', enabled: true },
        { id: 'new-1', type: 'just_arrived', name: 'New Arrivals', enabled: true },
        { id: 'feat-1', type: 'featured_products', name: 'Featured Collection', enabled: true },
        { id: 'smart-1', type: 'smartphones', name: 'Mobile Tech', enabled: true },
        { id: 'cinema-1', type: 'home_cinema', name: 'Home Cinema', enabled: true },
        { id: 'audio-1', type: 'speakers', name: 'Premium Speakers', enabled: true },
        { id: 'fridge-1', type: 'refrigerators', name: 'Modern Refrigerators', enabled: true },
        { id: 'trend-1', type: 'trending', name: 'Trending Now', enabled: true }
      ];
    }
    return (storeSettings.homepageSections || []);
  }, [storeSettings?.homepageSections]);

  return (
    <div className="flex flex-col pb-20 bg-gray-50 dark:bg-slate-950 transition-colors overflow-x-hidden">
      {sections.filter(s => s.enabled).map((section, index) => {
        const componentType = section.type || section.id;
        const Component = SECTION_COMPONENTS[componentType];
        if (!Component) return null;

        return (
          <Component 
            key={section.id || index} 
            title={section.name} 
            isFirst={index === 0}
            showVideoPromo={section.showVideoPromo}
            videoAdId={section.videoAdId}
          />
        );
      })}
    </div>
  );
};

export default HomePage;

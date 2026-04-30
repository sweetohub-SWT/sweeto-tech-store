import React, { useEffect } from 'react';
import { useStoreData } from '../contexts/StoreDataContext';

const SEOHead = ({ title, description, keywords }) => {
  const { storeSettings } = useStoreData();

  useEffect(() => {
    // 1. Update Document Title
    const baseTitle = storeSettings.shopName || 'SWEETO HUBS';
    const finalTitle = title ? `${title} | ${baseTitle}` : `${baseTitle} | ${storeSettings.storeTagline || ''}`;
    document.title = finalTitle;

    // 2. Update Meta Description
    const metaDesc = description || storeSettings.metaDescription || '';
    let metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (!metaDescriptionTag) {
      metaDescriptionTag = document.createElement('meta');
      metaDescriptionTag.name = 'description';
      document.head.appendChild(metaDescriptionTag);
    }
    metaDescriptionTag.setAttribute('content', metaDesc);

    // 3. Update Meta Keywords
    const metaKeys = keywords || storeSettings.metaKeywords || '';
    let metaKeywordsTag = document.querySelector('meta[name="keywords"]');
    if (!metaKeywordsTag) {
      metaKeywordsTag = document.createElement('meta');
      metaKeywordsTag.name = 'keywords';
      document.head.appendChild(metaKeywordsTag);
    }
    metaKeywordsTag.setAttribute('content', metaKeys);

    // 4. Update Favicon
    if (storeSettings.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = storeSettings.faviconUrl;
    }

    // 5. Update Primary Color for Mobile Address Bar
    if (storeSettings.primaryColor) {
      let themeColorTag = document.querySelector('meta[name="theme-color"]');
      if (!themeColorTag) {
        themeColorTag = document.createElement('meta');
        themeColorTag.name = 'theme-color';
        document.head.appendChild(themeColorTag);
      }
      themeColorTag.setAttribute('content', storeSettings.primaryColor);
    }

  }, [title, description, keywords, storeSettings]);

  return null;
};

export default SEOHead;

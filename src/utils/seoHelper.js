/**
 * Utility to dynamically update SEO meta tags and page titles.
 * Useful for SPAs to ensure link previews work correctly on modern platforms.
 */

const DEFAULT_TITLE = 'Sweeto Hubs | Premium Electronics Store';
const DEFAULT_DESC = 'Discover the latest in premium electronics, from sleek laptops to high-end accessories. Cyber-premium quality at your fingertips.';
const DEFAULT_IMAGE = '/logo.png'; // Fallback to store logo

export const updateSEO = (seoData = {}) => {
  const { 
    title = DEFAULT_TITLE, 
    description = DEFAULT_DESC, 
    image = DEFAULT_IMAGE,
    type = 'website'
  } = seoData;

  // Update Page Title
  document.title = title;

  // Helper to update meta tag by property or name
  const setMeta = (attrName, attrValue, content) => {
    let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Standard Meta Tags
  setMeta('name', 'description', description);

  // Open Graph / Facebook / WhatsApp
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:type', type);
  setMeta('property', 'og:url', window.location.href);

  // Twitter
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);
};

export default updateSEO;

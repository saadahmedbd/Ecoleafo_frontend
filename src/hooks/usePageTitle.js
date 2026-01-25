import { useEffect } from 'react';
import logoIcon from '@/assets/AIRetouch_20251205_124752325.png';

export const usePageTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    const fullTitle = title ? `${title} | Ecoleafo` : 'Ecoleafo - Buy and Sell Trees';
    
    document.title = fullTitle;
    
    // Update favicon
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = logoIcon;
    
    // Update Open Graph meta tags for social media sharing
    const updateMetaTag = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    updateMetaTag('og:title', fullTitle);
    updateMetaTag('og:image', window.location.origin + logoIcon);
    updateMetaTag('og:site_name', 'Ecoleafo');
    
    // Twitter Card meta tags
    const updateTwitterTag = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    updateTwitterTag('twitter:title', fullTitle);
    updateTwitterTag('twitter:image', window.location.origin + logoIcon);
    updateTwitterTag('twitter:card', 'summary');
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

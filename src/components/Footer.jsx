import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Package, Heart, ShoppingCart, CheckCircle2 } from 'lucide-react';

import { useStoreData } from '../contexts/StoreDataContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';

const FacebookIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>
);

const InstagramIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TikTokIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.68l.05.31A6.34 6.34 0 0011.38 22h.2a6.33 6.33 0 005.8-5.32l.06-.51V9.29a8.27 8.27 0 004.15 1.15v-3.4a4.57 4.57 0 01-2-1v.05h-.01z"/>
  </svg>
);

const Footer = () => {
  const { storeSettings, categories, products } = useStoreData();
  const { primaryColor } = useTheme();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    setEmail('');
    showToast('🎉 You\'re subscribed! Expect exclusive drops soon.', 'success');
  };

  // Dynamically derive categories from both categories table and product inventory
  const allCategories = useMemo(() => {
    const subs = new Map();

    // 1. Add categories from the dedicated categories table
    (categories || []).forEach(cat => {
      const name = typeof cat === 'object' ? cat.name : cat;
      const id = typeof cat === 'object' ? (cat.id || cat.name) : cat;
      if (name) subs.set(name, { id, name });
    });

    // 2. Scan products to find any missing categories
    (products || []).forEach(prod => {
      const catName = prod.category || '';
      if (catName && !subs.has(catName)) {
        subs.set(catName, { id: `auto-${catName}`, name: catName });
      }
    });

    return Array.from(subs.values());
  }, [categories, products]);
  
  return (
    <footer className="relative bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-900 mt-20 pt-24 pb-12 transition-colors duration-500 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary-color)]/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-[1500px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Brand & Mission Section */}
          <div className="lg:col-span-4 space-y-10">
            <Link to="/" className="inline-flex items-center gap-5 group">
              <div className="relative">
                <img 
                  src={storeSettings.shopLogo || "/logo_icon.png"} 
                  alt={storeSettings.shopName} 
                  className="h-16 w-auto transition-all duration-1000 group-hover:rotate-[360deg] group-hover:scale-110 object-contain relative z-10" 
                />
                <div className="absolute inset-0 bg-[var(--primary-color)]/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">
                  {storeSettings.shopName?.split(' ')[0] || 'SWEETO'} <span className="text-[var(--primary-color)]">{storeSettings.shopName?.split(' ').slice(1).join(' ') || 'HUBS'}</span>
                </span>
                <span className="text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.5em] mt-2">
                  {storeSettings.storeTagline || 'Premium Tech Destination'}
                </span>
              </div>
            </Link>
            
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium max-w-sm">
              Defining the next generation of premium tech retail. We bridge the gap between innovation and luxury, curating only the world's most exceptional electronics.
            </p>

            <div className="flex items-center gap-4 pt-2">
              {[
                { icon: FacebookIcon, url: storeSettings.facebookUrl, color: '#1877F2', label: 'Facebook' },
                { icon: XIcon, url: storeSettings.twitterUrl, color: '#000000', label: 'X' },
                { icon: InstagramIcon, url: storeSettings.instagramUrl, color: '#E4405F', label: 'Instagram' },
                { icon: TikTokIcon, url: storeSettings.tiktokUrl, color: '#000000', label: 'TikTok' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.url || '#'} 
                  className="w-11 h-11 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--primary-color)]/20 group/social overflow-hidden relative"
                  title={social.label}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = social.color;
                    e.currentTarget.style.borderColor = social.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.borderColor = '';
                  }}
                >
                  <social.icon size={18} className="group-hover/social:scale-125 transition-transform duration-500 relative z-10" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8 lg:gap-12 pl-0 lg:pl-10">
            <div className="flex flex-col">
              <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-900 dark:text-white relative inline-block mb-8">
                Discovery
                <span className="absolute -bottom-2 left-0 w-8 h-1 bg-[var(--primary-color)] rounded-full" />
              </h4>
              <nav className="flex flex-col gap-3">
                {allCategories.slice(0, 5).map(cat => (
                  <Link key={cat.id} to={`/category/${cat.name}`} className="text-[13px] text-gray-500 dark:text-gray-400 hover:text-[var(--primary-color)] transition-all font-bold uppercase tracking-tight flex items-center gap-3 group/link">
                    <span className="w-0 h-[2px] bg-[var(--primary-color)] transition-all duration-300 group-hover/link:w-4" />
                    {cat.name.replace('HEADPONES', 'HEADPHONES')}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-col">
              <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-900 dark:text-white relative inline-block mb-8">
                Resources
                <span className="absolute -bottom-2 left-0 w-8 h-1 bg-[var(--primary-color)] rounded-full" />
              </h4>
              <nav className="flex flex-col gap-3">
                {[
                  { name: 'About Us', path: '/about' },
                  { name: 'Contact Us', path: '/contact' },
                  { name: 'Your Cart', path: '/cart' },
                  { name: 'Wishlist', path: '/wishlist' },
                  { name: 'Admin Portal', path: '/login' },
                  { name: 'Privacy Policy', path: '#' },
                  { name: 'Terms of Use', path: '#' }
                ].map((link, i) => (
                  <Link key={i} to={link.path} className="text-[13px] text-gray-500 dark:text-gray-400 hover:text-[var(--primary-color)] transition-all font-bold uppercase tracking-tight flex items-center gap-3 group/link">
                    <span className="w-0 h-[2px] bg-[var(--primary-color)] transition-all duration-300 group-hover/link:w-4" />
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex flex-col">
              <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-900 dark:text-white relative inline-block mb-8">
                Updates
                <span className="absolute -bottom-2 left-0 w-8 h-1 bg-[var(--primary-color)] rounded-full" />
              </h4>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Subscribe to receive curated tech drops and exclusive editorial content.
            </p>
            <div className="space-y-6">
              {subscribed ? (
                <div className="flex items-center gap-3 px-6 py-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[2rem]">
                  <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                  <p className="text-[11px] font-black tracking-widest text-green-700 dark:text-green-400 uppercase">You&apos;re subscribed!</p>
                </div>
              ) : (
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                    placeholder="ENTER EMAIL"
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 px-6 py-5 rounded-[2rem] text-[11px] font-black tracking-widest focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                  />
                  <button
                    onClick={handleSubscribe}
                    className="absolute right-2 top-2 bottom-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 rounded-full text-[10px] font-black tracking-widest hover:bg-[var(--primary-color)] dark:hover:bg-[var(--primary-color)] hover:text-white transition-all transform active:scale-95"
                  >
                    SUBSCRIBE
                  </button>
                </div>
              )}
              
              <div className="flex flex-col gap-5 pt-4">
                <a
                  href={`tel:${(storeSettings.shopPhone || '+18005793386').replace(/[\s\-\(\)]/g, '')}`}
                  className="flex items-center gap-5 group/contact"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[var(--primary-color)]/10 flex items-center justify-center text-[var(--primary-color)] transition-all group-hover/contact:bg-[var(--primary-color)] group-hover/contact:text-white group-hover/contact:rotate-12">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Contact Us</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight hover:text-[var(--primary-color)] transition-colors">{storeSettings.shopPhone || '+1-800-SWEETO'}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 dark:border-slate-900 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-[12px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} {storeSettings.shopName}. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-10">
            {[
              { label: 'Privacy', path: '/privacy' },
              { label: 'Terms', path: '/terms' },
              { label: 'Security', path: '/security' },
              { label: 'Cookies', path: '/cookies' },
            ].map((item) => (
              <Link key={item.label} to={item.path} className="text-[11px] font-black text-gray-400 hover:text-[var(--primary-color)] cursor-pointer transition-all tracking-widest uppercase hover:tracking-[0.2em]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

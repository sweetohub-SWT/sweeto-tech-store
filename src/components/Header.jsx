import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useLocale } from '../contexts/LocaleContext';
import { useStoreData } from '../contexts/StoreDataContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUserAuth } from '../contexts/UserAuthContext';
import { Search, ShoppingCart, Package, Sun, Moon, Heart, Menu, X, ChevronDown, Phone, Globe, User, LogOut, Settings } from 'lucide-react';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('categories');

  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  const { cartCount, cartTotal, openCart } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();
  const { t } = useLocale();
  const { storeSettings, categories, products, formatPrice } = useStoreData();
  const { isDarkMode, toggleDarkMode, updatePrimaryTheme, primaryColor } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useUserAuth();
  const navigate = useNavigate();

  // Screen size detection for sidebar presence
  React.useEffect(() => {
    const checkScreen = () => {
      const large = window.innerWidth >= 1024;
      setIsLargeScreen(large);
      if (large) setActiveMobileTab('menu');
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-black transition-colors z-[100] shadow-md border-b border-gray-100 dark:border-white/5">
      {/* Middle Bar - Main Header */}
      <div className="w-full px-4 py-2 lg:py-3">
        <div className="flex justify-between items-center gap-4 lg:gap-8">

          {/* Mobile Menu & Search Toggles */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:text-[var(--primary-color)] rounded-2xl transition-all active:scale-95 border border-gray-100 dark:border-slate-800"
            >
              <Menu size={22} strokeWidth={2} />
            </button>
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2.5 bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:text-[var(--primary-color)] rounded-2xl transition-all active:scale-95 border border-gray-100 dark:border-slate-800"
            >
              {isMobileSearchOpen ? <X size={22} strokeWidth={2} /> : <Search size={22} strokeWidth={2} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-8 flex-1 lg:flex-none justify-center lg:justify-start">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src={storeSettings.shopLogo || "/logo_icon.png"}
                  alt={storeSettings.shopName}
                  className="h-10 lg:h-12 w-auto transition-transform group-hover:scale-110 duration-300 object-contain"
                />
                <div className="absolute -inset-1 bg-blue-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-black text-[#0f172a] dark:text-white uppercase tracking-tighter leading-none italic">
                  {storeSettings.shopName?.split(' ')[0] || 'SWEETO'} <span className="text-blue-600">{storeSettings.shopName?.split(' ').slice(1).join(' ') || 'HUBS'}</span>
                </span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none mt-1">
                  {storeSettings.storeTagline || 'Premium Electronics'}
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center space-x-6 text-[12px] font-black uppercase tracking-widest text-gray-500">
              <Link to="/" className="hover:text-[var(--primary-color)] transition-colors">Home</Link>
              <Link to="/category/Computers" className="hover:text-[var(--primary-color)] transition-colors">Computers</Link>
              <Link to="/category/Electronics" className="hover:text-[var(--primary-color)] transition-colors">Electronics</Link>
              <Link to="/category/Accessories" className="hover:text-[var(--primary-color)] transition-colors">Accessories</Link>
            </nav>
          </div>

          {/* Massive Search Bar (Desktop) - Reduced size for better layout */}
          <div className="hidden xl:block flex-1 max-w-lg">
            <form onSubmit={handleSearch} className="relative group">
              <div className="flex items-center border-2 border-gray-200 dark:border-white/10 rounded-full overflow-hidden hover:border-[var(--primary-color)] dark:hover:border-[var(--primary-color)] transition-all bg-white dark:bg-slate-900 shadow-sm">

                <input
                  type="text"
                  placeholder="Search for products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-5 py-2 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm"
                />
                <button type="submit" className="bg-[var(--primary-color)] hover:opacity-90 text-white px-6 py-2 transition-colors flex items-center gap-2 font-bold">
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 lg:space-x-6 flex-shrink-0">
            <button
              onClick={() => openWishlist()}
              className="flex items-center relative group text-gray-700 dark:text-gray-300 hover:text-[var(--primary-color)] transition-colors focus:outline-none"
              title="View Wishlist"
            >
              <Heart size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center border border-white shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Customer Account */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center group relative">
                <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[var(--primary-color)] transition-colors">
                  <User size={24} strokeWidth={1.5} />
                  <div className="text-left hidden lg:block">
                    <p className="text-[10px] leading-tight font-medium text-gray-400 uppercase">Account</p>
                    <p className="text-xs font-bold uppercase tracking-wider">{isAdmin ? 'Admin' : (user?.displayName?.split(' ')[0] || 'User')}</p>
                  </div>
                </button>
                <div className="absolute top-10 right-0 w-56 bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-slate-800 rounded-3xl p-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform origin-top-right scale-95 group-hover:scale-100 z-50">
                  <div className="px-4 py-3 mb-2 border-b border-gray-50 dark:border-slate-800">
                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">{user?.displayName || 'User'}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                  </div>

                  {isAdmin && (
                    <Link to="/admin" className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 rounded-2xl flex items-center gap-3 transition-colors mb-1">
                      <Package size={16} /> Admin Panel
                    </Link>
                  )}

                  <button onClick={logout} className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl flex items-center gap-3 transition-colors">
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center text-gray-700 dark:text-gray-300 hover:text-[var(--primary-color)] transition-colors gap-2">
                <User size={24} strokeWidth={1.5} />
                <span className="text-xs font-bold uppercase hidden lg:block text-nowrap">Sign In</span>
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="hidden sm:flex items-center text-gray-700 dark:text-gray-300 hover:text-[var(--primary-color)] transition-colors"
            >
              {isDarkMode ? <Sun size={24} strokeWidth={1.5} /> : <Moon size={24} strokeWidth={1.5} />}
            </button>

            <button
              onClick={openCart}
              className="flex items-center gap-2 lg:gap-3 group text-gray-700 dark:text-gray-300 hover:text-[var(--primary-color)] transition-colors border-l border-gray-100 dark:border-slate-800 pl-2 lg:pl-6 focus:outline-none"
            >
              <div className="relative">
                <ShoppingCart size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform lg:w-7 lg:h-7" />
                <span className="absolute -top-2 -right-2 bg-[var(--primary-color)] text-white text-[10px] font-bold rounded-full h-4 lg:h-5 w-4 lg:w-5 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                  {cartCount}
                </span>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-[11px] leading-tight font-medium text-gray-400 uppercase">Cart</p>
                <p className="text-xs font-bold uppercase tracking-wider">{formatPrice(cartTotal || 0)}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Expandable) */}
        {isMobileSearchOpen && (
          <div className="mt-4 xl:hidden animate-in slide-in-from-top duration-300">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 outline-none text-gray-900 dark:text-white placeholder-gray-400 font-medium"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--primary-color)]">
                <Search size={22} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`fixed inset-0 z-[200] xl:hidden transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Menu Content */}
        <div className={`absolute top-0 left-0 bottom-0 w-[300px] bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-black text-gray-400 italic tracking-widest uppercase">Hub Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Tab Switcher - Only shown when sidebar is NOT visible (small screens) */}
            {!isLargeScreen && (
              <div className="flex mb-8 border-b border-gray-100 dark:border-slate-800">
                <button
                  onClick={() => setActiveMobileTab('categories')}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeMobileTab === 'categories'
                      ? 'text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800/50'
                      : 'text-gray-400'
                    }`}
                >
                  Categories
                  {activeMobileTab === 'categories' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600"></div>}
                </button>
                <button
                  onClick={() => setActiveMobileTab('menu')}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeMobileTab === 'menu'
                      ? 'text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800/50'
                      : 'text-gray-400'
                    }`}
                >
                  Menu
                  {activeMobileTab === 'menu' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600"></div>}
                </button>
              </div>
            )}

            <nav className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-2.5">
              {activeMobileTab === 'categories' ? (
                <>
                  {allCategories && allCategories.length > 0 ? (
                    allCategories.map(category => {
                      const categoryName = category.name;
                      const categoryId = category.id;

                      return (
                        <Link
                          key={categoryId}
                          to={`/category/${encodeURIComponent(categoryName)}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-gray-900 dark:text-white font-bold uppercase text-[11px] tracking-widest border border-transparent hover:border-[var(--primary-color)]/20 transition-all"
                        >
                          {categoryName} <ChevronDown size={14} className="-rotate-90 text-gray-400" />
                        </Link>
                      );
                    })
                  ) : (
                    <>
                      <Link to="/category/Computers" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-gray-900 dark:text-white font-bold uppercase text-[11px] tracking-widest">
                        Computers <ChevronDown size={14} className="-rotate-90 text-gray-400" />
                      </Link>
                      <Link to="/category/Electronics" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-gray-900 dark:text-white font-bold uppercase text-[11px] tracking-widest">
                        Electronics <ChevronDown size={14} className="-rotate-90 text-gray-400" />
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-gray-900 dark:text-white font-bold uppercase text-[11px] tracking-widest border border-transparent hover:border-[var(--primary-color)]/20 transition-all">
                    Home <ChevronDown size={14} className="-rotate-90 text-gray-400" />
                  </Link>

                  <button
                    onClick={() => { openWishlist(); setIsMobileMenuOpen(false); }}
                    className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-gray-900 dark:text-white font-bold uppercase text-[11px] tracking-widest text-left border border-transparent hover:border-red-500/20 transition-all"
                  >
                    My Wishlist <Heart size={14} className="text-red-500" />
                  </button>

                  <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-gray-900 dark:text-white font-bold uppercase text-[11px] tracking-widest border border-transparent hover:border-[var(--primary-color)]/20 transition-all">
                    About Us <ChevronDown size={14} className="-rotate-90 text-gray-400" />
                  </Link>

                  <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-gray-900 dark:text-white font-bold uppercase text-[11px] tracking-widest border border-transparent hover:border-[var(--primary-color)]/20 transition-all">
                    Contact Us <ChevronDown size={14} className="-rotate-90 text-gray-400" />
                  </Link>

                  {/* Mobile Dark Mode Toggle */}
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-gray-900 dark:text-white font-bold uppercase text-[11px] tracking-widest"
                  >
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                  </button>

                  {isAuthenticated ? (
                    <>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-5 bg-[var(--primary-color)] text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest mt-4 shadow-lg shadow-[var(--primary-color)]/20">
                          Admin Panel <Package size={16} />
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                        className="flex items-center justify-between p-5 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-2xl font-bold uppercase text-[11px] tracking-widest mt-2"
                      >
                        Sign Out <LogOut size={16} />
                      </button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-5 bg-[var(--primary-color)] text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest mt-4 shadow-lg shadow-[var(--primary-color)]/20">
                      Sign In <User size={16} />
                    </Link>
                  )}
                </>
              )}
            </nav>

            <div className="mt-auto pt-10">
              <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary-color)] mb-2">Customer Support</p>
                <p className="text-white font-black text-sm tracking-tight mb-4">{storeSettings.shopPhone || '+1-800-SWEETO'}</p>
                <div className="h-px bg-slate-800 mb-4"></div>
                <p className="text-gray-400 text-[10px] leading-relaxed">
                  Need help with your order? Our team is available 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;



import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { useStoreData } from '../../contexts/StoreDataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LogOut, Globe, Settings, Package, Grid3x3, Home, Sun, Moon, Warehouse, Receipt, MousePointer2, Video, Bell, X, AlertTriangle, TrendingUp, Search, Menu } from 'lucide-react';

const AdminHeader = ({ onOpenSearch, onToggleMobileMenu }) => {
  const { user, logout } = useAdminAuth();
  const { t, language, toggleLanguage } = useAdminLocale();
  const { storeSettings, products, salesRecords, notifications, markNotificationRead, clearNotifications } = useStoreData();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  // Derive notifications
  const allNotifications = React.useMemo(() => {
    const alerts = [...notifications.map(n => ({ ...n, date: new Date(n.timestamp || n.date) }))];
    
    // Low Stock Alerts (Generated on the fly if not already in store notifications)
    products.forEach(p => {
      if ((p.stockQuantity || 0) < 5) {
        if (!notifications.some(n => n.referenceId === `stock-${p.id}`)) {
          alerts.push({
            id: `stock-${p.id}`,
            type: 'stock',
            title: 'Low Stock Alert',
            message: `${p.name} is running low (${p.stockQuantity} left)`,
            date: new Date(),
            severity: 'high'
          });
        }
      }
    });

    return alerts.sort((a, b) => b.date - a.date);
  }, [products, salesRecords, notifications]);

  const unreadCount = allNotifications.filter(n => !n.read).length;
  const hasNotifications = unreadCount > 0;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-black/5 border-b border-[var(--border-color)] sticky top-0 z-50 transition-all duration-500">
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            {/* Mobile Menu Toggle */}
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden mr-4 p-2 text-gray-500 hover:text-[var(--primary-color)] dark:text-slate-400 dark:hover:text-[var(--primary-color)] bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-100 dark:border-slate-800 transition-colors"
            >
              <Menu size={24} />
            </button>
            
            {/* Logo and Shop Name */}
          <div className="flex items-center group cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
            <div className="relative">
              <img 
                src={storeSettings.shopLogo || "/logo_icon.png"} 
                alt={storeSettings.shopName}
                className="h-10 w-10 rounded-xl mr-4 object-contain shadow-lg group-hover:rotate-6 transition-transform"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div>
              <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic translate-y-0.5 inline-block group-hover:text-[var(--primary-color)] transition-colors">
                {storeSettings.shopName?.split(' ')[0] || 'SWEETO'} <span className="text-blue-600">{storeSettings.shopName?.split(' ').slice(1).join(' ') || 'HUBS'}</span>
              </span>
              <p className="text-[10px] font-black text-[var(--primary-color)] uppercase tracking-widest -mt-1 opacity-60">Admin Central</p>
            </div>
          </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-slate-950 text-gray-400 dark:text-slate-500 border border-gray-100 dark:border-slate-800 rounded-2xl hover:border-[var(--primary-color)]/50 hover:bg-white dark:hover:bg-slate-900 transition-all group"
            >
              <Search size={16} className="group-hover:text-[var(--primary-color)] transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-widest">Search...</span>
              <div className="flex items-center gap-1 ml-2">
                <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-[9px] font-black">CTRL</span>
                <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-[9px] font-black">K</span>
              </div>
            </button>

            <div className="flex items-center bg-gray-50 dark:bg-slate-950 p-1 rounded-xl border border-gray-100 dark:border-slate-800">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 text-gray-500 dark:text-slate-400 hover:text-[var(--primary-color)] hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-all"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="w-px h-4 bg-gray-200 dark:bg-slate-800 mx-1" />

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center text-gray-500 dark:text-slate-400 hover:text-[var(--primary-color)] hover:bg-white dark:hover:bg-slate-900 px-3 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                title={t('adminPanelLanguage')}
              >
                <Globe size={16} className="mr-1.5 text-[var(--primary-color)]" />
                {language === 'en' ? 'EN' : 'FR'}
              </button>
            </div>

            {/* Notifications Bell */}
            <div className="relative mr-2">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-3 relative rounded-2xl transition-all active:scale-95 ${
                  isNotificationsOpen 
                    ? 'bg-[var(--primary-color)] text-white shadow-lg shadow-[var(--primary-color)]/30' 
                    : 'bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-slate-400 border border-gray-100 dark:border-slate-800'
                }`}
              >
                <Bell size={18} className={hasNotifications && !isNotificationsOpen ? 'animate-bounce' : ''} />
                {hasNotifications && (
                  <span className="absolute top-2.5 right-2.5 flex items-center justify-center min-w-[14px] h-[14px] bg-red-500 text-white text-[8px] font-black rounded-full border-2 border-white dark:border-slate-900 px-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="absolute top-14 right-0 w-80 bg-white dark:bg-slate-900 shadow-2xl border border-gray-100 dark:border-slate-800 rounded-[2rem] overflow-hidden z-50 animate-ai-zoom-in">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-950/50">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">{unreadCount} NEW</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        {notifications.length > 0 && (
                          <button 
                            onClick={clearNotifications}
                            className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:opacity-70 transition-all"
                          >
                            Clear All
                          </button>
                        )}
                        <button onClick={() => setIsNotificationsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto hide-scrollbar">
                      {allNotifications.length === 0 ? (
                        <div className="p-10 text-center">
                          <Bell size={32} className="mx-auto mb-3 text-gray-200 dark:text-slate-800" />
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">All caught up!</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
                          {allNotifications.map((n) => (
                            <div 
                              key={n.id} 
                              className={`p-5 transition-colors cursor-pointer group/item ${n.read ? 'opacity-60' : 'bg-blue-50/30 dark:bg-blue-500/5 border-l-2 border-blue-500'}`}
                              onClick={() => {
                                if (!n.read && n.id && !n.id.toString().startsWith('stock-')) markNotificationRead(n.id);
                                if (n.type === 'review') navigate('/admin/reviews');
                                if (n.type === 'sale') navigate('/admin/sales');
                                setIsNotificationsOpen(false);
                              }}
                            >
                              <div className="flex gap-3">
                                <div className={`mt-1 p-2 rounded-xl shrink-0 ${
                                  n.type === 'stock' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 
                                  n.type === 'review' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                                  'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                                }`}>
                                  {n.type === 'stock' ? <AlertTriangle size={14} /> : n.type === 'review' ? <MessageSquare size={14} /> : <TrendingUp size={14} />}
                                </div>
                                <div className="flex-grow">
                                  <div className="flex justify-between items-start mb-0.5">
                                    <p className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-white">{n.title}</p>
                                    {!n.read && n.id && !n.id.toString().startsWith('stock-') && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-slate-400 leading-snug mb-1.5">{n.message}</p>
                                  <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase italic">
                                    {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="h-10 w-px bg-gray-100 dark:bg-slate-800 hidden sm:block mx-2" />

            {/* User Info & Logout */}
            <div className="flex items-center">
              <div className="hidden sm:flex flex-col items-end mr-4 group">
                <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Logged as</span>
                <span className="text-sm font-black text-gray-900 dark:text-white group-hover:text-[var(--primary-color)] transition-colors">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-3.5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/5 flex items-center group active:scale-95"
              >
                <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
